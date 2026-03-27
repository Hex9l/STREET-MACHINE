import http from 'http';

const data = JSON.stringify({
  name: 'Test Setup User',
  email: 'test@example.com',
  phone: '1234567890',
  message: 'This is a test message to ensure the contact form integration works.',
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', responseBody);
  });
});

req.on('error', (error) => {
  console.error('Error hitting the contact endpoint:', error);
});

req.write(data);
req.end();
