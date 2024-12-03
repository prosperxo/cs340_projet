const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path')
const bodyParser = require('body-parser')  
const bcrypt = require('bcrypt');
const db = require('./database/db-connector');

const PORT = process.env.PORT || 4550;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'), // Ensure this points to the layouts directory
    partialsDir: path.join(__dirname, 'views', 'partials'), // Optional, if you're using partials
    defaultLayout: 'main'
}));

app.set('views', path.join(__dirname, 'views')); // Explicitly set the views directory
app.set('layouts', path.join(__dirname, 'views', 'layouts'));
app.set('view engine', 'hbs'); // Use Handlebars as the template engine

// Routes
app.get('/', (req, res) => {
    // Define test queries
    const query1 = 'DROP TABLE IF EXISTS diagnostic;';
    const query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
    const query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working for your_database!")'; // Update your_database
    const query4 = 'SELECT * FROM diagnostic;';

    // Execute queries sequentially
    db.pool.query(query1, (err) => {
        if (err) {
            console.error('Error dropping table:', err);
            return res.status(500).send('Error initializing database');
        }
        db.pool.query(query2, (err) => {
            if (err) {
                console.error('Error creating table:', err);
                return res.status(500).send('Error initializing database');
            }
            db.pool.query(query3, (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).send('Error initializing database');
                }
                db.pool.query(query4, (err, results) => {
                    if (err) {
                        console.error('Error selecting data:', err);
                        return res.status(500).send('Error initializing database');
                    }

                    res.render('index', {
                        js_file: 'index',
                        title: 'Game Vault - Admin Panel',
                        headerTitle: 'Game Vault Admin Panel',
                        headerDescription: 'Manage all aspects of your game library and customer interactions.',
                        results: JSON.stringify(results)
                    });
                });
            });
        });
    });
});

app.get('/games', (req, res) => {
    db.pool.query('SELECT * FROM Games', (err, games) => {
        if (err) {
            console.error('Error fetching games:', err);
            res.status(500).send('Error fetching games');
            return;
        }

        res.render('games', {
            js_file: 'games',
            title: 'Manage Games',
            headerTitle: 'Manage Games',
            headerDescription: 'View, add, update, or delete games records.',
            games: games
        });
    });

});

app.post('/addGame', async (req, res) => { 
    const { title, releaseDate, genre, platform, avgRating, copiesSold } = req.body;

    try {
        const query = `INSERT INTO Games (title, releaseDate, genre, platform, avgRating, copiesSold) VALUES (?, ?, ?, ?, ?, ?)`;

        db.pool.query(query, [title, releaseDate, genre, platform, avgRating, copiesSold], (err) => {
            if (err) {
                console.error('Error adding game:', err);
                return res.status(500).send('Error adding game');
            }
            res.redirect('/games');
        });
    } catch (error) {
        console.error('Error adding game:', error.message);
        res.status(500).send('Error adding game');
    }
});

app.post('/updateGame', async (req, res) => { 
    const { gameID, title, releaseDate, genre, platform, avgRating, copiesSold } = req.body;

    try {
        let query;
        const params = [];

        query = `UPDATE Games SET title = ?, releaseDate = ?, genre = ?, platform = ?, avgRating = ?, copiesSold = ? WHERE gameID = ?`;
        params.push(title, releaseDate, genre, platform, avgRating, copiesSold, gameID);

        db.pool.query(query, params, (err) => {
            if (err) {
                console.error('Error updating game:', err);
                return res.status(500).send('Error updating game');
            }
            res.redirect('/games');
        });
    } catch (error) {
        console.error('Error updating game:', error.message);
        res.status(500).send('Error updating game');
    }
});

app.post('/deleteGame', (req, res) => { 
    const { gameID } = req.body;

    db.pool.query('DELETE FROM Games WHERE gameID = ?', [gameID], (err) => {
        if (err) {
            console.error('Error deleting game:', err);
            return res.status(500).send('Error deleting game');
        }
        res.redirect('/games');
    });
});

app.get('/customers', (req, res) => {
    db.pool.query('SELECT * FROM Customers', (err, customers) => {
        if (err) {
            console.error('Error fetching customers:', err);
            res.status(500).send('Error fetching customers');
            return;
        }

        res.render('customers', {
            js_file: 'customers',
            title: 'Manage Customers',
            headerTitle: 'Manage Customers',
            headerDescription: 'View, add, update, or delete customer records.',
            customers: customers
        });
    });
});

app.post('/addCustomer', async (req, res) => { 
    const { email, password, firstName, lastName } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO Customers (email, password, firstName, lastName) VALUES (?, ?, ?, ?)`;

        db.pool.query(query, [email, hashedPassword, firstName, lastName], (err) => {
            if (err) {
                console.error('Error adding customer:', err);
                return res.status(500).send('Error adding customer');
            }
            res.redirect('/customers');
        });
    } catch (error) {
        console.error('Error adding customer:', error.message);
        res.status(500).send('Error adding customer');
    }
});

app.post('/updateCustomer', async (req, res) => { 
    const { customerID, email, password, firstName, lastName } = req.body;

    try {
        let query;
        const params = [];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE Customers SET email = ?, password = ?, firstName = ?, lastName = ? WHERE customerID = ?`;
            params.push(email, hashedPassword, firstName, lastName, customerID);
        } else {
            query = `UPDATE Customers SET email = ?, firstName = ?, lastName = ? WHERE customerID = ?`;
            params.push(email, firstName, lastName, customerID);
        }

        db.pool.query(query, params, (err) => {
            if (err) {
                console.error('Error updating customer:', err);
                return res.status(500).send('Error updating customer');
            }
            res.redirect('/customers');
        });
    } catch (error) {
        console.error('Error updating customer:', error.message);
        res.status(500).send('Error updating customer');
    }
});

app.post('/deleteCustomer', (req, res) => { 
    const { customerID } = req.body;

    db.pool.query('DELETE FROM Customers WHERE customerID = ?', [customerID], (err) => {
        if (err) {
            console.error('Error deleting customer:', err);
            return res.status(500).send('Error deleting customer');
        }
        res.redirect('/customers');
    });
});

app.get('/library', (req, res) => {
    const library = [
        { customerId: 1, gameId: 1},
    ];
    res.render('library', {
        js_file: 'library',
        title: 'Manage Libraries',
        headerTitle: 'Manage Libraries',
        headerDescription: 'View, add, update, or delete library records.',
        library: library
    });
});

app.get('/wishlist', (req, res) => {
    const wishlist = [
        { customerId: 1, gameId: 1},
    ];
    res.render('wishlist', {
        js_file: 'wishlist',
        title: 'Manage Wishlists',
        headerTitle: 'Manage Wishlists',
        headerDescription: 'View, add, update, or delete wishlist records.',
        wishlist: wishlist
    });
});

app.get('/reviews', (req, res) => {
    db.pool.query('SELECT * FROM Reviews', (err, reviews) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            res.status(500).send('Error fetching reviews');
            return;
        }
        res.render('reviews', {
            js_file: 'reviews',
            title: 'Manage Reviews',
            headerTitle: 'Manage Review',
            headerDescription: 'View, add, update, or delete review records.',
            reviews: reviews
        });
    });
});

app.post('/addReview', async (req, res) => { 
    const { customerID, gameID, rating, comment, reviewDate} = req.body;

    try {
        const query = `INSERT INTO Reviews (customerID, gameID, rating, comment, reviewDate) VALUES (?, ?, ?, ?, ?)`;

        db.pool.query(query, [customerID, gameID, rating, comment, reviewDate], (err) => {
            if (err) {
                console.error('Error adding review:', err);
                return res.status(500).send('Error adding review');
            }
            res.redirect('/reviews');
        });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).send('Error adding review');
    }
});

app.post('/updateReview', async (req, res) => { 
    const { reviewID, rating, comment } = req.body;

    try {
        let query;
        const params = [];

        query = `UPDATE Reviews SET rating = ?, comment = ? WHERE reviewID = ?`;
        params.push(rating, comment, reviewID);

        db.pool.query(query, params, (err) => {
            if (err) {
                console.error('Error updating review:', err);
                return res.status(500).send('Error updating review');
            }
            res.redirect('/reviews');
        });
    } catch (error) {
        console.error('Error updating review:', error.message);
        res.status(500).send('Error updating review');
    }
});

app.post('/deleteReview', (req, res) => { 
    const { reviewID } = req.body;

    db.pool.query('DELETE FROM Reviews WHERE reviewID = ?', [reviewID], (err) => {
        if (err) {
            console.error('Error deleting review:', err);
            return res.status(500).send('Error deleting review');
        }
        res.redirect('/reviews');
    });
});

app.get('/sales', (req, res) => {
    db.pool.query('SELECT * FROM Sales', (err, sales) => {
        if (err) {
            console.error('Error fetching sales:', err);
            res.status(500).send('Error fetching sales');
            return;
        }

        res.render('sales', {
            js_file: 'sales',
            title: 'Manage Sales',
            headerTitle: 'Manage Sales',
            headerDescription: 'View, add, update, or delete sale records.',
            sales: sales
        });
    });
});

app.post('/addSale', async (req, res) => { 
    const { customerID, orderDate, totalAmount } = req.body;

    try {
        const query = `INSERT INTO Sales (customerID, orderDate, totalAmount) VALUES (?, ?, ?)`;

        db.pool.query(query, [customerID, orderDate, totalAmount], (err) => {
            if (err) {
                console.error('Error adding sale:', err);
                return res.status(500).send('Error adding sale');
            }
            res.redirect('/sales');
        });
    } catch (error) {
        console.error('Error adding sale:', error.message);
        res.status(500).send('Error adding sale');
    }
});

app.post('/updateSale', async (req, res) => { 
    const { saleID, totalAmount } = req.body;

    try {
        let query;
        const params = [];

        query = `UPDATE Sales SET totalAmount = ? WHERE saleID = ?`;
        params.push(totalAmount, saleID);

        db.pool.query(query, params, (err) => {
            if (err) {
                console.error('Error updating sale:', err);
                return res.status(500).send('Error updating sale');
            }
            res.redirect('/sales');
        });
    } catch (error) {
        console.error('Error updating sale:', error.message);
        res.status(500).send('Error updating sale');
    }
});

app.post('/deleteSale', (req, res) => { 
    const { saleID } = req.body;

    db.pool.query('DELETE FROM Sales WHERE saleID = ?', [saleID], (err) => {
        if (err) {
            console.error('Error deleting sale:', err);
            return res.status(500).send('Error deleting sale');
        }
        res.redirect('/sales');
    });
});

app.get('/orderItems', (req, res) => {
    const orderItems = [
        { saleId: 1, gameId: 1, quantity: 1, price: 59.99},
    ];
    res.render('orderItems', {
        js_file: 'orderItems',
        title: 'Manage Order Items',
        headerTitle: 'Manage Order Items',
        headerDescription: 'View, add, update, or delete order item records.',
        orderItems: orderItems
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://classwork.engr.oregonstate.edu:${PORT}`);
});
