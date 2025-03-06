const appStore = require('app-store-scraper');

/**
 * Search for apps in the App Store
 * @param {Object} options - Search options
 * @param {string} options.term - Search term (optional)
 * @param {number} options.category - App Store category ID (optional)
 * @param {string} options.id - Specific app ID (optional)
 * @returns {Promise<Array>} - List of matching apps
 */
async function searchApps(options) {
  try {
    let results = [];
    
    // If specific app ID is provided
    if (options.id) {
      const app = await appStore.app({ id: options.id, country: 'us' });
      return [app];
    }
    
    // Otherwise search by term or category
    results = await appStore.search({
      term: options.term || '',
      num: 25,
      country: 'us',
      lang: 'en',
      ...(options.category && { category: options.category })
    });
    
    // Filter out apps with low ratings or few ratings
    return results
      .filter(app => app.score >= 3.5 && app.reviews >= 50)
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error searching apps:', error);
    return [];
  }
}

/**
 * Get details for a specific app
 * @param {string} appId - App Store ID
 * @returns {Promise<Object>} - App details
 */
async function getAppDetails(appId) {
  try {
    return await appStore.app({ id: appId, country: 'us' });
  } catch (error) {
    console.error(`Error getting details for app ${appId}:`, error);
    return null;
  }
}

/**
 * Get similar apps based on an app ID
 * @param {string} appId - App Store ID
 * @returns {Promise<Array>} - List of similar apps
 */
async function getSimilarApps(appId) {
  try {
    return await appStore.similar({ id: appId, country: 'us' });
  } catch (error) {
    console.error(`Error getting similar apps for ${appId}:`, error);
    return [];
  }
}

module.exports = {
  searchApps,
  getAppDetails,
  getSimilarApps
}; 