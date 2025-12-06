const express = require('express');
const app = express();

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Test POST route
app.post('/test-post', (req, res) => {
  res.json({ message: 'Test POST route working' });
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});