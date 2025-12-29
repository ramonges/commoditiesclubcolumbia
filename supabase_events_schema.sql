-- Events table for Columbia Commodity Club
-- Run this in your Supabase SQL Editor

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Dinner', 'Speaker Event', 'Company Visit', 'Members Meeting')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  address TEXT NOT NULL,
  time_from TEXT NOT NULL,
  time_to TEXT,
  rsvp_link TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_past BOOLEAN DEFAULT FALSE,
  author_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_past ON events(is_past);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Team members can insert events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Team members can update events" ON events
  FOR UPDATE USING (true);

CREATE POLICY "Team members can delete events" ON events
  FOR DELETE USING (true);


