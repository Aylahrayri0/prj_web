# React Frontend - Backend Integration Guide

## Setup Instructions

### 1. Environment Configuration
Your `.env` file is already configured with:
```
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

### 2. API Service
The API service is located at: `src/utils/api.js`

It provides these modules:
- `donationCategoryAPI` - Manage donation categories
- `donationAPI` - Manage donations
- `articleAPI` - Manage articles
- `testimonialAPI` - Manage testimonials
- `impactAPI` - Manage impact statistics

### 3. Quick Start - Using the API in Your Components

#### Example 1: Fetch Donations
```javascript
import { donationAPI } from '../utils/api';
import { useState, useEffect } from 'react';

function MyComponent() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    donationAPI.getAll().then(data => setDonations(data));
  }, []);

  return (
    <div>
      {donations.map(d => (
        <div key={d.id}>{d.donor_name}: ${d.amount}</div>
      ))}
    </div>
  );
}
```

#### Example 2: Create a Donation
```javascript
import { donationAPI } from '../utils/api';

const newDonation = await donationAPI.create({
  category_id: 1,
  amount: 100,
  donor_name: 'Ahmed',
  donor_email: 'ahmed@example.com',
  message: 'Help needed',
  status: 'pending'
});
```

#### Example 3: Fetch Categories
```javascript
import { donationCategoryAPI } from '../utils/api';

const categories = await donationCategoryAPI.getAll();
console.log(categories);
```

#### Example 4: Update a Donation
```javascript
import { donationAPI } from '../utils/api';

await donationAPI.update(donationId, {
  status: 'completed'
});
```

#### Example 5: Delete a Donation
```javascript
import { donationAPI } from '../utils/api';

await donationAPI.delete(donationId);
```

### 4. Error Handling
```javascript
try {
  const donations = await donationAPI.getAll();
  console.log(donations);
} catch (error) {
  console.error('Failed to fetch donations:', error.message);
}
```

### 5. Async/Await Pattern (Recommended)
```javascript
import { donationAPI } from '../utils/api';
import { useState, useEffect } from 'react';

function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const data = await donationAPI.getAll();
        setDonations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {donations.map(d => (
        <div key={d.id}>{d.donor_name}: ${d.amount}</div>
      ))}
    </div>
  );
}
```

### 6. Available API Methods

#### Donation Categories
```javascript
donationCategoryAPI.getAll()           // Get all categories
donationCategoryAPI.getById(id)        // Get single category
donationCategoryAPI.create(data)       // Create category
donationCategoryAPI.update(id, data)   // Update category
donationCategoryAPI.delete(id)         // Delete category
```

#### Donations
```javascript
donationAPI.getAll()           // Get all donations
donationAPI.getById(id)        // Get single donation
donationAPI.create(data)       // Create donation
donationAPI.update(id, data)   // Update donation
donationAPI.delete(id)         // Delete donation
```

#### Articles
```javascript
articleAPI.getAll()           // Get all articles
articleAPI.getById(id)        // Get single article
articleAPI.create(data)       // Create article
articleAPI.update(id, data)   // Update article
articleAPI.delete(id)         // Delete article
```

#### Testimonials
```javascript
testimonialAPI.getAll()           // Get approved testimonials
testimonialAPI.getById(id)        // Get single testimonial
testimonialAPI.create(data)       // Create testimonial
testimonialAPI.update(id, data)   // Update testimonial
testimonialAPI.delete(id)         // Delete testimonial
```

#### Impact Statistics
```javascript
impactAPI.getAll()           // Get all statistics
impactAPI.getById(id)        // Get single statistic
impactAPI.create(data)       // Create statistic
impactAPI.update(id, data)   // Update statistic
impactAPI.delete(id)         // Delete statistic
```

### 7. Data Models

#### Donation
```javascript
{
  id: number,
  category_id: number,
  user_id: number | null,
  amount: decimal,
  donor_name: string,
  donor_email: string,
  message: string | null,
  status: 'pending' | 'completed' | 'failed',
  created_at: timestamp,
  updated_at: timestamp
}
```

#### Donation Category
```javascript
{
  id: number,
  name: string,
  description: string | null,
  created_at: timestamp,
  updated_at: timestamp
}
```

#### Article
```javascript
{
  id: number,
  user_id: number,
  title: string,
  content: string,
  image_url: string | null,
  category: string | null,
  created_at: timestamp,
  updated_at: timestamp
}
```

#### Testimonial
```javascript
{
  id: number,
  name: string,
  email: string,
  content: string,
  rating: number (1-5),
  image_url: string | null,
  approved: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

#### Impact Statistic
```javascript
{
  id: number,
  metric_name: string,
  value: number,
  description: string | null,
  created_at: timestamp,
  updated_at: timestamp
}
```

### 8. Backend URL
The backend API is running on: `http://127.0.0.1:8000`

Make sure the Laravel server is running before making any API calls!

### 9. CORS Issue?
If you get CORS errors, the backend `.env` has been configured to allow requests from your React app. If needed, you can update it in `gaza-support-backend/config/cors.php`

### 10. Start Your React App
```bash
cd prj_web
npm start
```

The app will run on `http://localhost:3000` by default.

---

**Your frontend and backend are now connected! Start building! 🚀**
