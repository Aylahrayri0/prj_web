// Test donation creation (guest user without login)
console.log('Testing Guest Donation Submission\n');

(async () => {
  try {
    const donationResponse = await fetch('http://127.0.0.1:8000/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: 1,
        amount: 980.00,
        donor_name: 'hanan',
        donor_email: 'hanan@guest.com',
        message: 'Don sécurisé via carte 2111'
      })
    });
    
    const donation = await donationResponse.json();
    
    if (donationResponse.ok) {
      console.log('✅ Donation created successfully!');
      console.log(`   Donation ID: ${donation.id}`);
      console.log(`   Donor: ${donation.donor_name}`);
      console.log(`   Amount: $${donation.amount}`);
      console.log(`   Email: ${donation.donor_email}`);
      console.log(`   Status: ${donation.status}`);
      console.log(`   User ID: ${donation.user_id || 'null (guest)'}`);
      console.log('');
      console.log('✅ This donation will now appear in Administrateur.js!');
    } else {
      console.log('❌ Donation failed:', donation);
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
})();
