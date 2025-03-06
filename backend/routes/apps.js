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
    
    const app = await appStoreService.getAppDetails(id);
    
    if (!app) {
      return res.status(404).json({ 
        error: true, 
        message: 'App not found' 
      });
    }
    
    res.json({
      success: true,
      data: app
    });
  } catch (error) {
    console.error(`Error getting app details for ${req.params.id}:`, error);
    res.status(500).json({ 
      error: true, 
      message: 'Error getting app details' 
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
 * @route   GET /api/apps/categories
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
      { id: 6012, name: 'Lifestyle' }
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

module.exports = router; 