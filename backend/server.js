const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const appsRoutes = require('./routes/apps');
const reviewsRoutes = require('./routes/reviews');
const analysisRoutes = require('./routes/analysis');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const MAX_PORT_ATTEMPTS = 10;

// Ensure data directories exist
function ensureDirectoriesExist() {
  const dirs = [
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', 'data/reviews'),
    path.join(__dirname, '..', 'data/analysis'),
    path.join(__dirname, '..', 'data/reports')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Middleware
app.use(cors({
  // Allow requests from any localhost port
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any localhost or 127.0.0.1 origin
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/apps', appsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  // Return detailed health information
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      apps: '/api/apps',
      reviews: '/api/reviews',
      analysis: '/api/analysis'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.status(200).json({
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      pid: process.pid
    },
    request: {
      headers: req.headers,
      ip: req.ip,
      originalUrl: req.originalUrl,
      method: req.method
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: PORT,
      apiBaseUrl: process.env.API_BASE_URL || 'not set'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'An unexpected error occurred'
  });
});

// Start server
function startServer(port, attempt = 1) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // Ensure directories exist
    ensureDirectoriesExist();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
      // Increment by 1 instead of 10 to avoid large port numbers
      const nextPort = port + 1;
      console.log(`Port ${port} is busy, trying port ${nextPort}...`);
      startServer(nextPort, attempt + 1);
    } else {
      console.error('Error starting server:', err);
    }
  });
}

startServer(PORT);