
async function testLogin() {
  try {
    console.log('Testing login via gateway...');
    const response = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'papseynidiakhate@gmail.com',
        password: '1234'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
