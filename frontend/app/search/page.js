'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppCard from '../../components/AppCard';
import ServerStatus from '../../components/ServerStatus';
import { searchApps, getCategories, checkApiHealth } from '../../lib/api';

export default function SearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [apiStatus, setApiStatus] = useState({ checked: false, healthy: true });

  // Check API health and fetch categories on component mount
  useEffect(() => {
    async function initializeData() {
      // First check API health
      try {
        const healthCheck = await checkApiHealth();
        setApiStatus({ checked: true, healthy: healthCheck.success });
        
        if (!healthCheck.success) {
          setError(`API server connection error: ${healthCheck.error}. Please check your backend server.`);
          // Set fallback categories
          setFallbackCategories();
          return;
        }
      } catch (err) {
        console.error('Error checking API health:', err);
        setApiStatus({ checked: true, healthy: false });
        setError('Could not connect to the API server. Please check your backend server.');
        // Set fallback categories
        setFallbackCategories();
        return;
      }
      
      // If API is healthy, fetch categories
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
        // Set fallback categories
        setFallbackCategories();
      }
    }
    
    function setFallbackCategories() {
      // Fallback categories in case the API call fails
      setCategories([
        { id: 6002, name: 'Weather' },
        { id: 6007, name: 'Productivity' },
        { id: 6008, name: 'Photo & Video' },
        { id: 6017, name: 'Health & Fitness' },
        { id: 6015, name: 'Finance' },
        { id: 6005, name: 'Social Networking' },
        { id: 6016, name: 'Travel' },
        { id: 6023, name: 'Food & Drink' },
        { id: 6013, name: 'Sports' },
        { id: 6012, name: 'Lifestyle' }
      ]);
    }

    initializeData();
  }, []);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm && !selectedCategory) {
      setError('Please enter a search term or select a category');
      return;
    }
    
    // Check if API is healthy before searching
    if (!apiStatus.healthy) {
      setError('Cannot search: API server is not available. Please check your backend server.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const options = {};
      if (searchTerm) options.term = searchTerm;
      if (selectedCategory) options.category = selectedCategory;
      
      const response = await searchApps(options);
      setApps(response.data || []);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Error searching apps:', err);
      setError('Failed to search apps. Please try again later.');
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle app selection
  const handleAppSelect = (appId) => {
    router.push(`/app/${appId}`);
  };

  return (
    <div className="space-y-6">
      {/* Server Status Check */}
      {!apiStatus.healthy && <ServerStatus />}
      
      <div className="raycast-card p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-white">Search iOS Apps</h1>
            <p className="text-gray-400">Find apps to analyze their reviews and discover market opportunities</p>
          </div>
          
          {apiStatus.checked && !apiStatus.healthy && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900/30 text-red-400 border border-red-800/50">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              API Offline
            </div>
          )}
        </div>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-400 mb-1">
                App Name
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by app name..."
                className="raycast-input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="raycast-select w-full"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {error && (
            <div className="text-[#ff453a] text-sm bg-[#ff453a]/10 p-3 rounded-lg border border-[#ff453a]/30">
              {error}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="raycast-button-primary"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : 'Search'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Search Results */}
      {searchPerformed && (
        <div className="raycast-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {loading ? 'Searching...' : `Search Results (${apps.length})`}
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff453a]"></div>
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-8 bg-[#1c1c1e] rounded-lg border border-[#2c2c2e]">
              <p className="text-gray-400">No apps found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {apps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onSelect={handleAppSelect}
                  showDetails={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}