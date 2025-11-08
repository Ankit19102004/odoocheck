-- Fix OneFlow User Permissions
-- Run this if you get "Access denied" error

-- Grant all privileges on oneflow database to oneflow_user
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';

-- Also grant for 127.0.0.1 (sometimes needed)
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'127.0.0.1' IDENTIFIED BY 'oneflow_password';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW GRANTS FOR 'oneflow_user'@'localhost';

