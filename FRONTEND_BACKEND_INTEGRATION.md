# Frontend-Backend Integration Guide

## Overview
This guide explains how to integrate the React frontend with the Laravel backend API for the Gaza Support Platform.

---

## Backend API Base URL

Set your API base URL in frontend environment variables:

```javascript
// .env or .env.local
REACT_APP_API_URL=http://localhost:8000/api
```

**Example API calls:**
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Public endpoints (no token needed)
const response = await fetch(`${API_BASE}/donations`);

// Protected endpoints (token required)
const response = await fetch(`${API_BASE}/admin/users`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Authentication Flow

### 1. User Registration (Public)
```javascript
// POST /api/users
async function registerUser(userData) {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password
    })
  });
  return response.json();
}
```

### 2. Admin Login (Public)
```javascript
// POST /api/admin/login
async function adminLogin(email, password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.token) {
    // Store token (localStorage or sessionStorage)
    localStorage.setItem('admin_token', data.token);
    return data;
  }
  throw new Error(data.message);
}
```

### 3. Using Admin Token
```javascript
// All admin endpoints require Bearer token
const token = localStorage.getItem('admin_token');

const response = await fetch(`${API_BASE}/admin/users`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 4. Admin Logout
```javascript
// POST /api/admin/logout
async function adminLogout(token) {
  const response = await fetch(`${API_BASE}/admin/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Clear stored token
  localStorage.removeItem('admin_token');
  return response.json();
}
```

---

## Donations Module Integration

### Create Donation (Public)
```javascript
// POST /api/donations
async function submitDonation(donationData) {
  const response = await fetch(`${API_BASE}/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category_id: donationData.categoryId,
      amount: donationData.amount,
      donor_name: donationData.name,
      donor_email: donationData.email,
      message: donationData.message,
      status: 'pending'
    })
  });
  return response.json();
}
```

### Get All Donations (Public)
```javascript
// GET /api/donations
async function getDonations(page = 1) {
  const response = await fetch(`${API_BASE}/donations?page=${page}`);
  return response.json();
}
```

### Admin: Get Donations with Filters
```javascript
// GET /api/admin/donations?status=pending&category_id=1&start_date=2025-01-01&page=1
async function getAdminDonations(filters) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.categoryId) params.append('category_id', filters.categoryId);
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);
  params.append('page', filters.page || 1);
  
  const response = await fetch(`${API_BASE}/admin/donations?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### Admin: Update Donation Status
```javascript
// PUT /api/admin/donations/{id}/status
async function updateDonationStatus(donationId, status) {
  const response = await fetch(`${API_BASE}/admin/donations/${donationId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  return response.json();
}
```

### Admin: Donation Statistics
```javascript
// GET /api/admin/donations/stats/summary
async function getDonationStats() {
  const response = await fetch(`${API_BASE}/admin/donations/stats/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  // Returns: { summary: {...}, by_category: [...], by_status: [...] }
}
```

### Admin: Export Donations to CSV
```javascript
// GET /api/admin/donations/export/csv
async function exportDonationsCSV() {
  const response = await fetch(`${API_BASE}/admin/donations/export/csv`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  
  // Create and download CSV file
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data.csv));
  element.setAttribute('download', data.filename);
  element.click();
}
```

---

## Testimonials Module Integration

### Submit Testimonial (Public)
```javascript
// POST /api/testimonials
async function submitTestimonial(testimonialData) {
  const response = await fetch(`${API_BASE}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testimonialData.name,
      email: testimonialData.email,
      content: testimonialData.content,
      rating: testimonialData.rating,
      image_url: testimonialData.imageUrl,
      approved: false  // Requires admin approval
    })
  });
  return response.json();
}
```

### Get Approved Testimonials (Public)
```javascript
// GET /api/testimonials
async function getTestimonials(page = 1) {
  const response = await fetch(`${API_BASE}/testimonials?page=${page}`);
  return response.json();
}
```

### Admin: Get All Testimonials
```javascript
// GET /api/admin/testimonials?approved=false&page=1
async function getAdminTestimonials(filters) {
  const params = new URLSearchParams();
  if (filters.approved !== undefined) params.append('approved', filters.approved);
  if (filters.minRating) params.append('min_rating', filters.minRating);
  params.append('page', filters.page || 1);
  
  const response = await fetch(`${API_BASE}/admin/testimonials?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### Admin: Get Pending Testimonials
```javascript
// GET /api/admin/testimonials/pending/all
async function getPendingTestimonials() {
  const response = await fetch(`${API_BASE}/admin/testimonials/pending/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  // Returns: { count: number, testimonials: [...] }
}
```

### Admin: Approve Testimonial
```javascript
// PUT /api/admin/testimonials/{id}/approve
async function approveTestimonial(testimonialId) {
  const response = await fetch(`${API_BASE}/admin/testimonials/${testimonialId}/approve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### Admin: Reject Testimonial
```javascript
// PUT /api/admin/testimonials/{id}/reject
async function rejectTestimonial(testimonialId) {
  const response = await fetch(`${API_BASE}/admin/testimonials/${testimonialId}/reject`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### Admin: Testimonial Statistics
```javascript
// GET /api/admin/testimonials/stats/summary
async function getTestimonialStats() {
  const response = await fetch(`${API_BASE}/admin/testimonials/stats/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  // Returns: { summary: {...}, rating_distribution: [...], latest: [...] }
}
```

---

## User Management Integration (Admin)

### Get All Users
```javascript
// GET /api/admin/users?page=1
async function getUsers(page = 1) {
  const response = await fetch(`${API_BASE}/admin/users?page=${page}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### Search Users
```javascript
// GET /api/admin/users/search?query=john
async function searchUsers(query) {
  const response = await fetch(`${API_BASE}/admin/users/search?query=${query}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  // Returns: { results: [...] }
}
```

### Get User Details
```javascript
// GET /api/admin/users/{id}
async function getUserDetails(userId) {
  const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  // Returns: { id, name, email, role, total_donated, created_at, updated_at }
}
```

### Update User Role
```javascript
// PUT /api/admin/users/{id}/role
async function updateUserRole(userId, role) {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role })
  });
  return response.json();
}
```

### Delete User
```javascript
// DELETE /api/admin/users/{id}
async function deleteUser(userId) {
  const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.status === 204 ? { success: true } : response.json();
}
```

---

## Dashboard Statistics Integration

### Get Dashboard Overview
```javascript
// GET /api/admin/statistics
async function getDashboardStats() {
  const response = await fetch(`${API_BASE}/admin/statistics`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  
  // Response includes:
  // {
  //   summary: {
  //     total_donations,
  //     total_donation_count,
  //     pending_donations,
  //     completed_donations,
  //     total_messages,
  //     approved_messages,
  //     total_users,
  //     admin_users
  //   },
  //   latest_donations: [...],
  //   latest_messages: [...],
  //   monthly_trends: {
  //     donations: [...],
  //     messages: [...]
  //   }
  // }
}
```

---

## Donation Categories Integration

### Get All Categories
```javascript
// GET /api/donation-categories
async function getDonationCategories() {
  const response = await fetch(`${API_BASE}/donation-categories`);
  return response.json();
}
```

### Create Category (Admin)
```javascript
// POST /api/donation-categories
async function createCategory(categoryData) {
  const response = await fetch(`${API_BASE}/donation-categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: categoryData.name,
      description: categoryData.description,
      icon: categoryData.icon
    })
  });
  return response.json();
}
```

---

## Error Handling

### Standard Error Response Format
```javascript
// 401 Unauthorized (missing token)
{
  "message": "Unauthenticated"
}

// 403 Forbidden (not admin)
{
  "message": "Unauthorized - Admin access required"
}

// 422 Validation Error
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}

// 404 Not Found
{
  "message": "Model not found"
}
```

### Error Handler Utility
```javascript
async function handleApiResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    switch (response.status) {
      case 401:
        // Clear token and redirect to login
        localStorage.removeItem('admin_token');
        window.location.href = '/connexion';
        break;
      case 403:
        throw new Error('You do not have permission to access this resource');
      case 422:
        // Validation error - display field errors
        throw new Error(JSON.stringify(data.errors));
      case 404:
        throw new Error('Resource not found');
      default:
        throw new Error(data.message || 'An error occurred');
    }
  }
  
  return data;
}
```

---

## React Hooks for API Integration

### useAuthToken Hook
```javascript
import { useState, useEffect } from 'react';

export function useAuthToken() {
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    setToken(storedToken);
  }, []);
  
  const saveToken = (newToken) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };
  
  const clearToken = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };
  
  return { token, saveToken, clearToken };
}
```

### useApi Hook
```javascript
import { useState, useCallback } from 'react';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { loading, error, fetchData };
}
```

---

## Environment Variables

Create a `.env.local` file in the frontend root:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Authentication
REACT_APP_AUTH_STORAGE_KEY=admin_token

# Feature Flags
REACT_APP_ENABLE_ADMIN=true
```

---

## CORS Configuration (If Needed)

If frontend and backend are on different origins, ensure CORS is properly configured in Laravel:

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000', 'https://yourdomain.com'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => ['Authorization'],
'max_age' => 3600,
```

---

## Testing Integration

### Test Admin Login
1. Navigate to Administrateur page
2. Enter admin email: `admin@example.com`
3. Enter admin password: `password`
4. Click login
5. Verify token is stored in localStorage
6. Verify redirect to admin dashboard

### Test Donation Submission
1. Navigate to Dons page
2. Fill in donation form
3. Click submit
4. Verify success message
5. Check backend for new donation record

### Test Testimonial Moderation
1. Log in as admin
2. Navigate to messages section
3. See pending testimonials count
4. Approve/reject testimonials
5. Verify changes in statistics

---

## Production Deployment Notes

1. **API Base URL:**
   - Development: `http://localhost:8000/api`
   - Production: `https://api.yourdomain.com/api`

2. **HTTPS:**
   - Always use HTTPS in production
   - Ensure backend also uses HTTPS
   - Update CORS configuration

3. **Token Security:**
   - Consider using httpOnly cookies instead of localStorage
   - Implement token refresh logic
   - Add CSRF protection if needed

4. **API Rate Limiting:**
   - Consider implementing rate limiting on backend
   - Add throttling on frontend for better UX

5. **Error Logging:**
   - Log errors to monitoring service (Sentry, etc.)
   - Don't expose sensitive info to users

---

## Support & Troubleshooting

### Token Expiration
If users experience "Unauthenticated" errors:
1. Check if token is stored in localStorage
2. Implement token refresh mechanism
3. Redirect to login page on 401

### CORS Errors
If you see CORS errors:
1. Verify API_URL matches backend domain
2. Check Laravel CORS configuration
3. Ensure proper headers are sent

### API Not Responding
1. Verify backend is running: `php artisan serve`
2. Check API base URL in frontend
3. Verify network tab in browser DevTools
4. Check Laravel logs: `storage/logs/laravel.log`

For more detailed API documentation, see `ADMIN_API_DOCUMENTATION.md` in the backend folder.
