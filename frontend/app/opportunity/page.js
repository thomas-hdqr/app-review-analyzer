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
          if (validApps.length >= 1) {
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
    
    if (ids.length < 1) {
      setError('Please select at least one app to analyze');
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with a modern gradient background */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Discover Your Next Big <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400">Opportunity</span>
            </h1>
            
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              Analyze the market with AI to find gaps worth exploiting for your MVP.
              Get actionable insights and opportunity scores to guide your product decisions.
            </p>
            
            <div className="inline-block animate-bounce bg-white bg-opacity-20 p-2 rounded-full">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Market Opportunity Analyzer
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto">
            Select apps to analyze their reviews and identify market gaps. Our AI will find patterns across apps, score opportunities, and suggest features for your MVP.
          </p>
        </div>
      
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Find Apps to Analyze
          </h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-2">
                  App Name or Keyword
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="searchTerm"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 border-gray-200 rounded-lg"
                    placeholder="Enter app name or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:col-span-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  App Category
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <select
                    id="category"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 border-gray-200 rounded-lg appearance-none"
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search
                </label>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : 'Search'}
                </button>
              </div>
            </div>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start">
              <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Selected Apps */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              Selected Apps 
              <span className="ml-2 bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm">
                {selectedApps.length}/5
              </span>
            </h2>
            <p className="text-base text-gray-600 mt-2">
              {selectedApps.length === 0 
                ? 'Select 2-5 similar apps to analyze and find market opportunities' 
                : selectedApps.length === 1
                ? 'Select at least one more app to compare and analyze'
                : `${selectedApps.length} apps selected. ${5 - selectedApps.length} more can be added.`}
            </p>
          </div>
          
          <div className="flex space-x-3">
            {selectedApps.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Clear All
              </button>
            )}
            
            <button
              onClick={() => analyzeOpportunity()}
              className={`px-5 py-2 text-sm font-medium rounded-lg shadow-sm transition-all ${
                selectedApps.length >= 1  // <-- Changed from 2 to 1 to allow single app analysis
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={isAnalyzing || selectedApps.length < 1} // <-- Changed from 2 to 1
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing with AI...
                </span>
              ) : 'Analyze Opportunity'}
            </button>
          </div>
        </div>
        
        {selectedApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {selectedApps.map(app => (
              <div 
                key={app.trackId} 
                className="relative rounded-xl shadow-md transition-all hover:shadow-lg overflow-hidden"
                onClick={(e) => {
                  // Only handle click if not clicking on a link
                  if (!e.target.closest('a')) {
                    handleSelectApp(app);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/30 to-indigo-300/5 opacity-70 rounded-xl z-0"></div>
                <div
                  className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 text-red-500 rounded-full flex items-center justify-center shadow-sm z-20 transition-transform hover:scale-110"
                  aria-label="Remove app"
                  title="Remove from selection"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-white bg-opacity-90 rounded-md text-xs text-indigo-700 font-medium z-10">
                  Selected
                </div>
                <AppCard app={app} showDetails={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-10 bg-indigo-50/50 text-center">
            <div className="text-indigo-900/60 flex flex-col items-center">
              <svg className="w-16 h-16 text-indigo-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              <span className="text-lg">Select apps from the search results below to begin analysis</span>
              <span className="mt-2 text-sm max-w-md">Choose apps in the same category for best results. Single-app analysis will find opportunities within that app, while multiple apps will reveal market-wide gaps.</span>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                Search Results
                <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {searchResults.length}
                </span>
              </h2>
              
              {selectedApps.length < 5 && (
                <p className="text-base text-gray-600 mt-2">
                  Click on any app card to add it to your selection
                </p>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Category: </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {searchCategory ? categories.find(c => c.id === parseInt(searchCategory))?.name || 'Custom' : 'All Categories'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(app => {
              const isSelected = selectedApps.some(selectedApp => selectedApp.trackId === app.trackId);
              const maxReached = selectedApps.length >= 5 && !isSelected;
              
              return (
                <div 
                  key={app.trackId} 
                  className={`relative rounded-xl shadow-sm transition-all hover:shadow-md overflow-hidden ${
                    isSelected ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-300'
                  }`}
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
                  {!maxReached && !isSelected && (
                    <div className="absolute inset-0 bg-indigo-500 opacity-0 hover:opacity-10 transition-opacity rounded-xl z-10"></div>
                  )}
                  
                  {!maxReached && (
                    <div
                      className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center shadow-sm z-20 transition-transform hover:scale-110 rounded-full ${
                        isSelected
                          ? 'bg-green-100 text-green-600 border border-green-200'
                          : 'bg-white/90 text-indigo-600'
                      }`}
                      aria-label={isSelected ? 'Selected' : 'Add to selection'}
                      title={isSelected ? 'Remove from selection' : 'Add to selection'}
                    >
                      {isSelected ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-indigo-500 rounded-xl z-5"></div>
                  )}
                  
                  <div className={maxReached ? 'opacity-50 pointer-events-none' : ''}>
                    <AppCard app={app} showDetails={false} />
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium z-10">
                      Selected
                    </div>
                  )}
                  
                  {maxReached && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 backdrop-blur-[1px] rounded-xl z-30">
                      <div className="bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-800 shadow-md">
                        Max 5 apps selected
                      </div>
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