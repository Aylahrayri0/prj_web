-- Add country column to testimonials table
-- Run this in phpMyAdmin or MySQL command line

ALTER TABLE testimonials 
ADD COLUMN country VARCHAR(255) NULL AFTER name;

-- Update existing records to have country based on email (optional)
-- UPDATE testimonials SET country = email WHERE country IS NULL;
