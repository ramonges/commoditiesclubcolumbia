-- Columbia Commodity Club - Database Schema
-- Run this in your Supabase SQL Editor

-- IMPORTANT: If you already created the table with password_hash, run supabase_migration_fix.sql first!

-- Create users table for authentication
-- Note: In production, use Supabase Auth instead of storing passwords
-- This table is kept for reference but authentication is handled client-side
-- Password authentication is handled in the application, not in the database
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert team members (for reference only - auth is client-side)
INSERT INTO team_members (email, name) 
VALUES 
  ('tj2622@columbia.edu', 'Timothe Jekel'),
  ('ram2315@columbia.edu', 'Raphael Monges')
ON CONFLICT (email) DO NOTHING;

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN ('energy', 'precious-metals', 'base-metals', 'metals', 'agriculture', 'strategies')),
  subcategory TEXT NOT NULL,
  author_id UUID REFERENCES team_members(id),
  author_email TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article_blocks table for flexible content structure
CREATE TABLE IF NOT EXISTS article_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('title', 'subtitle', 'text', 'image')),
  block_order INTEGER NOT NULL,
  content TEXT,
  image_url TEXT,
  image_alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_subcategory ON articles(subcategory);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_blocks_article_id ON article_blocks(article_id);
CREATE INDEX IF NOT EXISTS idx_article_blocks_order ON article_blocks(article_id, block_order);

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members (only authenticated users can read)
DROP POLICY IF EXISTS "Team members can read their own data" ON team_members;
CREATE POLICY "Team members can read their own data" ON team_members
  FOR SELECT USING (true);

-- RLS Policies for articles (public read, authenticated write)
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
CREATE POLICY "Anyone can read published articles" ON articles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Team members can insert articles" ON articles;
CREATE POLICY "Team members can insert articles" ON articles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Team members can update articles" ON articles;
CREATE POLICY "Team members can update articles" ON articles
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Team members can delete articles" ON articles;
CREATE POLICY "Team members can delete articles" ON articles
  FOR DELETE USING (true);

-- RLS Policies for article_blocks
DROP POLICY IF EXISTS "Anyone can read article blocks" ON article_blocks;
CREATE POLICY "Anyone can read article blocks" ON article_blocks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Team members can insert article blocks" ON article_blocks;
CREATE POLICY "Team members can insert article blocks" ON article_blocks
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Team members can update article blocks" ON article_blocks;
CREATE POLICY "Team members can update article blocks" ON article_blocks
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Team members can delete article blocks" ON article_blocks;
CREATE POLICY "Team members can delete article blocks" ON article_blocks
  FOR DELETE USING (true);
