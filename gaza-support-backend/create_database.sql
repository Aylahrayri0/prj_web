-- Create database and testimonials table for Gaza Support
-- Run this in phpMyAdmin or MySQL command line

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS gaza_support;
USE gaza_support;

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    image_url VARCHAR(255) NULL,
    approved TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add country column if it doesn't exist (for existing tables)
-- ALTER TABLE testimonials ADD COLUMN country VARCHAR(255) NULL AFTER name;

-- Insert some sample testimonials for testing
INSERT INTO testimonials (name, country, email, content, rating, approved, created_at) VALUES
('Sarah M.', 'France', 'sarah@example.com', 'Solidarité totale avec Gaza. Notre cœur est avec vous.', 5, 0, NOW()),
('Ahmed K.', 'Maroc', 'ahmed@example.com', 'قلبي مع غزة. كل يوم أدعو لكم.', 5, 1, NOW()),
('Maria G.', 'España', 'maria@example.com', 'Toda mi solidaridad con el pueblo de Gaza.', 5, 0, NOW()),
('John P.', 'USA', 'john@example.com', 'Standing with Gaza. Peace and love to all.', 5, 0, NOW());

SELECT 'Database and table created successfully!' AS status;
