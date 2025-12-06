require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Import routes
const authRoutes = require('./routes/auth');
const institutionRoutes = require('./routes/institution');
const alumniRoutes = require('./routes/alumni');
const followRoutes = require('./routes/follow');
const notificationRoutes = require('./routes/notification');
const slotRoutes = require('./routes/slots');

// Import WebSocket server
const WebSocketServer = require('./webSocketServer');

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Routes
console.log('Setting up routes');
app.use('/api/auth', authRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/slots', slotRoutes);
console.log('Routes set up successfully');
console.log('Auth routes mounted at /api/auth');
console.log('Institution routes mounted at /api/institution');
console.log('Alumni routes mounted at /api/alumni');
console.log('Follow routes mounted at /api/follow');
console.log('Notification routes mounted at /api/notifications');
console.log('Slot routes mounted at /api/slots');

// Simple test route (moved after auth routes)
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server test route working' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check route hit');
  res.json({ 
    status: 'OK', 
    message: 'Alumni Association Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Use a safe port (5005) instead of 5004 which might be in use
const PORT = process.env.PORT || 5005;

// Start server with fixed port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize WebSocket server after HTTP server starts
  const webSocketServer = new WebSocketServer(server);
  
  // Pass WebSocket server to controllers
  const { setWebSocketServer: setNotificationWebSocketServer } = require('./controllers/notificationController');
  const { setWebSocketServer: setFollowWebSocketServer } = require('./controllers/followController');
  const { setWebSocketServer: setSlotWebSocketServer } = require('./controllers/slotController');
  
  setNotificationWebSocketServer(webSocketServer);
  setFollowWebSocketServer(webSocketServer);
  setSlotWebSocketServer(webSocketServer);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// 404 handler - this should be the LAST middleware
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  console.log('Full URL:', req.url);
  console.log('Base URL:', req.baseUrl);
  console.log('Original URL:', req.originalUrl);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.path,
    url: req.url
  });
});

module.exports = app;