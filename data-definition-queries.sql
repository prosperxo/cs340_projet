-- Temporarily disable foreign key constraint checks to prevent errors during the creation of tables that reference each other. 
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT=0;

-- refresh tables to start from beginning
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Sales;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Wishlist;
DROP TABLE IF EXISTS Library;

-- Schema is normalized to 3NF because there are no repeating groups, all tables with atomic values, and each with primary key

-- Games table
-- no transitive dependencies, so Games is in 3NF
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
-- no transitivie dependencies, so Customers is in 3NF
CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    signupDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
-- no transitivie dependencies, so Sales is in 3NF 
CREATE TABLE Sales (
    saleID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    orderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    totalAmount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- OrderItems table
-- no transitive dependencies, so OrderItems is in 3NF
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
-- no transitive dependencies, so Reviews is in 3NF
CREATE TABLE Reviews (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    gameID INT NOT NULL,
    customerID INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 0 AND 10),
    comment TEXT,
    reviewDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- Wishlist table
-- intersection table for M:M relationships between Customers and Games
CREATE TABLE Wishlist (
    customerID INT NOT NULL,
    gameID INT NOT NULL,
    PRIMARY KEY (customerID, gameID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- Library table
-- intersection table for M:M relationships between Customers and Games
CREATE TABLE Library (
    customerID INT NOT NULL,
    gameID INT NOT NULL,
    PRIMARY KEY (customerID, gameID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- Data Insertion for Games table
INSERT INTO Games (title, releaseDate, genre, platform, avgRating, copiesSold)
VALUES 
    ('The Legend of Zelda: Breath of the Wild', '2017-03-03', 'Adventure', 'Nintendo Switch', 9.7, 2000000), -- gameID = 1
    ('Cyberpunk 2077', '2020-12-10', 'RPG', 'PC', 7.5, 1300000),                                            -- gameID = 2
    ('Among Us', '2018-06-15', 'Party', 'Mobile', 8.2, 500000),                                              -- gameID = 3
    ('God of War', '2018-04-20', 'Action', 'PlayStation', 9.6, 1500000),                                     -- gameID = 4
    ('Minecraft', '2011-11-18', 'Sandbox', 'PC', 9.3, 3000000);                                              -- gameID = 5

-- Data Insertion for Customers table
INSERT INTO Customers (email, password, firstName, lastName)
VALUES 
    ('alice.brown@example.com', 'password1', 'Alice', 'Brown'),      -- customerID = 1
    ('bob.smith@example.com', 'password2', 'Bob', 'Smith'),          -- customerID = 2
    ('charlie.jones@example.com', 'password3', 'Charlie', 'Jones'),  -- customerID = 3
    ('diana.johnson@example.com', 'password4', 'Diana', 'Johnson'),  -- customerID = 4
    ('edward.lee@example.com', 'password5', 'Edward', 'Lee');        -- customerID = 5

-- Data Insertion for Sales table
INSERT INTO Sales (customerID, totalAmount)
VALUES 
    (1, 59.99),
    (2, 49.99),
    (3, 29.99),
    (4, 19.99),
    (5, 39.99);

-- Data Insertion for OrderItems table
INSERT INTO OrderItems (saleID, gameID, quantity, price)
VALUES 
    (1, 1, 1, 59.99),
    (2, 2, 1, 49.99),
    (3, 3, 1, 29.99),
    (4, 4, 1, 19.99),
    (5, 5, 1, 39.99);

-- Data Insertion for Reviews table
INSERT INTO Reviews (gameID, customerID, rating, comment)
VALUES 
    (1, 1, 9, 'An incredible open-world experience with stunning visuals. Must play game.'),
    (2, 2, 7, 'Fun gameplay but lots of bugs at launch. Although it had rough start, game overall is amazing.'),
    (3, 3, 8, 'Perfect party game to play with friends. Easy game for anyone to be a part of for all ages.'),
    (4, 4, 10, 'An intense and emotional action-adventure journey. Game could be best game of our generation.'),
    (5, 5, 9, 'Endlessly creative and fun sandbox game. Could play this game for hours on hours.');

-- Data Insertion for Wishlist table
-- recall customerID is set to autoincrement starting at 1 so Alice would be 1, Bob 2, etc...
INSERT INTO Wishlist (customerID, gameID)
VALUES 
    (1, 1),  -- Alice wishes for The Legend of Zelda
    (1, 3),  -- Alice wishes for Among Us
    (2, 2),  -- Bob wishes for Cyberpunk 2077
    (3, 4),  -- Charlie wishes for God of War
    (4, 1),  -- Diana wishes for The Legend of Zelda
    (5, 5),  -- Edward wishes for Minecraft
    (2, 5),  -- Bob also wishes for Minecraft
    (3, 1);  -- Charlie also wishes for The Legend of Zelda

-- Data Insertion for Library table
-- recall gameID is set to autoincrement starting at 1 so Zelda is 1, Cyberpunk 2, etc.
INSERT INTO Library (customerID, gameID)
VALUES 
    (1, 1),  -- Alice owns The Legend of Zelda
    (1, 5),  -- Alice owns Minecraft
    (2, 2),  -- Bob owns Cyberpunk 2077
    (3, 4),  -- Charlie owns God of War
    (4, 3),  -- Diana owns Among Us
    (5, 5),  -- Edward owns Minecraft
    (4, 1),  -- Diana also owns The Legend of Zelda
    (3, 2);  -- Charlie also owns Cyberpunk 2077

-- Re-enable foreign key checks and commit the transaction
SET FOREIGN_KEY_CHECKS=1;
COMMIT;