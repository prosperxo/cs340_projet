const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mariadb = require('mariadb'); // Import MariaDB client
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const app = express();
const PORT = process.env.PORT || 4530;

// Create MariaDB connection pool
const pool = mariadb.createPool({
    host: 'localhost', // Update with your database host
    user: 'your_username', // Update with your database username
    password: 'your_password', // Update with your database password
    database: 'your_database', // Update with your database name
    connectionLimit: 5
});

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle Add Customer
app.post('/addCustomer', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert customer into the database
        const query = `INSERT INTO Customers (email, password, firstName, lastName) VALUES (?, ?, ?, ?)`;
        const conn = await pool.getConnection();
        await conn.query(query, [email, hashedPassword, firstName, lastName]);
        conn.release();

        res.redirect('/customers.html'); // Redirect to customer management page
    } catch (error) {
        console.error('Error adding customer:', error.message);
        res.status(500).send('Error adding customer');
    }
});

// Handle Update Customer
app.post('/updateCustomer', async (req, res) => {
    const { customerID, email, password, firstName, lastName } = req.body;

    try {
        let query, params;

        // Hash the password only if it's provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE Customers SET email = ?, password = ?, firstName = ?, lastName = ? WHERE customerID = ?`;
            params = [email, hashedPassword, firstName, lastName, customerID];
        } else {
            query = `UPDATE Customers SET email = ?, firstName = ?, lastName = ? WHERE customerID = ?`;
            params = [email, firstName, lastName, customerID];
        }

        const conn = await pool.getConnection();
        await conn.query(query, params);
        conn.release();

        res.redirect('/customers.html'); // Redirect to customer management page
    } catch (error) {
        console.error('Error updating customer:', error.message);
        res.status(500).send('Error updating customer');
    }
});

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://classwork.engr.oregonstate.edu:${PORT}`);
});
