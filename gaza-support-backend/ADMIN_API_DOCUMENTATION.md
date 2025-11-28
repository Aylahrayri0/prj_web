# Admin API Documentation

## Overview
The Admin API provides complete management functionality for administrators including user management, donation oversight, testimonial moderation, and comprehensive statistics.

## Authentication
All admin endpoints require:
1. **Sanctum Token**: User must be authenticated via Sanctum API tokens
2. **Admin Role**: User must have `role = 'admin'`

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "1|abcdef123456...",
  "user": { ... }
}
```

### Admin Logout
```http
POST /api/admin/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Logout successful"
}
```

---

## Dashboard Statistics
### Get Dashboard Summary
```http
GET /api/admin/statistics
Authorization: Bearer {token}

Response: 200 OK
{
  "summary": {
    "total_donations": 15000.50,
    "total_donation_count": 45,
    "pending_donations": 2500.00,
    "completed_donations": 12500.50,
    "total_messages": 120,
    "approved_messages": 95,
    "total_users": 230,
    "admin_users": 3
  },
  "latest_donations": [ ... ],
  "latest_messages": [ ... ],
  "monthly_trends": {
    "donations": [ ... ],
    "messages": [ ... ]
  }
}
```

---

## User Management

### List All Users
```http
GET /api/admin/users?page=1
Authorization: Bearer {token}

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2025-11-27T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Get User Details
```http
GET /api/admin/users/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "total_donated": 500.00,
  "created_at": "2025-11-27T10:00:00Z",
  "updated_at": "2025-11-27T10:00:00Z"
}
```

### Search Users
```http
GET /api/admin/users/search?query=john
Authorization: Bearer {token}

Response: 200 OK
{
  "results": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

### Update User Role
```http
PUT /api/admin/users/{id}/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "admin"
}

Response: 200 OK
{
  "message": "User role updated successfully",
  "user": { ... }
}
```

### Delete User
```http
DELETE /api/admin/users/{id}
Authorization: Bearer {token}

Response: 204 No Content

Note: Cannot delete the last admin user
```

---

## Donation Management

### List Donations
```http
GET /api/admin/donations?status=pending&category_id=1&start_date=2025-01-01&end_date=2025-12-31&page=1
Authorization: Bearer {token}

Query Parameters:
- status: pending | completed | failed (optional)
- category_id: integer (optional)
- start_date: YYYY-MM-DD (optional)
- end_date: YYYY-MM-DD (optional)
- page: integer (optional, default: 1)

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "donor_name": "Anonymous",
      "donor_email": "donor@example.com",
      "amount": 100.00,
      "currency": "USD",
      "status": "completed",
      "message": "Supporting Gaza relief efforts",
      "category": { ... },
      "created_at": "2025-11-27T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Get Donation Details
```http
GET /api/admin/donations/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "donor_name": "Anonymous",
  "donor_email": "donor@example.com",
  "amount": 100.00,
  "currency": "USD",
  "status": "completed",
  "message": "Supporting Gaza relief efforts",
  "category": { ... },
  "user": { ... },
  "created_at": "2025-11-27T10:00:00Z",
  "updated_at": "2025-11-27T10:00:00Z"
}
```

### Update Donation Status
```http
PUT /api/admin/donations/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}

Response: 200 OK
{
  "message": "Donation status updated successfully",
  "donation": { ... }
}
```

### Delete Donation
```http
DELETE /api/admin/donations/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

### Get Donation Statistics
```http
GET /api/admin/donations/stats/summary
Authorization: Bearer {token}

Response: 200 OK
{
  "summary": {
    "total_amount": 15000.50,
    "total_count": 45,
    "completed_amount": 12500.50,
    "completed_count": 40,
    "pending_amount": 2500.00,
    "average_donation": 333.34
  },
  "by_category": [
    {
      "category_id": 1,
      "total_amount": 5000.00,
      "count": 15,
      "category": { "id": 1, "name": "Emergency Relief" }
    }
  ],
  "by_status": [
    {
      "status": "completed",
      "count": 40,
      "total_amount": 12500.50
    }
  ]
}
```

### Export Donations to CSV
```http
GET /api/admin/donations/export/csv
Authorization: Bearer {token}

Response: 200 OK
{
  "csv": "ID,Donor Name,Donor Email,Amount,...\n1,Anonymous,donor@example.com,100.00,...",
  "filename": "donations_2025-11-27_10-30-45.csv"
}
```

---

## Testimonial/Message Management

### List Testimonials
```http
GET /api/admin/testimonials?approved=false&min_rating=3&page=1
Authorization: Bearer {token}

Query Parameters:
- approved: true | false (optional)
- min_rating: 1-5 (optional)
- page: integer (optional, default: 1)

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "content": "This organization helped my family...",
      "rating": 5,
      "image_url": "https://example.com/image.jpg",
      "approved": false,
      "created_at": "2025-11-27T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Get Testimonial Details
```http
GET /api/admin/testimonials/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "content": "This organization helped my family...",
  "rating": 5,
  "image_url": "https://example.com/image.jpg",
  "approved": false,
  "created_at": "2025-11-27T10:00:00Z",
  "updated_at": "2025-11-27T10:00:00Z"
}
```

### Get Pending Testimonials
```http
GET /api/admin/testimonials/pending/all
Authorization: Bearer {token}

Response: 200 OK
{
  "count": 5,
  "testimonials": [ ... ]
}
```

### Approve Testimonial
```http
PUT /api/admin/testimonials/{id}/approve
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Testimonial approved successfully",
  "testimonial": { ... }
}
```

### Reject Testimonial
```http
PUT /api/admin/testimonials/{id}/reject
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Testimonial rejected successfully",
  "testimonial": { ... }
}
```

### Delete Testimonial
```http
DELETE /api/admin/testimonials/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

### Get Testimonial Statistics
```http
GET /api/admin/testimonials/stats/summary
Authorization: Bearer {token}

Response: 200 OK
{
  "summary": {
    "total_count": 120,
    "approved_count": 95,
    "pending_count": 25,
    "approval_percentage": 79.17,
    "average_rating": 4.5
  },
  "rating_distribution": [
    {
      "rating": 5,
      "count": 85
    },
    {
      "rating": 4,
      "count": 20
    }
  ],
  "latest": [ ... ]
}
```

---

## Error Responses

### Unauthorized (Not Authenticated)
```http
401 Unauthorized
{
  "message": "Unauthenticated"
}
```

### Forbidden (Not Admin)
```http
403 Forbidden
{
  "message": "Unauthorized - Admin access required"
}
```

### Validation Error
```http
422 Unprocessable Entity
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Not Found
```http
404 Not Found
{
  "message": "Model not found"
}
```

---

## Implementation Notes

### Middleware Stack
- `auth:sanctum`: Ensures user is authenticated via API token
- `admin`: Custom middleware that verifies user has admin role

### Route Protection
All admin routes are protected by the admin middleware:
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Protected admin routes
});
```

### Pagination
List endpoints support pagination (15 items per page):
```json
{
  "data": [ ... ],
  "links": { ... },
  "meta": { "current_page": 1, "per_page": 15, "total": 100 }
}
```

### Date Format
All dates are returned in ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`

### Currency
Donations use decimal:2 format (e.g., 100.50 for $100.50)

### Rating Scale
Testimonials use 1-5 star rating scale

---

## Testing with cURL

### Login as Admin
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Get Statistics
```bash
curl -X GET http://localhost:8000/api/admin/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### List Users
```bash
curl -X GET "http://localhost:8000/api/admin/users?page=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
