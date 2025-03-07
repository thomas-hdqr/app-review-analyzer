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

/**
 * @route   POST /api/analysis/mvp-opportunity
 * @desc    Analyze opportunity for MVP development based on similar apps
 * @access  Public
 */
router.post('/mvp-opportunity', async (req, res) => {
  try {
    const { appIds, category } = req.body;
    
    if (!appIds || !Array.isArray(appIds) || appIds.length < 2) {
      return res.status(400).json({ 
        error: true, 
        message: 'Please provide at least two similar app IDs to analyze' 
      });
    }
    
    // Get analysis for each app
    const analysisResults = [];
    const appDetails = [];
    
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
    
    // Generate market gaps analysis
    const marketGaps = await analysisService.identifyMarketGaps(analysisResults);
    
    // Enhance with OpenAI insights if available
    let aiOpportunityInsights = null;
    
    // Get OpenAI API configuration from environment
    if (process.env.OPENAI_API_KEY && analysisResults.length > 0) {
      // Combine negative themes from all apps for better insight
      const allNegativeThemes = [];
      const allPositiveThemes = [];
      
      analysisResults.forEach(result => {
        if (result.analysis.negativeThemes) {
          allNegativeThemes.push(...result.analysis.negativeThemes);
        }
        if (result.analysis.positiveThemes) {
          allPositiveThemes.push(...result.analysis.positiveThemes);
        }
      });
      
      // Get sample reviews from each app for context
      const sampleReviews = [];
      analysisResults.forEach(result => {
        const appId = result.appId;
        const reviewsFilePath = path.join(__dirname, '../../data/reviews', `${appId}.json`);
        const reviews = storageUtils.readJsonFile(reviewsFilePath);
        
        if (reviews && reviews.length > 0) {
          // Add 5 random negative reviews
          const negativeReviews = reviews.filter(review => review.score <= 2);
          const randomNegative = negativeReviews
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          
          sampleReviews.push(...randomNegative);
        }
      });
      
      // Get AI insights using the analyzeReviews function
      if (sampleReviews.length > 0) {
        const aiAnalysis = await analysisService.analyzeReviews(sampleReviews);
        aiOpportunityInsights = aiAnalysis.aiInsights;
      }
    }
    
    // Combine everything into a comprehensive MVP opportunity report
    const mvpOpportunityReport = {
      marketGaps: marketGaps.marketGaps.slice(0, 5),
      mvpOpportunityScore: marketGaps.mvpOpportunityScore,
      mvpRecommendedFeatures: marketGaps.mvpRecommendedFeatures,
      aiInsights: aiOpportunityInsights,
      appsAnalyzed: appIds,
      analysisDate: new Date().toISOString(),
      category: category || 'Unknown'
    };
    
    // Save the report
    const reportPath = path.join(__dirname, '../../data/reports', `mvp_opportunity_${new Date().toISOString().split('T')[0]}.json`);
    storageUtils.writeJsonFile(reportPath, mvpOpportunityReport);
    
    res.json({
      success: true,
      data: mvpOpportunityReport
    });
  } catch (error) {
    console.error('Error analyzing MVP opportunity:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error analyzing MVP opportunity' 
    });
  }
});

module.exports = router; 