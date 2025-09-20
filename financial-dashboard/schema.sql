-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS financial_data_db;

-- Use the created database
USE financial_data_db;

-- Table structure for users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL
);

-- Table structure for financial_records
CREATE TABLE IF NOT EXISTS `financial_records` (
  `record_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `year` INT NOT NULL,
  `month` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Pre-populate the users table with sample data
-- Using INSERT IGNORE to prevent errors if the data already exists
INSERT IGNORE INTO `users` (`user_id`, `name`) VALUES
(1, 'Jane Doe'),
(2, 'John Smith');

-- Create a unique index to prevent duplicate month entries for the same user and year
-- This helps in handling data updates more predictably.
CREATE UNIQUE INDEX idx_user_year_month ON financial_records(user_id, year, month);
