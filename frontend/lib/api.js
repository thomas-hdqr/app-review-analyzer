const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
  try {
    console.log(`Fetching app details from: ${API_BASE_URL}/apps/${appId}`);
    const response = await fetch(`${API_BASE_URL}/apps/${appId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${response.status} ${response.statusText}`, errorText);
      
      if (response.status === 404) {
        throw new Error(`App with ID ${appId} not found`);
      }
      
      throw new Error(`Error getting app details: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in getAppDetails:', error);
    throw error;
  }
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
  try {
    console.log(`Fetching reviews for app ${appId}, force=${force}`);
    
    const params = new URLSearchParams();
    if (force) params.append('force', 'true');
    
    const response = await fetch(`${API_BASE_URL}/reviews/${appId}?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${response.status} ${response.statusText}`, errorText);
      
      if (response.status === 404) {
        throw new Error(`No reviews found for app with ID ${appId}`);
      }
      
      throw new Error(`Error getting reviews: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.count} reviews for app ${appId} (source: ${data.source})`);
    return data;
  } catch (error) {
    console.error('Error in getReviews:', error);
    throw error;
  }
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

/**
 * Analyze opportunity for building an MVP based on similar apps
 * @param {Array} appIds - List of similar app IDs to analyze
 * @param {number} category - App category ID (optional)
 * @returns {Promise<Object>} - MVP opportunity analysis
 */
export async function analyzeMVPOpportunity(appIds, category) {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/mvp-opportunity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        appIds,
        category
      })
    });
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error analyzing MVP opportunity');
      } catch (e) {
        throw new Error('Error analyzing MVP opportunity');
      }
    }
    
    const data = await response.json();
    
    // If the backend didn't return valid opportunity data, provide fallback
    if (!data.data || !data.success) {
      return {
        success: true,
        data: {
          marketGaps: [],
          mvpOpportunityScore: { score: 0, reasoning: "Analysis could not be completed due to insufficient data" },
          mvpRecommendedFeatures: { core: [], differentiators: [], potential: [] },
          aiInsights: null,
          appsAnalyzed: appIds,
          analysisDate: new Date().toISOString(),
          category: category || 'Unknown',
          dataQuality: {
            appsWithReviews: 0,
            totalApps: appIds.length,
            error: true
          }
        }
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in analyzeMVPOpportunity:', error);
    
    // Return fallback data instead of throwing error
    return {
      success: true,
      data: {
        marketGaps: [],
        mvpOpportunityScore: { score: 0, reasoning: "Analysis could not be completed. Please try with different apps that have more reviews." },
        mvpRecommendedFeatures: { core: [], differentiators: [], potential: [] },
        aiInsights: null,
        appsAnalyzed: appIds,
        analysisDate: new Date().toISOString(),
        category: category || 'Unknown',
        dataQuality: {
          appsWithReviews: 0,
          totalApps: appIds.length,
          error: true
        }
      }
    };
  }
}

/**
 * Check the health of the API server
 * @returns {Promise<Object>} - Health check result
 */
export async function checkApiHealth() {
  try {
    console.log('Checking API health at:', `${API_BASE_URL.replace(/\/api$/, '')}/api/health`);
    const response = await fetch(`${API_BASE_URL.replace(/\/api$/, '')}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      timeout: 5000 // 5 second timeout
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API health check failed with status:', response.status, errorText);
      throw new Error(`API server responded with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API health check successful:', data);
    
    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error('API health check failed:', error);
    return {
      success: false,
      status: 'error',
      message: error.message || 'Could not connect to API server',
      error: error.toString()
    };
  }
}

/**
 * Test app details endpoint with a specific ID
 * @param {string} appId - App ID to test with
 * @returns {Promise<Object>} - Test result
 */
export async function testAppDetails(appId) {
  try {
    console.log(`Testing app details endpoint with ID: ${appId}`);
    const response = await fetch(`${API_BASE_URL}/apps/test/${appId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Test failed with status: ${response.status}`, errorText);
      throw new Error(`Test failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in test endpoint:', error);
    throw error;
  }
}

/**
 * Fetch categories from the API
 * @returns {Promise<Array>} - List of categories
 */
export async function fetchCategories() {
  try {
    const response = await getCategories();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch trending apps from the API
 * @param {string} category - Category ID (optional)
 * @returns {Promise<Array>} - List of trending apps
 */
export async function fetchTrendingApps(category = 'all') {
  try {
    const options = {};
    if (category && category !== 'all') {
      options.category = category;
    }
    
    // If no category is specified, use a popular search term
    if (!options.category) {
      options.term = 'popular';
    }
    
    const response = await searchApps(options);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching trending apps:', error);
    return [];
  }
}

/**
 * Convert a bundle ID to a numeric App Store ID
 * @param {string} bundleId - Bundle ID (e.g., com.example.app)
 * @returns {Promise<string>} - Numeric App Store ID
 */
export async function convertBundleIdToAppId(bundleId) {
  try {
    console.log(`Converting bundle ID to App Store ID: ${bundleId}`);
    
    // Search for the app by bundle ID
    const searchResults = await searchApps({ term: bundleId });
    
    if (!searchResults.data || searchResults.data.length === 0) {
      throw new Error(`No app found with bundle ID: ${bundleId}`);
    }
    
    // Find the app with matching bundle ID
    const matchingApp = searchResults.data.find(app => 
      app.bundleId === bundleId || 
      app.bundleId?.toLowerCase() === bundleId.toLowerCase()
    );
    
    if (matchingApp) {
      console.log(`Found matching app for bundle ID ${bundleId}: ${matchingApp.title} (${matchingApp.appId})`);
      return matchingApp.appId;
    }
    
    // If no exact match, return the first result as a best guess
    console.log(`No exact match found for bundle ID ${bundleId}, using first result: ${searchResults.data[0].title} (${searchResults.data[0].appId})`);
    return searchResults.data[0].appId;
  } catch (error) {
    console.error(`Error converting bundle ID to App Store ID: ${bundleId}`, error);
    throw error;
  }
}