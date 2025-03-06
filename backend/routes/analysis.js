const express = require('express');
const router = express.Router();
const analysisService = require('../services/analysis');
const storageUtils = require('../utils/storage');
const path = require('path');

/**
 * @route   POST /api/analysis/:appId
 * @desc    Analyze reviews for a specific app
 * @access  Public
 */
router.post('/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const { force = false } = req.query;
    
    // Check if we have cached analysis
    const analysisFilePath = path.join(__dirname, '../../data/analysis', `${appId}.json`);
    const cachedAnalysis = storageUtils.readJsonFile(analysisFilePath);
    
    // If we have cached analysis and not forcing a refresh, return it
    if (cachedAnalysis && !force) {
      return res.json({
        success: true,
        data: cachedAnalysis,
        source: 'cache'
      });
    }
    
    // Get reviews for the app
    const reviewsFilePath = path.join(__dirname, '../../data/reviews', `${appId}.json`);
    const reviews = storageUtils.readJsonFile(reviewsFilePath);
    
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ 
        error: true, 
        message: 'No reviews found for this app. Please fetch reviews first.' 
      });
    }
    
    // Analyze the reviews
    const analysis = await analysisService.analyzeReviews(reviews);
    
    // Cache the analysis
    storageUtils.writeJsonFile(analysisFilePath, analysis);
    
    res.json({
      success: true,
      data: analysis,
      source: 'fresh'
    });
  } catch (error) {
    console.error(`Error analyzing reviews for app ${req.params.appId}:`, error);
    res.status(500).json({ 
      error: true, 
      message: 'Error analyzing reviews' 
    });
  }
});

/**
 * @route   GET /api/analysis/:appId
 * @desc    Get analysis for a specific app
 * @access  Public
 */
router.get('/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    
    // Check if we have cached analysis
    const analysisFilePath = path.join(__dirname, '../../data/analysis', `${appId}.json`);
    const cachedAnalysis = storageUtils.readJsonFile(analysisFilePath);
    
    if (!cachedAnalysis) {
      return res.status(404).json({ 
        error: true, 
        message: 'No analysis found for this app. Please analyze reviews first.' 
      });
    }
    
    res.json({
      success: true,
      data: cachedAnalysis
    });
  } catch (error) {
    console.error(`Error getting analysis for app ${req.params.appId}:`, error);
    res.status(500).json({ 
      error: true, 
      message: 'Error getting analysis' 
    });
  }
});

/**
 * @route   GET /api/analysis/cached/list
 * @desc    Get list of apps with cached analysis
 * @access  Public
 */
router.get('/cached/list', async (req, res) => {
  try {
    const analysisDir = path.join(__dirname, '../../data/analysis');
    const cachedAnalysis = storageUtils.listJsonFiles(analysisDir);
    
    const analysisList = cachedAnalysis.map(file => {
      const appId = path.basename(file, '.json');
      const stats = storageUtils.getFileStats(file);
      
      return {
        appId,
        lastUpdated: stats.mtime
      };
    });
    
    res.json({
      success: true,
      count: analysisList.length,
      data: analysisList
    });
  } catch (error) {
    console.error('Error getting cached analysis list:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error getting cached analysis list' 
    });
  }
});

/**
 * @route   POST /api/analysis/compare
 * @desc    Compare analysis of multiple apps
 * @access  Public
 */
router.post('/compare', async (req, res) => {
  try {
    const { appIds } = req.body;
    
    if (!appIds || !Array.isArray(appIds) || appIds.length < 2) {
      return res.status(400).json({ 
        error: true, 
        message: 'Please provide at least two app IDs to compare' 
      });
    }
    
    // Get analysis for each app
    const analysisResults = [];
    for (const appId of appIds) {
      const analysisFilePath = path.join(__dirname, '../../data/analysis', `${appId}.json`);
      const analysis = storageUtils.readJsonFile(analysisFilePath);
      
      if (analysis) {
        analysisResults.push({
          appId,
          analysis
        });
      }
    }
    
    if (analysisResults.length < 2) {
      return res.status(404).json({ 
        error: true, 
        message: 'Not enough analysis data found. Please analyze at least two apps first.' 
      });
    }
    
    // Compare the analysis
    const comparison = await analysisService.compareAnalysis(analysisResults);
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error comparing analysis:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error comparing analysis' 
    });
  }
});

/**
 * @route   POST /api/analysis/market-gaps
 * @desc    Identify market gaps based on app analysis
 * @access  Public
 */
router.post('/market-gaps', async (req, res) => {
  try {
    const { appIds } = req.body;
    
    if (!appIds || !Array.isArray(appIds) || appIds.length < 1) {
      return res.status(400).json({ 
        error: true, 
        message: 'Please provide at least one app ID' 
      });
    }
    
    // Get analysis for each app
    const analysisResults = [];
    for (const appId of appIds) {
      const analysisFilePath = path.join(__dirname, '../../data/analysis', `${appId}.json`);
      const analysis = storageUtils.readJsonFile(analysisFilePath);
      
      if (analysis) {
        analysisResults.push({
          appId,
          analysis
        });
      }
    }
    
    if (analysisResults.length === 0) {
      return res.status(404).json({ 
        error: true, 
        message: 'No analysis data found. Please analyze apps first.' 
      });
    }
    
    // Identify market gaps
    const marketGaps = await analysisService.identifyMarketGaps(analysisResults);
    
    // Save the report
    const reportPath = path.join(__dirname, '../../data/reports', `market_gaps_${new Date().toISOString().split('T')[0]}.json`);
    storageUtils.writeJsonFile(reportPath, marketGaps);
    
    res.json({
      success: true,
      data: marketGaps
    });
  } catch (error) {
    console.error('Error identifying market gaps:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error identifying market gaps' 
    });
  }
});

module.exports = router; 