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
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/apps', appsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
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
app.listen(PORT, () => {
  // Ensure directories exist
  ensureDirectoriesExist();
  console.log(`Server running on port ${PORT}`);
}); 