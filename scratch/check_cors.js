const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8001,
  path: '/health',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:3001',
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'X-API-Key'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
