-- Migration script to fix the team_members table
-- Run this FIRST if you already created the table with password_hash

-- Option 1: Drop and recreate the table (if you don't have important data)
-- DROP TABLE IF EXISTS team_members CASCADE;

-- Option 2: Alter the existing table to remove password_hash column
-- First, drop the column if it exists
ALTER TABLE team_members DROP COLUMN IF EXISTS password_hash;

-- Now the table should match the schema without password_hash
-- Re-run the INSERT statement from supabase_schema.sql if needed:
-- INSERT INTO team_members (email, name) 
-- VALUES 
--   ('tj2622@columbia.edu', 'Timothe Jekel'),
--   ('ram2315@columbia.edu', 'Raphael Monges')
-- ON CONFLICT (email) DO NOTHING;


