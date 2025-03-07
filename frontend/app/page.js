'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import CategorySelector from '../components/CategorySelector';
import AppCard from '../components/AppCard';
import { fetchCategories, fetchTrendingApps } from '../lib/api';

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [trendingApps, setTrendingApps] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and trending apps on component mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Fetch trending apps
        const appsData = await fetchTrendingApps(selectedCategory);
        setTrendingApps(appsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedCategory]);

  // Handle search submission
  const handleSearch = (query) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Discover Market Gaps in iOS Apps
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Analyze app reviews to identify user pain points and market opportunities. Find what users want but aren't getting.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search for iOS apps..." 
              autoFocus={true}
            />
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="raycast-card">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0a84ff]/20 text-[#0a84ff]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-white">Search Apps</h2>
          </div>
          <p className="text-gray-400">
            Find iOS apps by name, category, or keyword. Get detailed information about each app.
          </p>
        </div>
        
        <div className="raycast-card">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#30d158]/20 text-[#30d158]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-white">Analyze Reviews</h2>
          </div>
          <p className="text-gray-400">
            Scrape and analyze user reviews to identify sentiment, common complaints, and feature requests.
          </p>
        </div>
        
        <div className="raycast-card">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ff9f0a]/20 text-[#ff9f0a]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-white">Find Opportunities</h2>
          </div>
          <p className="text-gray-400">
            Discover market gaps and opportunities based on user feedback and sentiment analysis.
          </p>
        </div>
      </section>

      {/* Trending Apps Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Trending Apps</h2>
          <div className="w-full md:w-64">
            <CategorySelector 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect}
              loading={loading}
            />
          </div>
        </div>
        
        {error ? (
          <div className="bg-[#ff453a]/10 border border-[#ff453a]/30 text-[#ff453a] p-4 rounded-xl">
            {error}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="raycast-card animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-[#2c2c2e] rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-[#2c2c2e] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#2c2c2e] rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-[#2c2c2e] rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {trendingApps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingApps.map((app) => (
                  <AppCard 
                    key={app.appId} 
                    app={app} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#2c2c2e] p-8 rounded-xl text-center">
                <p className="text-gray-400">No apps found for this category.</p>
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="mt-4 px-4 py-2 bg-[#0a84ff] text-white rounded-lg hover:bg-[#0a84ff]/90 transition-colors"
                >
                  View All Categories
                </button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link 
                href="/search" 
                className="inline-flex items-center px-4 py-2 bg-[#3a3a3c] text-white rounded-lg hover:bg-[#48484a] transition-colors"
              >
                View More Apps
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}