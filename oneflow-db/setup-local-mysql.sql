-- OneFlow Database Setup for Local MySQL
-- Run this script in your MySQL client to set up the database

-- Create database
CREATE DATABASE IF NOT EXISTS oneflow;

-- Create user (adjust password as needed)
CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE oneflow;

-- Note: Tables will be created via Sequelize migrations
-- Run migrations from oneflow-api: npm run migrate

