const express = require('express');
const db = require('./database/db-connector'); // Import the database connection
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 4531;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Diagnostic route to test database connectivity
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
            res.status(500).send('Error initializing database');
            return;
        }

        db.pool.query(query2, (err) => {
            if (err) {
                console.error('Error creating table:', err);
                res.status(500).send('Error initializing database');
                return;
            }

            db.pool.query(query3, (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).send('Error initializing database');
                    return;
                }

                db.pool.query(query4, (err, results) => {
                    if (err) {
                        console.error('Error selecting data:', err);
                        res.status(500).send('Error initializing database');
                        return;
                    }

                    res.send(JSON.stringify(results));
                });
            });
        });
    });
});

// Handle Add Customer
app.post('/addCustomer', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert customer into the database
        const query = `INSERT INTO Customers (email, password, firstName, lastName) VALUES (?, ?, ?, ?)`;
        db.pool.query(query, [email, hashedPassword, firstName, lastName], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error adding customer. Please try again.' });
            }
            res.status(201).json({ message: 'Customer added successfully!' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error adding customer. Please try again.' });
    }
});

// Handle Update Customer
app.post('/updateCustomer', async (req, res) => {
    const { customerID, email, password, firstName, lastName } = req.body;

    if (!customerID || !email || !firstName || !lastName) {
        res.status(400).send('Customer ID, email, first name, and last name are required.');
        return;
    }

    try {
        let query;
        const params = [];

        // Hash the password only if it's provided
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
                return res.status(500).json({ error: 'Error updating customer. Please try again.' });
            }
            res.status(200).json({ message: 'Customer updated successfully!' });
            res.redirect('/customers.html');
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating customer. Please try again.' });
    }
});

// Handle Delete Customer
app.post('/deleteCustomer', (req, res) => {
    const { customerID } = req.body;

    if (!customerID) {
        return res.status(400).json({ error: 'Customer ID is required.' });
    }

    db.pool.query('DELETE FROM Customers WHERE customerID = ?', [customerID], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting customer. Please try again.' });
        }
        res.status(200).json({ message: 'Customer deleted successfully!' });
        res.redirect('/customers.html');
    });
});

// Serve Customer Data (Browse Customers)
app.get('/getCustomers', (req, res) => {
    db.pool.query('SELECT * FROM Customers', (err, rows) => {
        if (err) {
            console.error('Error fetching customers:', err);
            res.status(500).send('Error fetching customers');
            return;
        }
        res.json(rows);
    });
});

// Serve other static pages
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://classwork.engr.oregonstate.edu:${PORT}`);
});
