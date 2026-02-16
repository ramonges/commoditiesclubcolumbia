-- Add 'rare-earth' subcategory support for metals category
-- Note: Subcategories are stored as TEXT in the database, so no constraint update is needed
-- This SQL file is for reference only - the code changes handle the subcategory options

-- If you need to update existing articles to use 'rare-earth' subcategory:
-- UPDATE articles 
-- SET subcategory = 'rare-earth' 
-- WHERE category = 'metals' AND subcategory = 'old-subcategory-name';

-- No database schema changes are required as subcategories are free-form text fields
-- The constraint only applies to the 'category' field, not 'subcategory'
