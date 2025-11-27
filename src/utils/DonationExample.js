/**
 * Example usage of the API service
 * Copy and modify this code in your pages/components
 */

import React, { useState, useEffect } from 'react';
import { donationAPI, donationCategoryAPI, impactAPI } from '../utils/api';

export const DonationExample = () => {
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all donations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [donationsData, categoriesData] = await Promise.all([
          donationAPI.getAll(),
          donationCategoryAPI.getAll(),
        ]);
        setDonations(donationsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create a new donation
  const handleCreateDonation = async (donationData) => {
    try {
      const newDonation = await donationAPI.create({
        category_id: donationData.categoryId,
        amount: donationData.amount,
        donor_name: donationData.name,
        donor_email: donationData.email,
        message: donationData.message || null,
        status: 'pending',
      });
      setDonations([...donations, newDonation]);
      alert('Donation created successfully!');
    } catch (err) {
      alert('Error creating donation: ' + err.message);
    }
  };

  // Update donation status
  const handleUpdateDonation = async (donationId, newStatus) => {
    try {
      const updatedDonation = await donationAPI.update(donationId, {
        status: newStatus,
      });
      setDonations(donations.map(d => d.id === donationId ? updatedDonation : d));
      alert('Donation updated successfully!');
    } catch (err) {
      alert('Error updating donation: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Donations</h2>

      {/* Example: Display categories dropdown */}
      <select>
        <option>Select a category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Example: List all donations */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Donor</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(donation => (
            <tr key={donation.id}>
              <td>{donation.id}</td>
              <td>{donation.donor_name}</td>
              <td>${donation.amount}</td>
              <td>{donation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Example: Create donation form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleCreateDonation({
          categoryId: formData.get('category'),
          amount: formData.get('amount'),
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        });
      }}>
        <input type="text" name="name" placeholder="Your name" required />
        <input type="email" name="email" placeholder="Your email" required />
        <select name="category" required>
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input type="number" name="amount" placeholder="Amount" step="0.01" required />
        <textarea name="message" placeholder="Message (optional)"></textarea>
        <button type="submit">Make Donation</button>
      </form>
    </div>
  );
};

export default DonationExample;
