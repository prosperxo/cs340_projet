const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path')

const PORT = process.env.PORT || 4530;

const app = express();

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
        title: 'Game Vault - Admin Panel',
        headerTitle: 'Game Vault Admin Panel',
        headerDescription: 'Manage all aspects of your game library and customer interactions.'
    });
});

app.get('/customers', (req, res) => {
    const customers = [
        { id: 1, email: 'alice@example.com', firstName: 'Alice', lastName: 'Brown', signupDate: '2024-01-01' },
        { id: 2, email: 'bob@example.com', firstName: 'Bob', lastName: 'Smith', signupDate: '2024-01-02' }
    ];
    res.render('customers', {
        title: 'Manage Customers',
        headerTitle: 'Manage Customers',
        headerDescription: 'View, add, update, or delete customer records.',
        customers: customers
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://classwork.engr.oregonstate.edu:${PORT}`);
});
