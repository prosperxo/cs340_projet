const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path')

const PORT = process.env.PORT || 4550;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

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
    res.render('index', {
        js_file: 'index',
        title: 'Game Vault - Admin Panel',
        headerTitle: 'Game Vault Admin Panel',
        headerDescription: 'Manage all aspects of your game library and customer interactions.'
    });
});

app.get('/games', (req, res) => {
    const games = [
        { id: 1, title: 'The Legend of Zelda', releaseDate: '2017-03-03', genre: 'Adventure', platform: 'Nintendo Switch', avgRating: '9.7', copiesSold: '2000000' }
    ];
    res.render('games', {
        js_file: 'games',
        title: 'Manage Games',
        headerTitle: 'Manage Games',
        headerDescription: 'View, add, update, or delete games records.',
        games: games
    });
});

app.get('/customers', (req, res) => {
    const customers = [
        { id: 1, email: 'alice@example.com', firstName: 'Alice', lastName: 'Brown', signupDate: '2024-01-01' },
        { id: 2, email: 'bob@example.com', firstName: 'Bob', lastName: 'Smith', signupDate: '2024-01-02' }
    ];
    res.render('customers', {
        js_file: 'customers',
        title: 'Manage Customers',
        headerTitle: 'Manage Customers',
        headerDescription: 'View, add, update, or delete customer records.',
        customers: customers
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
    const reviews = [
        { customerId: 1, gameId: 1, rating: 9, comment: "An incredible open-world experience.", reviewDate: "2023-06-21"},
    ];
    res.render('reviews', {
        js_file: 'reviews',
        title: 'Manage Reviews',
        headerTitle: 'Manage Review',
        headerDescription: 'View, add, update, or delete review records.',
        reviews: reviews
    });
});

app.get('/sales', (req, res) => {
    const sales = [
        { id: 1, customerId: 1, orderDate: "2023-06-21", totalAmount: 59.99},
    ];
    res.render('sales', {
        js_file: 'sales',
        title: 'Manage Sales',
        headerTitle: 'Manage Sales',
        headerDescription: 'View, add, update, or delete sale records.',
        sales: sales
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
