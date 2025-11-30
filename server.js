const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sochai-backend';
mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Import routes
const authRoutes = require('./routes/auth');
const modelRoutes = require('./routes/models');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SochAI Backend API is running!' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Model routes
app.use('/api/models', modelRoutes);

// Simple POST API that returns "Hello World"
app.post('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello World',
    timestamp: new Date().toISOString(),
    method: 'POST'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- GET  /api/health`);
  console.log(`- POST /api/hello`);
  console.log(`- POST /api/auth/signup`);
  console.log(`- POST /api/auth/login`);
  console.log(`- POST /api/models (protected)`);
  console.log(`- GET  /api/models`);
  console.log(`- GET  /api/models/my-models (protected)`);
  console.log(`- GET  /api/models/:id`);
  console.log(`- PUT  /api/models/:id (protected)`);
  console.log(`- DELETE /api/models/:id (protected)`);
});

module.exports = app;