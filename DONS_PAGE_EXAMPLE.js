/**
 * Example: How to Integrate API with Your Dons Page
 * Copy this code into your pages/Dons.js file
 */

import React, { useState, useEffect } from 'react';
import { donationAPI, donationCategoryAPI } from '../utils/api';

function Dons({ isLoggedIn, setIsLoggedIn }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch donation categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await donationCategoryAPI.getAll();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (err) {
        setError('Failed to load donation categories');
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare donation data
      const donationData = {
        category_id: parseInt(selectedCategory),
        amount: parseFloat(formData.amount),
        donor_name: formData.name,
        donor_email: formData.email,
        message: formData.message || null,
        user_id: isLoggedIn ? JSON.parse(localStorage.getItem('userId')) : null,
        status: 'pending'
      };

      // Create donation
      const response = await donationAPI.create(donationData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        amount: '',
        message: '',
      });

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        window.location.href = '/success';
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to create donation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dons-page">
      <h1>Faire un Don / Make a Donation</h1>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          Donation created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="donation-form">
        
        {/* Donor Information */}
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="your.email@example.com"
          />
        </div>

        {/* Donation Category */}
        <div className="form-group">
          <label htmlFor="category">Donation Category *</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.description && ` - ${category.description}`}
              </option>
            ))}
          </select>
        </div>

        {/* Donation Amount */}
        <div className="form-group">
          <label htmlFor="amount">Amount (USD) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
        </div>

        {/* Message */}
        <div className="form-group">
          <label htmlFor="message">Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Share your message or reason for donating"
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Processing...' : 'Make Donation'}
        </button>
      </form>

      {/* Category Info Display */}
      {selectedCategory && categories.length > 0 && (
        <div className="category-info">
          <h3>About this category:</h3>
          <p>
            {categories.find(c => c.id === parseInt(selectedCategory))?.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dons;
