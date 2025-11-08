-- Add required_skills column to tasks table
-- This migration adds the required_skills JSON column for skill-based task assignment

USE oneflow;

-- Add required_skills column if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS required_skills JSON NULL 
COMMENT 'Array of required skill names for this task';

-- Verify the column was added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'oneflow' 
  AND TABLE_NAME = 'tasks' 
  AND COLUMN_NAME = 'required_skills';

