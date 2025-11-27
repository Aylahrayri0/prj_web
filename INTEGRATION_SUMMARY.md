# Backend & Frontend Integration - Setup Complete ✅

## What's Been Set Up

### 1. API Service (`src/utils/api.js`)
- Complete API wrapper for all backend endpoints
- Error handling and request management
- Uses environment variable for backend URL

### 2. Environment Configuration (`.env`)
```
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

### 3. Documentation Files Created
- `BACKEND_DOCUMENTATION.md` - Complete backend API reference
- `FRONTEND_INTEGRATION.md` - How to use the API in your React components
- `DONS_PAGE_EXAMPLE.js` - Example of integrating with your Dons page

### 4. Example Component
- `src/utils/DonationExample.js` - Complete working example with forms and data display

---

## How to Use - Quick Reference

### Step 1: Import the API
```javascript
import { donationAPI, donationCategoryAPI } from '../utils/api';
```

### Step 2: Fetch Data
```javascript
useEffect(() => {
  donationAPI.getAll().then(data => {
    console.log('Donations:', data);
  });
}, []);
```

### Step 3: Create Data
```javascript
const newDonation = await donationAPI.create({
  category_id: 1,
  amount: 100,
  donor_name: 'Ahmed',
  donor_email: 'ahmed@example.com',
  message: 'Help needed',
  status: 'pending'
});
```

---

## File Structure

```
prj_web/
├── src/
│   ├── utils/
│   │   ├── api.js                    # ✨ API Service (NEW)
│   │   └── DonationExample.js        # 📖 Example Component (NEW)
│   ├── pages/
│   │   ├── Dons.js                   # Update this with examples
│   │   ├── Accueil.js
│   │   └── ...
│   └── App.js
├── .env                               # ✨ Environment config (NEW)
├── package.json
└── public/
```

---

## API Endpoints Reference

### Donation Categories
```
GET    /api/donation-categories
POST   /api/donation-categories
GET    /api/donation-categories/{id}
PUT    /api/donation-categories/{id}
DELETE /api/donation-categories/{id}
```

### Donations
```
GET    /api/donations
POST   /api/donations
GET    /api/donations/{id}
PUT    /api/donations/{id}
DELETE /api/donations/{id}
```

### Articles
```
GET    /api/articles
POST   /api/articles
GET    /api/articles/{id}
PUT    /api/articles/{id}
DELETE /api/articles/{id}
```

### Testimonials
```
GET    /api/testimonials
POST   /api/testimonials
GET    /api/testimonials/{id}
PUT    /api/testimonials/{id}
DELETE /api/testimonials/{id}
```

### Impact Statistics
```
GET    /api/impact-statistics
POST   /api/impact-statistics
GET    /api/impact-statistics/{id}
PUT    /api/impact-statistics/{id}
DELETE /api/impact-statistics/{id}
```

---

## Backend Status

**Server:** Running on `http://127.0.0.1:8000`
**API Base URL:** `http://127.0.0.1:8000/api`

To start the server:
```bash
cd gaza-support-backend
php artisan serve
```

---

## Next Steps

1. **Update Your Pages** - Copy the examples from `DONS_PAGE_EXAMPLE.js` to your actual page components
2. **Add Error Handling** - Wrap API calls in try-catch blocks
3. **Add Loading States** - Show spinners while fetching data
4. **Add Success Messages** - Notify users when operations complete
5. **Connect All Pages** - Update Accueil, Connexion, Inscription pages with API integration

---

## Common Usage Patterns

### Pattern 1: Fetch on Mount
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await donationAPI.getAll();
      setDonations(data);
    } catch (err) {
      setError(err.message);
    }
  };
  fetchData();
}, []);
```

### Pattern 2: Handle Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await donationAPI.create(formData);
    alert('Success!');
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
```

### Pattern 3: Update Data
```javascript
const handleUpdate = async (id, newData) => {
  try {
    await donationAPI.update(id, newData);
    // Update local state
    setDonations(donations.map(d => d.id === id ? {...d, ...newData} : d));
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
```

### Pattern 4: Delete Data
```javascript
const handleDelete = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await donationAPI.delete(id);
      // Remove from local state
      setDonations(donations.filter(d => d.id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }
};
```

---

## Testing the Integration

### Test 1: Fetch Categories
```javascript
import { donationCategoryAPI } from './utils/api';

donationCategoryAPI.getAll()
  .then(data => console.log('Categories:', data))
  .catch(err => console.error('Error:', err));
```

### Test 2: Create Donation
```javascript
import { donationAPI } from './utils/api';

donationAPI.create({
  category_id: 1,
  amount: 50,
  donor_name: 'Test User',
  donor_email: 'test@example.com',
  status: 'pending'
})
  .then(data => console.log('Created:', data))
  .catch(err => console.error('Error:', err));
```

---

## Troubleshooting

### Error: Cannot reach backend
- Make sure Laravel server is running: `php artisan serve`
- Check backend URL in `.env` file
- Make sure port 8000 is not blocked

### Error: CORS issues
- Backend is configured to allow requests
- Check `config/cors.php` in backend if needed

### Error: 404 on API endpoint
- Make sure you're using `/api/` prefix
- Example: `http://127.0.0.1:8000/api/donations` ✅
- NOT: `http://127.0.0.1:8000/donations` ❌

### Error: Network timeout
- Backend server might have crashed
- Restart with: `php artisan serve`
- Check browser console for detailed error message

---

## Support

Refer to:
- `FRONTEND_INTEGRATION.md` for detailed integration guide
- `BACKEND_DOCUMENTATION.md` for API reference
- `DONS_PAGE_EXAMPLE.js` for working code examples

**Your project is ready to scale! Start building amazing features! 🚀**
