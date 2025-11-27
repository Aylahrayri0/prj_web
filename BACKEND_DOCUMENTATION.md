# Gaza Support Backend - Setup Complete ✅

## Overview
Your Laravel REST API backend is fully configured and running on `http://127.0.0.1:8000`

---

## Database Structure

### Tables Created:
1. **users** - User accounts and authentication
2. **donation_categories** - Types of donations (Medical Aid, Food & Water, Shelter, Education, etc.)
3. **donations** - Donation records with donor info and amounts
4. **articles** - News and blog posts
5. **testimonials** - User testimonials and reviews
6. **impact_statics** - Impact metrics and statistics

---

## API Endpoints

### Base URL: `http://127.0.0.1:8000/api`

### 1. Donation Categories
```
GET    /donation-categories          # Get all categories
POST   /donation-categories          # Create new category
GET    /donation-categories/{id}     # Get single category
PUT    /donation-categories/{id}     # Update category
DELETE /donation-categories/{id}     # Delete category
```

**Example Request (POST):**
```json
{
  "name": "Medical Aid",
  "description": "Help for medical emergencies"
}
```

**Example Response:**
```json
{
  "id": 1,
  "name": "Medical Aid",
  "description": "Help for medical emergencies",
  "created_at": "2025-11-27T10:03:35.000000Z",
  "updated_at": "2025-11-27T10:03:35.000000Z"
}
```

---

### 2. Donations
```
GET    /donations                    # Get all donations
POST   /donations                    # Create new donation
GET    /donations/{id}               # Get single donation
PUT    /donations/{id}               # Update donation
DELETE /donations/{id}               # Delete donation
```

**Example Request (POST):**
```json
{
  "category_id": 1,
  "amount": 100.00,
  "donor_name": "Ahmed Hassan",
  "donor_email": "ahmed@example.com",
  "message": "Please help those in need",
  "user_id": null,
  "status": "pending"
}
```

**Fields:**
- `category_id` (required) - Foreign key to donation_categories
- `amount` (required) - Donation amount in decimal format
- `donor_name` (required) - Name of donor
- `donor_email` (required) - Email of donor
- `message` (optional) - Donation message
- `user_id` (optional) - If authenticated user
- `status` - pending, completed, or failed

---

### 3. Articles
```
GET    /articles                     # Get all articles
POST   /articles                     # Create new article
GET    /articles/{id}                # Get single article
PUT    /articles/{id}                # Update article
DELETE /articles/{id}                # Delete article
```

**Example Request (POST):**
```json
{
  "user_id": 1,
  "title": "Latest Relief Updates",
  "content": "Our team has been working tirelessly...",
  "image_url": "https://example.com/image.jpg",
  "category": "News"
}
```

**Fields:**
- `user_id` (required) - Author ID
- `title` (required) - Article title
- `content` (required) - Article body
- `image_url` (optional) - Featured image
- `category` (optional) - Article category

---

### 4. Testimonials
```
GET    /testimonials                 # Get approved testimonials
POST   /testimonials                 # Submit new testimonial
GET    /testimonials/{id}            # Get single testimonial
PUT    /testimonials/{id}            # Update testimonial
DELETE /testimonials/{id}            # Delete testimonial
```

**Example Request (POST):**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "content": "This organization has truly made a difference...",
  "rating": 5,
  "image_url": "https://example.com/avatar.jpg"
}
```

**Fields:**
- `name` (required) - Testimonial author name
- `email` (required) - Author email
- `content` (required) - Testimonial text
- `rating` (required) - 1-5 star rating
- `image_url` (optional) - Author profile image
- `approved` - Boolean (default: false, set to true to display)

---

### 5. Impact Statistics
```
GET    /impact-statistics            # Get all metrics
POST   /impact-statistics            # Create new metric
GET    /impact-statistics/{id}       # Get single metric
PUT    /impact-statistics/{id}       # Update metric
DELETE /impact-statistics/{id}       # Delete metric
```

**Example Request (POST):**
```json
{
  "metric_name": "Total Donations",
  "value": 15000,
  "description": "Total amount donated"
}
```

**Fields:**
- `metric_name` (required) - Name of the metric
- `value` (required) - Numeric value
- `description` (optional) - Description of metric

---

## How to Use from React Frontend

### 1. Install Fetch or Axios
```bash
npm install axios
# OR use built-in fetch API
```

### 2. Basic Fetch Example
```javascript
// Get all donations
const getDonations = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/donations');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Create new donation
const createDonation = async (donationData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData),
    });
    const data = await response.json();
    console.log('Created:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 3. Axios Example
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Get all donations
const getDonations = async () => {
  const response = await API.get('/donations');
  return response.data;
};

// Create donation
const createDonation = async (data) => {
  const response = await API.post('/donations', data);
  return response.data;
};

// Update donation
const updateDonation = async (id, data) => {
  const response = await API.put(`/donations/${id}`, data);
  return response.data;
};

// Delete donation
const deleteDonation = async (id) => {
  await API.delete(`/donations/${id}`);
};
```

---

## CORS Configuration (If Needed)

If your React app is on a different port, you may need to enable CORS. Add to `config/cors.php`:

```php
'allowed_origins' => ['localhost:3000', 'localhost:5173'],
```

Or install and configure CORS package:
```bash
composer require fruitcake/laravel-cors
```

---

## Running the Backend

### Start the server:
```bash
cd C:\Users\hp\Desktop\prj_web\gaza-support-backend
php artisan serve
```

The server runs on: `http://127.0.0.1:8000`

### API Test URL:
```
http://127.0.0.1:8000/api/test
```
Response: `{"message":"API is working!"}`

---

## Authentication (Optional)

For authenticated endpoints, use Sanctum:

```javascript
// Login
const response = await fetch('http://127.0.0.1:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});
const { token } = await response.json();

// Use token in subsequent requests
fetch('http://127.0.0.1:8000/api/user', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Database Configuration

**File:** `.env`

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD="Aya lahrayri123"
```

---

## File Structure

```
gaza-support-backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── DonationCategoryController.php
│   │   ├── DonationController.php
│   │   ├── ArticleController.php
│   │   ├── TestimonialController.php
│   │   └── ImpactStaticsController.php
│   └── Models/
│       ├── DonationCategory.php
│       ├── Donation.php
│       ├── Article.php
│       ├── Testimonial.php
│       └── ImpactStatics.php
├── database/
│   ├── migrations/       # Database schemas
│   ├── seeders/         # Test data
│   └── factories/       # Model factories
├── routes/
│   └── api.php         # API route definitions
└── ...
```

---

## Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Deletion successful
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

---

## Next Steps

1. ✅ Backend API is set up and running
2. ⏭️ Connect your React frontend to these API endpoints
3. ⏭️ Add authentication/login functionality (optional)
4. ⏭️ Deploy to production server

---

## Support

For questions about specific endpoints, refer to the controller files or API documentation above.

**Your backend is ready to power your Gaza Support application!** 🚀
