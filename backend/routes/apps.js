const express = require('express');
const router = express.Router();
const appStoreService = require('../services/appStore');

/**
 * @route   GET /api/apps/search
 * @desc    Search for apps by term or category
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { term, category } = req.query;
    
    if (!term && !category) {
      return res.status(400).json({ 
        error: true, 
        message: 'Please provide a search term or category' 
      });
    }
    
    const options = {};
    if (term) options.term = term;
    if (category) options.category = parseInt(category, 10);
    
    const apps = await appStoreService.searchApps(options);
    
    res.json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (error) {
    console.error('Error searching apps:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error searching apps' 
    });
  }
});

/**
 * @route   GET /api/apps/:id
 * @desc    Get details for a specific app
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Received request for app details with ID: ${id}`);
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ 
        error: true, 
        message: 'Invalid app ID provided' 
      });
    }
    
    try {
      const app = await appStoreService.getAppDetails(id);
      
      if (!app) {
        return res.status(404).json({ 
          error: true, 
          message: `App with ID ${id} not found` 
        });
      }
      
      res.json({
        success: true,
        data: app
      });
    } catch (appError) {
      console.error(`App store service error for ${id}:`, appError);
      
      // Check for specific error types
      if (appError.message && appError.message.includes('not found')) {
        return res.status(404).json({ 
          error: true, 
          message: `App with ID ${id} not found in the App Store` 
        });
      }
      
      if (appError.message && appError.message.includes('timed out')) {
        return res.status(504).json({ 
          error: true, 
          message: 'App Store request timed out. Please try again later.' 
        });
      }
      
      res.status(500).json({ 
        error: true, 
        message: 'Error retrieving app details from App Store',
        details: appError.message
      });
    }
  } catch (error) {
    console.error(`General error handling app details for ${req.params.id}:`, error);
    res.status(500).json({ 
      error: true, 
      message: 'Server error processing app details request' 
    });
  }
});

/**
 * @route   GET /api/apps/:id/similar
 * @desc    Get similar apps based on an app ID
 * @access  Public
 */
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    
    const similarApps = await appStoreService.getSimilarApps(id);
    
    res.json({
      success: true,
      count: similarApps.length,
      data: similarApps
    });
  } catch (error) {
    console.error(`Error getting similar apps for ${req.params.id}:`, error);
    res.status(500).json({ 
      error: true, 
      message: 'Error getting similar apps' 
    });
  }
});

/**
 * @route   GET /api/apps/categories/list
 * @desc    Get list of app categories
 * @access  Public
 */
router.get('/categories/list', async (req, res) => {
  try {
    // Common iOS app categories with their IDs
    const categories = [
      { id: 6002, name: 'Weather' },
      { id: 6007, name: 'Productivity' },
      { id: 6008, name: 'Photo & Video' },
      { id: 6017, name: 'Health & Fitness' },
      { id: 6015, name: 'Finance' },
      { id: 6005, name: 'Social Networking' },
      { id: 6016, name: 'Travel' },
      { id: 6023, name: 'Food & Drink' },
      { id: 6013, name: 'Sports' },
      { id: 6012, name: 'Lifestyle' },
      { id: 6000, name: 'Business' },
      { id: 6001, name: 'Education' },
      { id: 6003, name: 'Utilities' },
      { id: 6004, name: 'Entertainment' },
      { id: 6006, name: 'Music' },
      { id: 6009, name: 'Games' },
      { id: 6010, name: 'Books' },
      { id: 6011, name: 'News' },
      { id: 6018, name: 'Medical' },
      { id: 6020, name: 'Navigation' }
    ];
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error getting categories' 
    });
  }
});

/**
 * @route   GET /api/apps/test/:id
 * @desc    Test endpoint to verify app ID handling
 * @access  Public
 */
router.get('/test/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: 'Test endpoint working',
    receivedId: id,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 