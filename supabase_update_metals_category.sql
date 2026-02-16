-- Update articles table to support 'metals' category
-- Run this in your Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_check;

-- Add new constraint that includes 'metals' category
-- Keeping old categories for backward compatibility with existing articles
ALTER TABLE articles ADD CONSTRAINT articles_category_check 
  CHECK (category IN ('energy', 'precious-metals', 'base-metals', 'metals', 'agriculture', 'strategies'));
