# IMPORTANT: Setup Instructions

## 1. Add Country Column to Database

Open phpMyAdmin and run this SQL:

```sql
ALTER TABLE testimonials 
ADD COLUMN country VARCHAR(255) NULL AFTER name;
```

## 2. Copy the API File

Make sure the file `simple-api.php` is in:
```
c:\Users\hh\Documents\GitHub\prj_web\gaza-support-backend\simple-api.php
```

## 3. Update Database Credentials (if needed)

Edit `simple-api.php` lines 10-13:
```php
$host = 'localhost';
$dbname = 'gaza_support';  // Change if different
$username = 'root';         // Change if different
$password = '';             // Change if you have a password
```

## 4. Test the API

Open in browser:
```
http://localhost/prj_web/gaza-support-backend/simple-api.php
```

You should see: `{"data":[]}`

## 5. Now Test Your Application

1. Go to http://localhost:3004/temoignages
2. Click "Envoyer un message de soutien"
3. Fill in the form and click "Envoyer"
4. You should see "Message envoyé avec succès!"

5. Go to http://localhost:3004/administrateur
6. Login with credentials
7. Click "Gestion des Messages"
8. You should see your message with status "En attente"
9. Click "✓ Approuver"
10. Go back to Temoignages page - your message should appear!

## If You Get Errors

### "Failed to connect"
- Make sure XAMPP Apache is running
- Check that the file path is correct

### "Database connection failed"
- Open phpMyAdmin and verify database name is `gaza_support`
- Check username/password in simple-api.php

### "Column 'country' doesn't exist"
- Run the SQL to add the column in phpMyAdmin

## API Endpoints

- `GET /simple-api.php` - Get approved testimonials
- `POST /simple-api.php` - Submit new testimonial
- `GET /simple-api.php/admin/testimonials` - Get all testimonials (admin)
- `PUT /simple-api.php/admin/testimonials/{id}/approve` - Approve
- `PUT /simple-api.php/admin/testimonials/{id}/reject` - Reject
- `DELETE /simple-api.php/admin/testimonials/{id}` - Delete
