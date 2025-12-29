import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gdkhessctsvhqwpmjtwi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdka2hlc3NjdHN2aHF3cG1qdHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDk5MzAsImV4cCI6MjA4MjU4NTkzMH0.Wk_C3-7sD8V_4ccNzvHCKDvy8Ekc6Q1YUdxoBc9_vA0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Team member credentials (in production, use Supabase Auth)
export const TEAM_CREDENTIALS = {
  'tj2622@columbia.edu': { password: 'tj2622', name: 'Timothe Jekel' },
  'ram2315@columbia.edu': { password: 'ram2315', name: 'Raphael Monges' }
};


