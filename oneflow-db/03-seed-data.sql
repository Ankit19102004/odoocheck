USE oneflow;

-- 1) Insert or ensure users exist (idempotent)
INSERT INTO users (first_name, last_name, email, password_hash, role, hourly_rate, created_at, updated_at)
VALUES
('Admin', 'User', 'admin@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'admin', 100.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO users (first_name, last_name, email, password_hash, role, hourly_rate, created_at, updated_at)
VALUES
('John', 'Manager', 'manager@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'project_manager', 75.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO users (first_name, last_name, email, password_hash, role, hourly_rate, created_at, updated_at)
VALUES
('Alice', 'Developer', 'alice@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'team_member', 50.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO users (first_name, last_name, email, password_hash, role, hourly_rate, created_at, updated_at)
VALUES
('Bob', 'Designer', 'bob@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'team_member', 45.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO users (first_name, last_name, email, password_hash, role, hourly_rate, created_at, updated_at)
VALUES
('Carol', 'Accountant', 'carol@oneflow.com', '$2a$10$rBV2jDeZ4KvZr5ZQb6QYOeN7v9j5X8K5vK5K5K5K5K5K5K5K5K', 'sales_finance', 60.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- 2) Fetch user ids into variables (guarantee they exist)
SELECT id INTO @admin_id   FROM users WHERE email = 'admin@oneflow.com' LIMIT 1;
SELECT id INTO @manager_id FROM users WHERE email = 'manager@oneflow.com' LIMIT 1;
SELECT id INTO @alice_id   FROM users WHERE email = 'alice@oneflow.com' LIMIT 1;
SELECT id INTO @bob_id     FROM users WHERE email = 'bob@oneflow.com' LIMIT 1;
SELECT id INTO @carol_id   FROM users WHERE email = 'carol@oneflow.com' LIMIT 1;

-- Quick check: ensure none are NULL (will return rows if any are missing)
SELECT
  @admin_id   IS NULL AS admin_missing,
  @manager_id IS NULL AS manager_missing,
  @alice_id   IS NULL AS alice_missing,
  @bob_id     IS_NULL AS bob_missing,
  @carol_id   IS NULL AS carol_missing;

-- If any of the above columns returns 1 (true), stop and investigate: the corresponding user wasn't found.

-- 3) Insert projects (idempotent approach using a unique name)
INSERT INTO projects (name, description, manager_id, deadline, priority, budget, status, created_at, updated_at)
VALUES
('Website Redesign', 'Complete redesign of company website', @manager_id, '2024-12-31', 'high', 50000.00, 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO projects (name, description, manager_id, deadline, priority, budget, status, created_at, updated_at)
VALUES
('Mobile App Development', 'iOS and Android app development', @manager_id, '2025-06-30', 'medium', 100000.00, 'planning', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 4) Get project ids
SELECT id INTO @project1_id FROM projects WHERE name = 'Website Redesign' LIMIT 1;
SELECT id INTO @project2_id FROM projects WHERE name = 'Mobile App Development' LIMIT 1;

-- Check the project ids
SELECT @project1_id AS project1_id, @project2_id AS project2_id;

-- 5) Insert project_tags (safe: ignore duplicates)
INSERT IGNORE INTO project_tags (project_id, tag) VALUES
(@project1_id, 'frontend'),
(@project1_id, 'design'),
(@project2_id, 'mobile'),
(@project2_id, 'backend');

-- 6) Insert tasks individually and capture IDs where needed
INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, time_estimate, created_at, updated_at)
VALUES (@project1_id, 'Design homepage', 'Create modern homepage design', @bob_id, 'in_progress', 'high', '2024-11-30', 40.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, time_estimate, created_at, updated_at)
VALUES (@project1_id, 'Implement responsive layout', 'Make website responsive for all devices', @alice_id, 'new', 'high', '2024-12-15', 60.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, time_estimate, created_at, updated_at)
VALUES (@project1_id, 'Setup CI/CD pipeline', NULL, @alice_id, 'done', 'medium', NULL, 20.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, time_estimate, created_at, updated_at)
VALUES (@project2_id, 'Design app wireframes', NULL, @bob_id, 'new', 'high', NULL, 30.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 7) Get task ids
SELECT id INTO @task1_id FROM tasks WHERE title = 'Design homepage' LIMIT 1;
SELECT id INTO @task3_id FROM tasks WHERE title = 'Setup CI/CD pipeline' LIMIT 1;

-- 8) Insert timesheets (these require task & user to exist)
INSERT INTO timesheets (task_id, user_id, date, hours, billable, created_at, updated_at)
VALUES
(@task1_id, @bob_id, '2024-11-01', 8.00, TRUE, NOW(), NOW()),
(@task3_id, @alice_id, '2024-10-25', 6.00, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE date = VALUES(date);

-- 9) Sales orders
INSERT INTO sales_orders (project_id, customer_name, total_amount, state, created_at, updated_at)
VALUES (@project1_id, 'ABC Corporation', 50000.00, 'confirmed', NOW(), NOW())
ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name);

SELECT id INTO @sales_order1_id FROM sales_orders WHERE customer_name = 'ABC Corporation' LIMIT 1;

-- 10) Purchase orders
INSERT INTO purchase_orders (project_id, vendor_name, total_amount, state, created_at, updated_at)
VALUES (@project1_id, 'Hosting Provider Inc', 5000.00, 'confirmed', NOW(), NOW())
ON DUPLICATE KEY UPDATE vendor_name = VALUES(vendor_name);

SELECT id INTO @purchase_order1_id FROM purchase_orders WHERE vendor_name = 'Hosting Provider Inc' LIMIT 1;

-- 11) Invoices & Vendor bills & expenses
INSERT INTO invoices (project_id, sales_order_id, invoice_number, amount, state, created_at, updated_at)
VALUES (@project1_id, @sales_order1_id, 'INV-2024-001', 50000.00, 'sent', NOW(), NOW())
ON DUPLICATE KEY UPDATE invoice_number = VALUES(invoice_number);

INSERT INTO vendor_bills (project_id, purchase_order_id, amount, state, created_at, updated_at)
VALUES (@project1_id, @purchase_order1_id, 5000.00, 'paid', NOW(), NOW())
ON DUPLICATE KEY UPDATE project_id = VALUES(project_id), purchase_order_id = VALUES(purchase_order_id);

INSERT INTO expenses (project_id, user_id, amount, description, billable, state, created_at, updated_at)
VALUES (@project1_id, @alice_id, 150.00, 'Software license', TRUE, 'approved', NOW(), NOW())
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- 12) Final verification counts
SELECT
  (SELECT COUNT(*) FROM users) AS users_count,
  (SELECT COUNT(*) FROM projects) AS projects_count,
  (SELECT COUNT(*) FROM tasks) AS tasks_count,
  (SELECT COUNT(*) FROM timesheets) AS timesheets_count,
  (SELECT COUNT(*) FROM sales_orders) AS sales_orders_count,
  (SELECT COUNT(*) FROM purchase_orders) AS purchase_orders_count,
  (SELECT COUNT(*) FROM invoices) AS invoices_count,
  (SELECT COUNT(*) FROM vendor_bills) AS vendor_bills_count,
  (SELECT COUNT(*) FROM expenses) AS expenses_count;
