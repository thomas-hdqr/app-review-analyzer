'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchApps, getCategories } from '@/lib/api';
import AppCard from '@/components/AppCard';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apps, setApps] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      }
    }

    fetchCategories();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm && !selectedCategory) {
      setError('Please enter a search term or select a category');
      return;
    }

    setIsLoading(true);
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
      setError('Error searching apps. Please try again.');
      setApps([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search iOS Apps</h1>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-100">
        <p className="text-blue-800">
          Search for iOS apps by name or category to analyze their reviews and identify market opportunities.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-3 md:col-span-1">
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              App Name
            </label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Weather, Fitness, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="col-span-3 md:col-span-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-3 md:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-blue-400"
            >
              {isLoading ? 'Searching...' : 'Search Apps'}
            </button>
          </div>
        </div>
      </form>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {searchPerformed && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {apps.length > 0 
                  ? `Found ${apps.length} apps` 
                  : 'No apps found matching your criteria'}
              </h2>
              
              {apps.length === 0 && searchPerformed && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
                  Try different search terms or select another category.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          )}
          
          {!searchPerformed && (
            <div className="text-center py-8 text-gray-500">
              <svg 
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <p className="mt-4">Search for iOS apps to start your analysis</p>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}