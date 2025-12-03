// Test Gaza Support Backend API
console.log('Testing Gaza Support Backend APIs\n');

const testEndpoint = async (name, url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(`✓ ${name}: ${response.status}`);
    console.log('  Response:', JSON.stringify(data).substring(0, 200));
    return data;
  } catch (err) {
    console.log(`✗ ${name}: ${err.message}`);
    return null;
  }
};

(async () => {
  console.log('[1/5] Testing /api/test...');
  await testEndpoint('Test endpoint', 'http://127.0.0.1:8000/api/test');
  console.log('');

  console.log('[2/5] Testing /api/donation-categories...');
  await testEndpoint('Categories', 'http://127.0.0.1:8000/api/donation-categories');
  console.log('');

  console.log('[3/5] Testing /api/donations...');
  await testEndpoint('Donations', 'http://127.0.0.1:8000/api/donations');
  console.log('');

  console.log('[4/5] Testing /api/testimonials...');
  await testEndpoint('Testimonials', 'http://127.0.0.1:8000/api/testimonials');
  console.log('');

  console.log('[5/5] Creating a test testimonial...');
  const result = await testEndpoint(
    'Create testimonial',
    'http://127.0.0.1:8000/api/testimonials',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        country: 'Test Country',
        message: 'This is a test message to verify API is working',
        rating: 5
      })
    }
  );
  
  console.log('\n✅ Backend verification complete!');
})();
