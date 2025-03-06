const express = require('express');
const router = express.Router();
const reviewsService = require('../services/reviews');
const storageUtils = require('../utils/storage');
const path = require('path');

/**
 * @route   GET /api/reviews/:appId
 * @desc    Get reviews for a specific app
 * @access  Public
 */
router.get('/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const { limit = 200, force = false } = req.query;
    
    // Check if we have cached reviews
    const reviewsFilePath = path.join(__dirname, '../../data/reviews', `${appId}.json`);
    const cachedReviews = storageUtils.readJsonFile(reviewsFilePath);
    
    // If we have cached reviews and not forcing a refresh, return them
    if (cachedReviews && cachedReviews.length > 0 && force !== 'true') {
      return res.json({
        success: true,
        count: cachedReviews.length,
        data: cachedReviews,
        source: 'cache'
      });
    }
    
    // Otherwise, fetch fresh reviews
    const reviews = await reviewsService.fetchReviews(appId, parseInt(limit, 10));
    
    // Cache the reviews
    storageUtils.writeJsonFile(reviewsFilePath, reviews);
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
      source: 'fresh'
    });
  } catch (error) {
    console.error(`Error getting reviews for app ${req.params.appId}:`, error);
    res.status(500).json({ 
      error: true, 
      message: 'Error getting reviews' 
    });
  }
});

/**
 * @route   GET /api/reviews/cached/list
 * @desc    Get list of apps with cached reviews
 * @access  Public
 */
router.get('/cached/list', async (req, res) => {
  try {
    const reviewsDir = path.join(__dirname, '../../data/reviews');
    const cachedApps = storageUtils.listJsonFiles(reviewsDir);
    
    const appsList = cachedApps.map(file => {
      const appId = path.basename(file, '.json');
      const stats = storageUtils.getFileStats(file);
      const reviewCount = storageUtils.readJsonFile(file)?.length || 0;
      
      return {
        appId,
        reviewCount,
        lastUpdated: stats.mtime
      };
    });
    
    res.json({
      success: true,
      count: appsList.length,
      data: appsList
    });
  } catch (error) {
    console.error('Error getting cached reviews list:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error getting cached reviews list' 
    });
  }
});

/**
 * @route   DELETE /api/reviews/:appId
 * @desc    Delete cached reviews for a specific app
 * @access  Public
 */
router.delete('/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const reviewsFilePath = path.join(__dirname, '../../data/reviews', `${appId}.json`);
    
    const deleted = storageUtils.deleteFile(reviewsFilePath);
    
    if (!deleted) {
      return res.status(404).json({ 
        error: true, 
        message: 'Cached reviews not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Cached reviews deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting cached reviews for app ${req.params.appId}:`, error);
    res.status(500).json({ 
      error: true, 
      message: 'Error deleting cached reviews' 
    });
  }
});

module.exports = router; 