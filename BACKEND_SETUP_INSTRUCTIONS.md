# Backend Server Setup Instructions

## Problem
The Laravel backend dependencies are not fully installed, preventing the server from starting.

## Quick Solution Options

### Option 1: Enable ZIP Extension in PHP (Recommended)

1. Open `C:\xampp\php\php.ini`
2. Find the line `;extension=zip`
3. Remove the semicolon to make it: `extension=zip`
4. Save the file
5. Run in terminal:
```powershell
cd C:\Users\hh\Documents\GitHub\prj_web\gaza-support-backend
composer install
php artisan serve
```

### Option 2: Add Country Column Manually & Use Mock Data (Temporary)

Since the backend isn't running, you can still test the frontend:

1. **Add country column to database:**
   - Open phpMyAdmin
   - Select your database
   - Run this SQL:
   ```sql
   ALTER TABLE testimonials 
   ADD COLUMN country VARCHAR(255) NULL AFTER name;
   ```

2. **The frontend will show an error when trying to connect to backend**
   - But you can still see the UI and test the admin panel with the existing sample data

### Option 3: Start Laravel with XAMPP (if dependencies exist)

1. Make sure XAMPP MySQL is running
2. Navigate to backend folder
3. Try starting the server:
```powershell
cd C:\Users\hh\Documents\GitHub\prj_web\gaza-support-backend
php artisan serve
```

## What Needs to Work

For the testimonial system to work properly, you need:

1. ✅ Database with `testimonials` table
2. ✅ Country column added to `testimonials` table
3. ❌ Laravel backend running on http://localhost:8000
4. ✅ React frontend running on http://localhost:3000

## Current Status

- Frontend is ready ✅
- Database structure updated ✅
- Backend code ready ✅
- Backend dependencies NOT installed ❌
- Backend server NOT running ❌

## Next Steps

**Choose Option 1 above** to fully enable the backend and test the complete workflow.

OR

**For now**, you can:
- Test the UI/UX of the testimonial submission form
- See how the admin panel looks
- The actual save/approve/reject won't work until backend is running
