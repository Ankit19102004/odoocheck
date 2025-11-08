-- Fix Skills Migration
-- Run this script to add the required database columns and tables for skill-based task assignment
-- This fixes the "Unknown column 'tasks.required_skills'" error

USE oneflow;

-- ============================================
-- 1. Add required_skills column to tasks table
-- ============================================
-- Add the column (will fail silently if it already exists)
-- If you get an error that the column already exists, that's fine - just continue

ALTER TABLE tasks 
ADD COLUMN required_skills JSON NULL 
COMMENT 'Array of required skill names for this task';

-- ============================================
-- 2. Create user_skills table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS user_skills (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') NOT NULL DEFAULT 'intermediate',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_skills_user_id (user_id),
  INDEX idx_user_skills_skill_name (skill_name),
  UNIQUE KEY unique_user_skill (user_id, skill_name),
  CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Verify the changes
-- ============================================
SELECT 'Migration completed successfully!' AS status;

-- Show tasks table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'oneflow' 
  AND TABLE_NAME = 'tasks' 
  AND COLUMN_NAME = 'required_skills';

-- Show user_skills table
SHOW TABLES LIKE 'user_skills';

