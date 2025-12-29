# Setup Instructions for Article Management System

## 1. Database Setup (Supabase)

### Step 1: Run SQL Schema
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase_schema.sql`
4. Run the SQL script

### Step 2: Create Storage Bucket for Images
1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `article-images`
4. Make it **Public**
5. Click **Create bucket**

### Step 3: Set Storage Policies
Run this SQL in the SQL Editor:

```sql
-- Allow public read access to article images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'article-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'article-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'article-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'article-images');
```

## 2. Team Member Credentials

The system is configured with these credentials:

- **Timothe Jekel**
  - Email: `tj2622@columbia.edu`
  - Password: `tj2622`

- **Raphael Monges**
  - Email: `ram2315@columbia.edu`
  - Password: `ram2315`

## 3. How to Use

### For Team Members:

1. **Login**
   - Click "Log In Team" button in the footer (bottom right, below LinkedIn)
   - Enter your email and password
   - You'll be redirected to the Admin Panel

2. **Create an Article**
   - Select Category (Energy, Precious Metals, Base Metals, Agriculture)
   - Select Subcategory
   - Add content blocks:
     - **Title**: Main article title
     - **Subtitle**: Subtitle or summary
     - **Text**: Paragraph content
     - **Image**: Upload image files
   - Arrange blocks using up/down arrows
   - Remove blocks with × button
   - Click "Publish Article" when done

3. **Article Structure**
   - Articles are built with flexible blocks
   - Blocks are ordered and displayed in sequence
   - Images can have alt text for accessibility
   - Articles automatically get published date/time

### Article Categories & Subcategories:

- **Energy**: Oil, Natural Gas, Power
- **Precious Metals**: Gold, Silver, Copper
- **Base Metals**: Aluminum, Zinc & Lead, Nickel
- **Agriculture**: Grains, Soft Commodities

## 4. Database Schema

The database has three main tables:

1. **team_members**: Stores team member credentials
2. **articles**: Stores article metadata (title, category, author, dates)
3. **article_blocks**: Stores flexible content blocks (title, subtitle, text, image)

## 5. Security Notes

⚠️ **Important**: This is a simple authentication system for demo purposes. For production:

- Use Supabase Auth instead of storing passwords
- Implement proper password hashing
- Add rate limiting
- Use environment variables for sensitive data
- Implement proper session management

## 6. Troubleshooting

### Images not uploading?
- Check that the `article-images` bucket exists and is public
- Verify storage policies are set correctly

### Can't login?
- Verify credentials match exactly (case-sensitive)
- Check browser console for errors
- Ensure Supabase connection is working

### Articles not showing?
- Check that articles are published (published_at is set)
- Verify category/subcategory match the filter
- Check browser console for API errors


