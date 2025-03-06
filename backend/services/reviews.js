const appStore = require('app-store-scraper');
const { delay } = require('../utils/helpers');

/**
 * Fetch reviews for a specific app
 * @param {string} appId - App Store ID
 * @param {number} limit - Maximum number of reviews to fetch (default: 200)
 * @returns {Promise<Array>} - List of reviews
 */
async function fetchReviews(appId, limit = 200) {
  try {
    console.log(`Fetching up to ${limit} reviews for app ${appId}...`);
    
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
        
        const reviews = await appStore.reviews({
          id: appId,
          country: 'us',
          page,
          sort: appStore.sort.RECENT
        });
        
        if (reviews.length === 0) {
          hasMore = false;
        } else {
          allReviews = [...allReviews, ...reviews];
          page++;
        }
      } catch (error) {
        console.error(`Error fetching reviews batch for app ${appId}:`, error);
        // Wait longer if we hit a rate limit
        await delay(5000);
        
        // Try a few more times before giving up
        if (page > 3) {
          hasMore = false;
        }
      }
    }
    
    // Limit the number of reviews
    allReviews = allReviews.slice(0, limit);
    
    // Process reviews to standardize format
    return allReviews.map(review => ({
      id: review.id,
      userName: review.userName,
      userUrl: review.userUrl,
      version: review.version,
      score: review.score,
      title: review.title,
      text: review.text,
      url: review.url,
      date: review.date
    }));
  } catch (error) {
    console.error(`Error fetching reviews for app ${appId}:`, error);
    return [];
  }
}

module.exports = {
  fetchReviews
}; 