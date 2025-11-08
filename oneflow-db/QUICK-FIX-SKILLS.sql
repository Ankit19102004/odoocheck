-- QUICK FIX: Copy and paste this entire file into MySQL Workbench or MySQL command line
-- This fixes the "Unknown column 'tasks.required_skills'" error

USE oneflow;

-- Add required_skills column to tasks table
ALTER TABLE tasks ADD COLUMN required_skills JSON NULL COMMENT 'Array of required skill names for this task';

-- Create user_skills table
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

SELECT '✅ Fix completed! Column required_skills added to tasks table.' AS result;

