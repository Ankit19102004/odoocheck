-- OneFlow Complete Database Setup (corrected)
-- Run as a privileged MySQL user (root)

CREATE DATABASE IF NOT EXISTS oneflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oneflow;

-- Create application DB user (explicit auth plugin for compatibility)
CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'oneflow_password';
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
FLUSH PRIVILEGES;

-- Drop in safe order (if re-running)
DROP TABLE IF EXISTS vendor_bills;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS sales_orders;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS timesheets;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_tags;
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'project_manager', 'team_member', 'sales_finance') NOT NULL DEFAULT 'team_member',
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  avatar_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email)
) ;

-- Projects (added UNIQUE on name because seed uses ON DUPLICATE)
CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  manager_id INT UNSIGNED NOT NULL,
  deadline DATE NULL,
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  budget DECIMAL(12, 2) NULL,
  status ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled') NOT NULL DEFAULT 'planning',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_projects_name (name),
  INDEX idx_manager_id (manager_id),
  INDEX idx_status (status),
  CONSTRAINT fk_projects_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- project_tags
CREATE TABLE IF NOT EXISTS project_tags (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED NOT NULL,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_project_tag (project_id, tag),
  INDEX idx_project_id (project_id),
  CONSTRAINT fk_project_tags_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- tasks (unique per project on (project_id, title))
CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  assignee_id INT UNSIGNED NULL,
  status ENUM('new', 'in_progress', 'blocked', 'done') NOT NULL DEFAULT 'new',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  deadline DATE NULL,
  time_estimate DECIMAL(8, 2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_tasks_project_title (project_id, title),
  INDEX idx_project_id (project_id),
  INDEX idx_assignee_id (assignee_id),
  INDEX idx_status (status),
  CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignee_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- timesheets
CREATE TABLE IF NOT EXISTS timesheets (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  task_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  hours DECIMAL(6, 2) NOT NULL,
  billable BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),
  CONSTRAINT fk_timesheets_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_timesheets_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- sales_orders
CREATE TABLE IF NOT EXISTS sales_orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  state ENUM('draft', 'sent', 'confirmed', 'cancelled') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_project_id (project_id),
  INDEX idx_state (state),
  CONSTRAINT fk_sales_orders_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- purchase_orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED NOT NULL,
  vendor_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  state ENUM('draft', 'sent', 'confirmed', 'received', 'cancelled') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_project_id (project_id),
  INDEX idx_state (state),
  CONSTRAINT fk_purchase_orders_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- invoices
CREATE TABLE IF NOT EXISTS invoices (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED NOT NULL,
  sales_order_id INT UNSIGNED NULL,
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  amount DECIMAL(12, 2) NOT NULL,
  state ENUM('draft', 'sent', 'paid', 'cancelled') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_project_id (project_id),
  INDEX idx_sales_order_id (sales_order_id),
  INDEX idx_state (state),
  CONSTRAINT fk_invoices_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_invoices_sales_order FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- vendor_bills
CREATE TABLE IF NOT EXISTS vendor_bills (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED NOT NULL,
  purchase_order_id INT UNSIGNED NULL,
  amount DECIMAL(12, 2) NOT NULL,
  state ENUM('draft', 'sent', 'paid', 'cancelled') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_project_id (project_id),
  INDEX idx_purchase_order_id (purchase_order_id),
  INDEX idx_state (state),
  CONSTRAINT fk_vendor_bills_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_vendor_bills_po FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- expenses
CREATE TABLE IF NOT EXISTS expenses (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  billable BOOLEAN NOT NULL DEFAULT FALSE,
  receipt_url VARCHAR(500) NULL,
  state ENUM('pending', 'approved', 'rejected', 'paid') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_state (state),
  CONSTRAINT fk_expenses_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ;

-- products
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  is_sales BOOLEAN NOT NULL DEFAULT FALSE,
  is_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  price DECIMAL(10, 2) NULL,
  cost DECIMAL(10, 2) NULL,
  taxes DECIMAL(5, 2) NULL,
  PRIMARY KEY (id)
) ;

-- attachments
CREATE TABLE IF NOT EXISTS attachments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_type VARCHAR(50) NOT NULL,
  owner_id INT UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_owner (owner_type, owner_id)
) ;
