const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

/**
 * Search for apps by term or category
 * @param {Object} options - Search options
 * @param {string} options.term - Search term (optional)
 * @param {number} options.category - App Store category ID (optional)
 * @returns {Promise<Object>} - Search results
 */
export async function searchApps(options) {
  const params = new URLSearchParams();
  if (options.term) params.append('term', options.term);
  if (options.category) params.append('category', options.category);
  
  const response = await fetch(`${API_BASE_URL}/apps/search?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Error searching apps');
  }
  
  return response.json();
}

/**
 * Get app details by ID
 * @param {string} appId - App Store ID
 * @returns {Promise<Object>} - App details
 */
export async function getAppDetails(appId) {
  const response = await fetch(`${API_BASE_URL}/apps/${appId}`);
  
  if (!response.ok) {
    throw new Error('Error getting app details');
  }
  
  return response.json();
}

/**
 * Get similar apps based on an app ID
 * @param {string} appId - App Store ID
 * @returns {Promise<Object>} - Similar apps
 */
export async function getSimilarApps(appId) {
  const response = await fetch(`${API_BASE_URL}/apps/${appId}/similar`);
  
  if (!response.ok) {
    throw new Error('Error getting similar apps');
  }
  
  return response.json();
}

/**
 * Get app categories
 * @returns {Promise<Object>} - App categories
 */
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/apps/categories/list`);
  
  if (!response.ok) {
    throw new Error('Error getting categories');
  }
  
  return response.json();
}

/**
 * Get reviews for an app
 * @param {string} appId - App Store ID
 * @param {boolean} force - Force refresh from App Store (optional)
 * @returns {Promise<Object>} - Reviews
 */
export async function getReviews(appId, force = false) {
  const params = new URLSearchParams();
  if (force) params.append('force', 'true');
  
  const response = await fetch(`${API_BASE_URL}/reviews/${appId}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Error getting reviews');
  }
  
  return response.json();
}

/**
 * Get cached reviews list
 * @returns {Promise<Object>} - Cached reviews list
 */
export async function getCachedReviews() {
  const response = await fetch(`${API_BASE_URL}/reviews/cached/list`);
  
  if (!response.ok) {
    throw new Error('Error getting cached reviews');
  }
  
  return response.json();
}

/**
 * Delete cached reviews for an app
 * @param {string} appId - App Store ID
 * @returns {Promise<Object>} - Result
 */
export async function deleteCachedReviews(appId) {
  const response = await fetch(`${API_BASE_URL}/reviews/${appId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Error deleting cached reviews');
  }
  
  return response.json();
}

/**
 * Analyze reviews for an app
 * @param {string} appId - App Store ID
 * @param {boolean} force - Force reanalysis (optional)
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeReviews(appId, force = false) {
  const params = new URLSearchParams();
  if (force) params.append('force', 'true');
  
  const response = await fetch(`${API_BASE_URL}/analysis/${appId}?${params.toString()}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Error analyzing reviews');
  }
  
  return response.json();
}

/**
 * Get analysis for an app
 * @param {string} appId - App Store ID
 * @returns {Promise<Object>} - Analysis results
 */
export async function getAnalysis(appId) {
  const response = await fetch(`${API_BASE_URL}/analysis/${appId}`);
  
  if (!response.ok) {
    throw new Error('Error getting analysis');
  }
  
  return response.json();
}

/**
 * Get cached analysis list
 * @returns {Promise<Object>} - Cached analysis list
 */
export async function getCachedAnalysis() {
  const response = await fetch(`${API_BASE_URL}/analysis/cached/list`);
  
  if (!response.ok) {
    throw new Error('Error getting cached analysis');
  }
  
  return response.json();
}

/**
 * Compare analysis of multiple apps
 * @param {Array} appIds - List of app IDs to compare
 * @returns {Promise<Object>} - Comparison results
 */
export async function compareAnalysis(appIds) {
  const response = await fetch(`${API_BASE_URL}/analysis/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ appIds })
  });
  
  if (!response.ok) {
    throw new Error('Error comparing analysis');
  }
  
  return response.json();
}

/**
 * Identify market gaps based on app analysis
 * @param {Array} appIds - List of app IDs to analyze
 * @returns {Promise<Object>} - Market gap analysis
 */
export async function identifyMarketGaps(appIds) {
  const response = await fetch(`${API_BASE_URL}/analysis/market-gaps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ appIds })
  });
  
  if (!response.ok) {
    throw new Error('Error identifying market gaps');
  }
  
  return response.json();
}