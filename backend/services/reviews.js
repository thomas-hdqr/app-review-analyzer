const appStore = require('app-store-scraper');
const { delay } = require('../utils/helpers');
const appStoreService = require('./appStore');

/**
 * Fetch reviews for a specific app
 * @param {string} appId - App Store ID or bundle ID
 * @param {number} limit - Maximum number of reviews to fetch (default: 200)
 * @returns {Promise<Array>} - List of reviews
 */
async function fetchReviews(appId, limit = 200) {
  try {
    console.log(`Fetching up to ${limit} reviews for app ${appId}...`);
    
    // Check if the appId is a bundle ID (contains dots) or a numeric ID
    const isNumericId = /^\d+$/.test(appId);
    let numericAppId = appId;
    
    // If it's a bundle ID, try to get the numeric ID first
    if (!isNumericId) {
      try {
        console.log(`Detected bundle ID: ${appId}, attempting to get numeric ID first`);
        const app = await appStoreService.getAppDetails(appId);
        if (app && app.id) {
          numericAppId = app.id;
          console.log(`Successfully found numeric ID ${numericAppId} for bundle ID ${appId}`);
        } else {
          throw new Error(`Could not find numeric ID for bundle ID: ${appId}`);
        }
      } catch (error) {
        console.error(`Error getting numeric ID for bundle ID ${appId}:`, error);
        throw new Error(`Failed to get reviews: ${error.message}`);
      }
    }
    
    // Initialize variables
    let allReviews = [];
    let page = 0;
    let hasMore = true;
    const batchSize = 50; // App Store API returns 50 reviews per page
    
    // Fetch reviews in batches
    while (hasMore && allReviews.length < limit) {
      try {
        // Add delay to avoid rate limiting
        if (page > 0) {
          await delay(1000);
        }
        
        console.log(`Fetching reviews batch ${page + 1} for app ${numericAppId}...`);
        const reviews = await appStore.reviews({
          id: numericAppId,
          country: 'us',
          page,
          sort: appStore.sort.RECENT
        });
        
        if (reviews.length === 0) {
          hasMore = false;
          console.log(`No more reviews found for app ${numericAppId} after ${allReviews.length} reviews`);
        } else {
          allReviews = [...allReviews, ...reviews];
          console.log(`Fetched ${reviews.length} reviews in batch ${page + 1}, total: ${allReviews.length}`);
          page++;
        }
      } catch (error) {
        console.error(`Error fetching reviews batch for app ${numericAppId}:`, error);
        // Wait longer if we hit a rate limit
        await delay(5000);
        
        // Try a few more times before giving up
        if (page > 3) {
          hasMore = false;
          console.log(`Giving up after ${page} batches due to errors`);
        }
      }
    }
    
    // Limit the number of reviews
    allReviews = allReviews.slice(0, limit);
    console.log(`Returning ${allReviews.length} reviews for app ${numericAppId}`);
    
    // Process reviews to standardize format and add sentiment
    return allReviews.map(review => ({
      id: review.id,
      userName: review.userName,
      userUrl: review.userUrl,
      version: review.version,
      rating: review.score,
      title: review.title,
      content: review.text,
      url: review.url,
      date: review.date,
      // Add a simple sentiment score based on rating (1-5)
      // This will be replaced by proper sentiment analysis later
      sentiment: review.score ? (review.score - 1) / 4 : 0.5 // Convert 1-5 to 0-1
    }));
  } catch (error) {
    console.error(`Error fetching reviews for app ${appId}:`, error);
    throw error; // Propagate the error to the caller
  }
}

module.exports = {
  fetchReviews
}; 