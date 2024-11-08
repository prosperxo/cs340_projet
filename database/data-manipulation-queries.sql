-- Temporarily disable foreign key constraint checks to prevent errors during the creation of tables that reference each other. 
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT=0;

-- CRUD data manipulation queries for each table

-- Customers Table 
-- Get customer details based on email
SELECT * FROM Customers WHERE email = :emailInput;

-- Insert new customer data
INSERT INTO Customers (email, password, firstName, lastName, signupDate)
VALUES (:emailInput, :passwordInput, :firstNameInput, :lastNameInput, :signupDateInput);

-- Update customer password based on customer ID
UPDATE Customers 
SET password = :passwordInput --maybe update name and last name too?
WHERE customerID = :customerIDInput;

-- Delete customer based on customer ID
DELETE FROM Customers WHERE customerID = :customerIDInput;


-- Games Table
-- Get game details based on title
SELECT * FROM Games WHERE title = :titleInput;

-- Insert new game
INSERT INTO Games (title, releaseDate, genre, platform, avgRating, copiesSold)
VALUES (:titleInput, :releaseDateInput, :genreInput, :platformInput, :avgRatingInput, :copiesSoldInput);

-- Update game rating and copies sold 
UPDATE Games
SET avgRating = :avgRatingInput, copiesSold = :copiesSoldInput
WHERE gameID = :gameIDInput;

-- Delete game based on game ID
DELETE FROM Games WHERE gameID = :gameIDInput;

-- Sales Table
-- Get sales records
SELECT * FROM Sales WHERE customerID = :customerIDInput;

-- Insert new sale
INSERT INTO Sales (customerID, orderDate, totalAmount)
VALUES (:customerIDInput, :orderDateInput, :totalAmountInput);

-- Delete sale record 
DELETE FROM Sales WHERE saleID = :saleIDInput;

-- OrderItems Table
-- Get order items
SELECT * FROM OrderItems WHERE saleID = :saleIDInput;

-- Insert new order item
INSERT INTO OrderItems (saleID, gameID, quantity, price)
VALUES (:saleIDInput, :gameIDInput, :quantityInput, :priceInput);

-- Delete order item
DELETE FROM OrderItems WHERE orderItemID = :orderItemIDInput;

-- Reviews Table
-- Get all reviews
SELECT * FROM Reviews WHERE gameID = :gameIDInput;

-- Insert a new review
INSERT INTO Reviews (gameID, customerID, rating, comment, reviewDate)
VALUES (:gameIDInput, :customerIDInput, :ratingInput, :commentInput, :reviewDateInput);

-- Delete a review
DELETE FROM Reviews WHERE reviewID = :reviewIDInput;

--wishlist table
-- Get wishlist items
SELECT * FROM Wishlist WHERE customerID = :customerIDInput;

-- Insert a new game
INSERT INTO Wishlist (customerID, gameID)
VALUES (:customerIDInput, :gameIDInput);

-- Delete a game from wishlist
DELETE FROM Wishlist WHERE customerID = :customerIDInput AND gameID = :gameIDInput;

--Library Table
-- Get library items
SELECT * FROM Library WHERE customerID = :customerIDInput;

-- Insert a new game
INSERT INTO Library (customerID, gameID)
VALUES (:customerIDInput, :gameIDInput);

-- Delete a game from library
DELETE FROM Library WHERE customerID = :customerIDInput AND gameID = :gameIDInput;

-- Re-enable foreign key checks and commit the transaction
SET FOREIGN_KEY_CHECKS=1;
SET AUTOCOMMIT=1;
COMMIT;