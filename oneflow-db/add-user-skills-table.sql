-- Create user_skills table for skill-based task assignment
-- This migration creates the user_skills table to store user skills

USE oneflow;

-- Create user_skills table if it doesn't exist
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

-- Verify the table was created
SHOW TABLES LIKE 'user_skills';

-- Show table structure
DESCRIBE user_skills;

