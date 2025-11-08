-- ============================================
-- OneFlow Database Setup
-- Step 1: Create Database and User
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS oneflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE oneflow;

