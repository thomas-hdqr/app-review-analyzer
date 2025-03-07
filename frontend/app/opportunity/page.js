'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as api from '../../lib/api';
import MVPOpportunityCard from '../../components/MVPOpportunityCard';
import AppCard from '../../components/AppCard';

/**
 * Page for analyzing MVP opportunities based on similar apps
 */
export default function OpportunityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [opportunityData, setOpportunityData] = useState(null);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Load app IDs from URL if any
  useEffect(() => {
    const appIds = searchParams.get('apps')?.split(',') || [];
    
    if (appIds.length > 0) {
      // Fetch details for these apps
      Promise.all(appIds.map(id => api.getAppDetails(id)))
        .then(responses => {
          const validApps = responses
            .filter(response => response.success)
            .map(response => {
              // Make sure we have trackId consistently set
              const appData = response.data;
              if (!appData.trackId && appData.id) {
                appData.trackId = appData.id;
              }
              return appData;
            });
          
          setSelectedApps(validApps);
          
          // Auto-analyze if we have apps
          if (validApps.length >= 2) {
            analyzeOpportunity(validApps.map(app => app.trackId || app.id));
          }
        })
        .catch(error => {
          console.error('Error fetching app details:', error);
        });
    }
  }, [searchParams]);
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm && !searchCategory) {
      setError('Please enter a search term or select a category');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await api.searchApps({
        term: searchTerm,
        category: searchCategory
      });
      
      if (response.success) {
        // Normalize app data to ensure consistent trackId property
        const normalizedResults = response.data.map(app => {
          if (!app.trackId && app.id) {
            app.trackId = app.id;
          }
          return app;
        });
        setSearchResults(normalizedResults);
      } else {
        setError('Error searching for apps');
      }
    } catch (error) {
      console.error('Error searching for apps:', error);
      setError('Error searching for apps');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle selecting an app
  const handleSelectApp = (app) => {
    if (selectedApps.some(selectedApp => selectedApp.trackId === app.trackId)) {
      // App already selected, remove it
      setSelectedApps(selectedApps.filter(selectedApp => selectedApp.trackId !== app.trackId));
    } else {
      // Add app to selection (up to 5 max)
      if (selectedApps.length < 5) {
        setSelectedApps([...selectedApps, app]);
      } else {
        setError('You can only select up to 5 apps for comparison');
      }
    }
  };
  
  // Clear all selected apps
  const handleClearSelection = () => {
    setSelectedApps([]);
    setOpportunityData(null);
  };
  
  // Analyze selected apps for opportunities
  const analyzeOpportunity = async (appIds = null) => {
    // Use provided app IDs or get from selected apps
    const ids = appIds || selectedApps.map(app => app.trackId);
    
    if (ids.length < 2) {
      setError('Please select at least 2 apps to compare');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setOpportunityData(null); // Clear any previous results
    
    try {
      // Create a collection of available reviews
      const reviewsCollection = {};
      let anyReviewsFound = false;
      
      // First pass: fetch reviews for each app and store info
      for (const id of ids) {
        try {
          const reviewsResponse = await api.getReviews(id);
          
          // Store the review count
          reviewsCollection[id] = {
            count: reviewsResponse.success ? reviewsResponse.data?.length || 0 : 0,
            hasReviews: reviewsResponse.success && reviewsResponse.data && reviewsResponse.data.length > 0
          };
          
          if (reviewsCollection[id].hasReviews) {
            anyReviewsFound = true;
          }
        } catch (e) {
          console.error(`Error fetching reviews for app ${id}:`, e);
          reviewsCollection[id] = { count: 0, hasReviews: false };
        }
      }
      
      // Analyze reviews for each app (one by one)
      for (const id of ids) {
        try {
          if (reviewsCollection[id].hasReviews) {
            await api.analyzeReviews(id);
          } else {
            console.warn(`Skipping analysis for app ${id} - no reviews found`);
          }
        } catch (e) {
          console.error(`Error analyzing reviews for app ${id}:`, e);
        }
      }
      
      // Generate a detailed status message
      const appsWithReviews = ids.filter(id => reviewsCollection[id].hasReviews).length;
      
      // Now perform the opportunity analysis
      const category = selectedApps[0]?.primaryGenreId;
      const response = await api.analyzeMVPOpportunity(ids, category);
      
      // Force the data quality to reflect our actual findings
      if (response.data) {
        // Inject the actual review data we found
        response.data.dataQuality = {
          appsWithReviews,
          totalApps: ids.length,
          reviewCollection: reviewsCollection,
          error: !anyReviewsFound
        };
        
        // Save the modified response
        setOpportunityData(response.data);
        
        // Show messages based on our findings, not the server's
        if (!anyReviewsFound) {
          console.warn("Analysis completed but no reviews found for any app");
          setError(
            'No reviews were found for any of your selected apps. Try searching for more popular apps.'
          );
        } else if (appsWithReviews < ids.length) {
          // Some apps have reviews but not all
          setError(
            `Only ${appsWithReviews} of ${ids.length} selected apps have reviews. Results may be limited.`
          );
        }
      } else {
        // Fallback data if response is incomplete
        setOpportunityData({
          marketGaps: [],
          mvpOpportunityScore: { score: 0, reasoning: "Analysis could not be completed" },
          mvpRecommendedFeatures: { core: [], differentiators: [], potential: [] },
          aiInsights: null,
          appsAnalyzed: ids,
          analysisDate: new Date().toISOString(),
          category: category || 'Unknown',
          dataQuality: {
            appsWithReviews,
            totalApps: ids.length,
            reviewCollection: reviewsCollection,
            error: !anyReviewsFound
          }
        });
      }
    } catch (error) {
      console.error('Error analyzing opportunities:', error);
      setError(
        'Error analyzing market opportunities. The server may be experiencing issues or the selected apps may not have enough reviews for analysis.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Update URL with selected app IDs
  useEffect(() => {
    if (selectedApps.length > 0) {
      const appIds = selectedApps.map(app => app.trackId).join(',');
      router.push(`/opportunity?apps=${appIds}`, { scroll: false });
    } else {
      router.push('/opportunity', { scroll: false });
    }
  }, [selectedApps, router]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        MVP Opportunity Analyzer
      </h1>
      
      <p className="text-gray-600 mb-8">
        Find market opportunities by analyzing similar apps. Select 4-5 apps in the same category to identify common pain points and market gaps to exploit in your MVP.
      </p>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Find Similar Apps
        </h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                App Name or Keyword
              </label>
              <input
                type="text"
                id="searchTerm"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Selected Apps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Selected Apps ({selectedApps.length}/5)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedApps.length === 0 
                ? 'Select 2-5 similar apps to analyze for MVP opportunities' 
                : selectedApps.length === 1
                ? 'Select at least one more app to compare'
                : `${selectedApps.length} apps selected. ${5 - selectedApps.length} more can be added.`}
            </p>
          </div>
          
          <div className="flex space-x-3">
            {selectedApps.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Clear All
              </button>
            )}
            
            <button
              onClick={() => analyzeOpportunity()}
              className={`px-4 py-1 text-sm ${
                selectedApps.length >= 2 
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-300 text-white cursor-not-allowed'
              } font-medium rounded-md focus:outline-none focus:ring-2`}
              disabled={isAnalyzing || selectedApps.length < 2}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Opportunity'}
            </button>
          </div>
        </div>
        
        {selectedApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {selectedApps.map(app => (
              <div 
                key={app.trackId} 
                className="relative border-2 border-green-500 rounded-lg"
                onClick={(e) => {
                  // Only handle click if not clicking on a link
                  if (!e.target.closest('a')) {
                    handleSelectApp(app);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm z-10"
                  aria-label="Remove app"
                  title="Remove from selection"
                >
                  &times;
                </div>
                <AppCard app={app} showDetails={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 text-center">
            <div className="text-gray-500">
              Select apps from the search results below to begin
            </div>
          </div>
        )}
      </div>
      
      {/* Opportunity Analysis Results */}
      {opportunityData && (
        <div className="mb-8">
          <MVPOpportunityCard opportunityData={opportunityData} />
        </div>
      )}
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Search Results ({searchResults.length})
            </h2>
            
            {selectedApps.length < 5 && (
              <p className="text-sm text-gray-600">
                Click + to add an app to your selection
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.map(app => {
              const isSelected = selectedApps.some(selectedApp => selectedApp.trackId === app.trackId);
              const maxReached = selectedApps.length >= 5 && !isSelected;
              
              return (
                <div 
                  key={app.trackId} 
                  className={`relative ${isSelected ? 'ring-2 ring-green-500 rounded-lg' : ''}`}
                  onClick={(e) => {
                    if (!maxReached) {
                      // Only select if not clicking on a link
                      if (!e.target.closest('a')) {
                        handleSelectApp(app);
                      }
                    }
                  }}
                  style={{ cursor: maxReached ? 'not-allowed' : 'pointer' }}
                >
                  {!maxReached && (
                    <div
                      className={`absolute top-2 right-2 w-8 h-8 ${
                        isSelected
                          ? 'bg-green-500 hover:bg-red-500'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white rounded-full flex items-center justify-center shadow-md z-10`}
                      aria-label={isSelected ? 'Remove app' : 'Add app'}
                      title={isSelected ? 'Remove from selection' : 'Add to selection'}
                    >
                      {isSelected ? '✓' : '+'}
                    </div>
                  )}
                  <div className={maxReached ? 'opacity-50 pointer-events-none' : ''}>
                    {/* Use showDetails=false to prevent clicking on view details */}
                    <AppCard app={app} showDetails={false} />
                  </div>
                  {maxReached && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                      <span className="bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-800">
                        Max 5 apps selected
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}