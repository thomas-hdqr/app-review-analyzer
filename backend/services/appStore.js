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
 * @param {string} appId - App Store ID or bundle ID
 * @returns {Promise<Object>} - App details
 */
async function getAppDetails(appId) {
  try {
    console.log(`Fetching app details for ID: ${appId}`);
    
    // Check if the appId is a bundle ID (contains dots) or a numeric ID
    const isNumericId = /^\d+$/.test(appId);
    
    // If it's a bundle ID, we need to search for it first
    if (!isNumericId) {
      console.log(`Detected bundle ID: ${appId}, searching for numeric ID first`);
      try {
        // Try different search strategies
        
        // 1. First try: Search using the exact bundle ID as the term
        console.log(`Strategy 1: Searching with exact bundle ID: ${appId}`);
        let searchResults = await appStore.search({
          term: appId,
          num: 20,
          country: 'us'
        });
        
        // Find the app with matching bundle ID
        let matchingApp = searchResults.find(app => 
          app.bundleId === appId || 
          app.bundleId?.toLowerCase() === appId.toLowerCase()
        );
        
        // 2. Second try: If no match, try searching with parts of the bundle ID
        if (!matchingApp && appId.includes('.')) {
          const bundleParts = appId.split('.');
          const searchTerm = bundleParts[bundleParts.length - 1]; // Use the last part
          
          console.log(`Strategy 2: Searching with part of bundle ID: ${searchTerm}`);
          searchResults = await appStore.search({
            term: searchTerm,
            num: 50,
            country: 'us'
          });
          
          // Look for partial matches in bundle ID
          matchingApp = searchResults.find(app => 
            app.bundleId === appId || 
            app.bundleId?.toLowerCase() === appId.toLowerCase() ||
            (app.bundleId && appId.includes(app.bundleId))
          );
        }
        
        // 3. Third try: If still no match, try a more general search
        if (!matchingApp && appId.includes('.')) {
          const appName = appId.split('.').pop().replace(/-/g, ' ');
          
          console.log(`Strategy 3: Searching with app name derived from bundle ID: ${appName}`);
          searchResults = await appStore.search({
            term: appName,
            num: 50,
            country: 'us'
          });
          
          // Just take the first result as a best guess
          matchingApp = searchResults[0];
        }
        
        if (matchingApp) {
          console.log(`Found matching app for bundle ID ${appId}: ${matchingApp.title} (${matchingApp.id})`);
          return matchingApp;
        } else {
          console.log(`No matching app found for bundle ID: ${appId}`);
          throw new Error(`No app found with bundle ID: ${appId}`);
        }
      } catch (searchError) {
        console.error(`Error searching for app with bundle ID ${appId}:`, searchError);
        throw new Error(`Failed to find app with bundle ID: ${appId}`);
      }
    }
    
    // For numeric IDs, use the standard app lookup
    const searchOptions = { id: appId, country: 'us' };
    const app = await appStore.app(searchOptions);
    console.log(`Successfully fetched app details for: ${app.title}`);
    return app;
  } catch (error) {
    console.error(`Error getting details for app ${appId}:`, error);
    // Throw the error instead of returning null to provide better error handling
    throw error;
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