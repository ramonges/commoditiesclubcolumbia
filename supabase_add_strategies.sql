-- Migration script to add 'strategies' category to articles table
-- Run this in Supabase SQL Editor

-- First, drop the existing check constraint
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_check;

-- Add new check constraint that includes 'strategies'
ALTER TABLE articles ADD CONSTRAINT articles_category_check 
  CHECK (category IN ('energy', 'precious-metals', 'base-metals', 'agriculture', 'strategies'));

