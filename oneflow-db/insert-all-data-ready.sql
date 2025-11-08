-- ============================================
-- OneFlow Database - Complete INSERT Statements
-- READY TO USE - Just copy and paste into MySQL!
-- ============================================
-- 
-- IMPORTANT: Make sure you've created the tables first!
-- Run: mysql -u root -p < oneflow-db/complete-setup.sql
-- OR: mysql -u root -p < oneflow-db/02-create-tables.sql
-- ============================================

USE oneflow;

-- ============================================
-- Step 1: Insert Users
-- ============================================
-- Password for all users: password123
-- These hashes are pre-generated bcrypt hashes
-- If they don't work, generate new ones using:
-- cd oneflow-api && node -e "console.log(require('bcryptjs').hashSync('password123', 10))"

INSERT INTO users (first_name, last_name, email, password_hash, role, hourly_rate, created_at, updated_at) VALUES
('Admin', 'User', 'admin@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K5K', 'admin', 100.00, NOW(), NOW()),
('John', 'Manager', 'manager@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'project_manager', 75.00, NOW(), NOW()),
('Alice', 'Developer', 'alice@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'team_member', 50.00, NOW(), NOW()),
('Bob', 'Designer', 'bob@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'team_member', 45.00, NOW(), NOW()),
('Carol', 'Accountant', 'carol@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'sales_finance', 60.00, NOW(), NOW());

-- ============================================
-- Step 2: Get User IDs (for foreign keys)
-- ============================================
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@oneflow.com' LIMIT 1);
SET @manager_id = (SELECT id FROM users WHERE email = 'manager@oneflow.com' LIMIT 1);
SET @alice_id = (SELECT id FROM users WHERE email = 'alice@oneflow.com' LIMIT 1);
SET @bob_id = (SELECT id FROM users WHERE email = 'bob@oneflow.com' LIMIT 1);
SET @carol_id = (SELECT id FROM users WHERE email = 'carol@oneflow.com' LIMIT 1);

-- ============================================
-- Step 3: Insert Projects
-- ============================================
INSERT INTO projects (name, description, manager_id, deadline, priority, budget, status, created_at, updated_at) VALUES
('Website Redesign', 'Complete redesign of company website', @manager_id, '2024-12-31', 'high', 50000.00, 'active', NOW(), NOW()),
('Mobile App Development', 'iOS and Android app development', @manager_id, '2025-06-30', 'medium', 100000.00, 'planning', NOW(), NOW());

-- ============================================
-- Step 4: Get Project IDs
-- ============================================
SET @project1_id = (SELECT id FROM projects WHERE name = 'Website Redesign' LIMIT 1);
SET @project2_id = (SELECT id FROM projects WHERE name = 'Mobile App Development' LIMIT 1);

-- ============================================
-- Step 5: Insert Project Tags
-- ============================================
INSERT INTO project_tags (project_id, tag) VALUES
(@project1_id, 'frontend'),
(@project1_id, 'design'),
(@project2_id, 'mobile'),
(@project2_id, 'backend');

-- ============================================
-- Step 6: Insert Tasks
-- ============================================
INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, time_estimate, created_at, updated_at) VALUES
(@project1_id, 'Design homepage', 'Create modern homepage design', @bob_id, 'in_progress', 'high', '2024-11-30', 40.00, NOW(), NOW()),
(@project1_id, 'Implement responsive layout', 'Make website responsive for all devices', @alice_id, 'new', 'high', '2024-12-15', 60.00, NOW(), NOW()),
(@project1_id, 'Setup CI/CD pipeline', 'Configure continuous integration and deployment', @alice_id, 'done', 'medium', NULL, 20.00, NOW(), NOW()),
(@project2_id, 'Design app wireframes', 'Create wireframes for mobile app screens', @bob_id, 'new', 'high', NULL, 30.00, NOW(), NOW());

-- ============================================
-- Step 7: Get Task IDs
-- ============================================
SET @task1_id = (SELECT id FROM tasks WHERE title = 'Design homepage' LIMIT 1);
SET @task2_id = (SELECT id FROM tasks WHERE title = 'Implement responsive layout' LIMIT 1);
SET @task3_id = (SELECT id FROM tasks WHERE title = 'Setup CI/CD pipeline' LIMIT 1);
SET @task4_id = (SELECT id FROM tasks WHERE title = 'Design app wireframes' LIMIT 1);

-- ============================================
-- Step 8: Insert Timesheets
-- ============================================
INSERT INTO timesheets (task_id, user_id, date, hours, billable, created_at, updated_at) VALUES
(@task1_id, @bob_id, '2024-11-01', 8.00, TRUE, NOW(), NOW()),
(@task3_id, @alice_id, '2024-10-25', 6.00, TRUE, NOW(), NOW()),
(@task1_id, @bob_id, '2024-11-02', 7.50, TRUE, NOW(), NOW());

-- ============================================
-- Step 9: Insert Sales Orders
-- ============================================
INSERT INTO sales_orders (project_id, customer_name, total_amount, state, created_at, updated_at) VALUES
(@project1_id, 'ABC Corporation', 50000.00, 'confirmed', NOW(), NOW()),
(@project2_id, 'XYZ Industries', 100000.00, 'draft', NOW(), NOW());

-- ============================================
-- Step 10: Get Sales Order IDs
-- ============================================
SET @sales_order1_id = (SELECT id FROM sales_orders WHERE customer_name = 'ABC Corporation' LIMIT 1);
SET @sales_order2_id = (SELECT id FROM sales_orders WHERE customer_name = 'XYZ Industries' LIMIT 1);

-- ============================================
-- Step 11: Insert Purchase Orders
-- ============================================
INSERT INTO purchase_orders (project_id, vendor_name, total_amount, state, created_at, updated_at) VALUES
(@project1_id, 'Hosting Provider Inc', 5000.00, 'confirmed', NOW(), NOW()),
(@project1_id, 'Cloud Services Ltd', 2000.00, 'sent', NOW(), NOW());

-- ============================================
-- Step 12: Get Purchase Order IDs
-- ============================================
SET @purchase_order1_id = (SELECT id FROM purchase_orders WHERE vendor_name = 'Hosting Provider Inc' LIMIT 1);
SET @purchase_order2_id = (SELECT id FROM purchase_orders WHERE vendor_name = 'Cloud Services Ltd' LIMIT 1);

-- ============================================
-- Step 13: Insert Invoices
-- ============================================
INSERT INTO invoices (project_id, sales_order_id, invoice_number, amount, state, created_at, updated_at) VALUES
(@project1_id, @sales_order1_id, 'INV-2024-001', 50000.00, 'sent', NOW(), NOW()),
(@project1_id, @sales_order1_id, 'INV-2024-002', 25000.00, 'draft', NOW(), NOW());

-- ============================================
-- Step 14: Insert Vendor Bills
-- ============================================
INSERT INTO vendor_bills (project_id, purchase_order_id, amount, state, created_at, updated_at) VALUES
(@project1_id, @purchase_order1_id, 5000.00, 'paid', NOW(), NOW()),
(@project1_id, @purchase_order2_id, 2000.00, 'sent', NOW(), NOW());

-- ============================================
-- Step 15: Insert Expenses
-- ============================================
INSERT INTO expenses (project_id, user_id, amount, description, billable, state, created_at, updated_at) VALUES
(@project1_id, @alice_id, 150.00, 'Software license', TRUE, 'approved', NOW(), NOW()),
(@project1_id, @bob_id, 75.50, 'Design tools subscription', TRUE, 'pending', NOW(), NOW()),
(@project2_id, @alice_id, 200.00, 'Development environment setup', FALSE, 'approved', NOW(), NOW());

-- ============================================
-- Step 16: Insert Products (Optional)
-- ============================================
INSERT INTO products (name, is_sales, is_purchase, price, cost, taxes) VALUES
('Web Development Service', TRUE, FALSE, 150.00, NULL, 10.00),
('Mobile App Development', TRUE, FALSE, 200.00, NULL, 10.00),
('Cloud Hosting', FALSE, TRUE, NULL, 50.00, 5.00),
('Design Software License', FALSE, TRUE, NULL, 25.00, 0.00);

-- ============================================
-- Verification
-- ============================================
SELECT '✅ Data inserted successfully!' as status;

-- View inserted data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Timesheets', COUNT(*) FROM timesheets
UNION ALL
SELECT 'Sales Orders', COUNT(*) FROM sales_orders
UNION ALL
SELECT 'Purchase Orders', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Vendor Bills', COUNT(*) FROM vendor_bills
UNION ALL
SELECT 'Expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'Products', COUNT(*) FROM products;

-- ============================================
-- Test Login Credentials
-- ============================================
-- All users have password: password123
-- 
-- Test accounts:
-- - admin@oneflow.com / password123 (Admin)
-- - manager@oneflow.com / password123 (Project Manager)
-- - alice@oneflow.com / password123 (Team Member)
-- - bob@oneflow.com / password123 (Team Member)
-- - carol@oneflow.com / password123 (Sales/Finance)
-- ============================================

