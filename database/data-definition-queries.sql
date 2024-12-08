
-- Temporarily disable foreign key constraint checks to prevent errors during the creation of tables that reference each other
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Refresh tables to start from the beginning
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Sales;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Wishlist;
DROP TABLE IF EXISTS Library;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Games;

-- Schema is normalized to 3NF because there are no repeating groups, all tables with atomic values, and each with a primary key

-- Games table
CREATE TABLE Games (
    gameID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    releaseDate DATE NOT NULL,
    genre VARCHAR(100) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    avgRating FLOAT CHECK (avgRating BETWEEN 0.0 AND 10.0),
    copiesSold INT DEFAULT 0 NOT NULL
);

-- Customers table
CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    signupDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE Sales (
    saleID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    orderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    totalAmount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- OrderItems table
CREATE TABLE OrderItems (
    orderItemID INT AUTO_INCREMENT PRIMARY KEY,
    saleID INT NOT NULL,
    gameID INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (saleID) REFERENCES Sales(saleID) ON DELETE CASCADE,
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE Reviews (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    gameID INT NOT NULL,
    customerID INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 0 AND 10),
    comment TEXT NULL,
    reviewDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE Wishlist (
    customerID INT NOT NULL,
    gameID INT NOT NULL,
    PRIMARY KEY (customerID, gameID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- Library table
CREATE TABLE Library (
    customerID INT NOT NULL,
    gameID INT NOT NULL,
    PRIMARY KEY (customerID, gameID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- Insert data into Games table
INSERT INTO Games (title, releaseDate, genre, platform, avgRating, copiesSold)
VALUES 
    ('The Legend of Zelda: Breath of the Wild', '2017-03-03', 'Adventure', 'Nintendo Switch', 9.7, 2000000),
    ('Cyberpunk 2077', '2020-12-10', 'RPG', 'PC', 7.5, 1300000),
    ('Among Us', '2018-06-15', 'Party', 'Mobile', 8.2, 500000),
    ('God of War', '2018-04-20', 'Action', 'PlayStation', 9.6, 1500000),
    ('Minecraft', '2011-11-18', 'Sandbox', 'PC', 9.3, 3000000);

-- Insert data into Customers table
INSERT INTO Customers (email, password, firstName, lastName)
VALUES 
    ('alice.brown@example.com', 'password1', 'Alice', 'Brown'),
    ('bob.smith@example.com', 'password2', 'Bob', 'Smith'),
    ('charlie.jones@example.com', 'password3', 'Charlie', 'Jones'),
    ('diana.johnson@example.com', 'password4', 'Diana', 'Johnson'),
    ('edward.lee@example.com', 'password5', 'Edward', 'Lee');

-- Insert data into Sales table
INSERT INTO Sales (customerID, totalAmount)
VALUES 
    (1, 59.99), -- Sale made by Customer 1 (Alice) with a total amount of $59.99.
    (2, 49.99), -- Sale made by Customer 2 (Bob) with a total amount of $49.99.
    (3, 29.99), -- Sale made by Customer 3 (Charlie) with a total amount of $29.99.
    (4, 19.99), -- Sale made by Customer 4 (Diana) with a total amount of $19.99.
    (5, 39.99); -- Sale made by Customer 5 (Edward) with a total amount of $39.99.

-- Insert data into OrderItems table
INSERT INTO OrderItems (saleID, gameID, quantity, price)
VALUES 
    (1, 1, 1, 59.99), -- Sale 1: 1 copy of Game 1 (The Legend of Zelda: Breath of the Wild) at $59.99.
    (2, 2, 1, 49.99), -- Sale 2: 1 copy of Game 2 (Cyberpunk 2077) at $49.99.
    (3, 3, 1, 29.99), -- Sale 3: 1 copy of Game 3 (Among Us) at $29.99.
    (4, 4, 1, 19.99), -- Sale 4: 1 copy of Game 4 (God of War) at $19.99.
    (5, 5, 1, 39.99); -- Sale 5: 1 copy of Game 5 (Minecraft) at $39.99.

-- Insert data into Reviews table
INSERT INTO Reviews (gameID, customerID, rating, comment, reviewDate)
VALUES 
    (1, 1, 9, 'An incredible open-world experience.', '2023-06-21 12:30:00'), -- Game 1 (The Legend of Zelda) reviewed by Customer 1 (Alice) with a rating of 9.
    (2, 2, 7, 'Great gameplay but had bugs.', '2023-06-22 13:45:00'),         -- Game 2 (Cyberpunk 2077) reviewed by Customer 2 (Bob) with a rating of 7.
    (3, 3, 8, 'Perfect party game.', '2023-06-23 15:20:00'),                  -- Game 3 (Among Us) reviewed by Customer 3 (Charlie) with a rating of 8.
    (4, 4, 10, NULL, '2023-06-24 09:30:00'),                                  -- Game 4 (God of War) reviewed by Customer 4 (Diana) with a rating of 10 (no comment).
    (5, 5, 9, 'Endlessly creative.', '2023-06-25 10:50:00');                  -- Game 5 (Minecraft) reviewed by Customer 5 (Edward) with a rating of 9.

-- Insert data into Wishlist table
INSERT INTO Wishlist (customerID, gameID)
VALUES 
    (1, 1), -- Customer 1 (Alice) wishes for Game 1 (The Legend of Zelda).
    (1, 3), -- Customer 1 (Alice) wishes for Game 3 (Among Us).
    (2, 2), -- Customer 2 (Bob) wishes for Game 2 (Cyberpunk 2077).
    (3, 4), -- Customer 3 (Charlie) wishes for Game 4 (God of War).
    (4, 1); -- Customer 4 (Diana) wishes for Game 1 (The Legend of Zelda).

-- Insert data into Library table
INSERT INTO Library (customerID, gameID)
VALUES 
    (1, 1), -- Customer 1 (Alice) owns Game 1 (The Legend of Zelda).
    (1, 5), -- Customer 1 (Alice) owns Game 5 (Minecraft).
    (2, 2), -- Customer 2 (Bob) owns Game 2 (Cyberpunk 2077).
    (3, 4), -- Customer 3 (Charlie) owns Game 4 (God of War).
    (4, 3); -- Customer 4 (Diana) owns Game 3 (Among Us).

SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;
COMMIT;
