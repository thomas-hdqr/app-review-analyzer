'use client';

import { useState, useEffect } from 'react';

/**
 * ReviewList component for displaying app reviews
 * @param {Object} props - Component props
 * @param {Array} props.reviews - Array of review objects
 * @param {string} props.filter - Filter value from parent (all, positive, negative, neutral)
 * @param {boolean} props.loading - Whether reviews are loading
 */
export default function ReviewList({ reviews = [], filter = 'all', loading = false }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterRating, setFilterRating] = useState(filter);
  const [sortDirection, setSortDirection] = useState('desc');

  // Update filterRating when filter prop changes
  useEffect(() => {
    setFilterRating(filter);
  }, [filter]);

  // Get sentiment icon based on sentiment score
  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.7) {
      return (
        <svg className="h-5 w-5 text-[#30d158]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (sentiment <= 0.3) {
      return (
        <svg className="h-5 w-5 text-[#ff453a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-5 w-5 text-[#ff9f0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter reviews based on sentiment
  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'all') return true;
    if (filterRating === 'positive' && review.sentiment >= 0.7) return true;
    if (filterRating === 'negative' && review.sentiment <= 0.3) return true;
    if (filterRating === 'neutral' && review.sentiment > 0.3 && review.sentiment < 0.7) return true;
    return false;
  });

  // Sort reviews based on sort criteria
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'desc' 
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'rating') {
      return sortDirection === 'desc' 
        ? b.rating - a.rating
        : a.rating - b.rating;
    } else if (sortBy === 'sentiment') {
      return sortDirection === 'desc' 
        ? b.sentiment - a.sentiment
        : a.sentiment - b.sentiment;
    }
    return 0;
  });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0a84ff] border-r-transparent align-[-0.125em]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-2 text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No reviews available for this app.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#3a3a3c]">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter:</span>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => setFilterRating('all')}
              className={`px-2 py-1 text-xs rounded-md ${
                filterRating === 'all' 
                  ? 'bg-[#0a84ff] text-white' 
                  : 'bg-[#2c2c2e] text-gray-300 hover:bg-[#3a3a3c]'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterRating('positive')}
              className={`px-2 py-1 text-xs rounded-md flex items-center space-x-1 ${
                filterRating === 'positive' 
                  ? 'bg-[#30d158] text-white' 
                  : 'bg-[#2c2c2e] text-gray-300 hover:bg-[#3a3a3c]'
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Positive</span>
            </button>
            <button 
              onClick={() => setFilterRating('neutral')}
              className={`px-2 py-1 text-xs rounded-md flex items-center space-x-1 ${
                filterRating === 'neutral' 
                  ? 'bg-[#ff9f0a] text-white' 
                  : 'bg-[#2c2c2e] text-gray-300 hover:bg-[#3a3a3c]'
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Neutral</span>
            </button>
            <button 
              onClick={() => setFilterRating('negative')}
              className={`px-2 py-1 text-xs rounded-md flex items-center space-x-1 ${
                filterRating === 'negative' 
                  ? 'bg-[#ff453a] text-white' 
                  : 'bg-[#2c2c2e] text-gray-300 hover:bg-[#3a3a3c]'
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Negative</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#2c2c2e] text-gray-300 text-xs rounded-md border-none px-2 py-1 focus:ring-[#0a84ff]"
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="sentiment">Sentiment</option>
          </select>
          <button
            onClick={toggleSortDirection}
            className="bg-[#2c2c2e] text-gray-300 hover:bg-[#3a3a3c] p-1 rounded-md"
            aria-label={sortDirection === 'desc' ? 'Sort ascending' : 'Sort descending'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reviews Count */}
      <div className="text-sm text-gray-400">
        Showing {sortedReviews.length} of {reviews.length} reviews
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review, index) => (
          <div 
            key={index} 
            className="p-4 rounded-xl bg-[#1c1c1e] border border-[#2c2c2e] hover:border-[#3a3a3c] transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-2">
                {/* User Avatar */}
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#3a3a3c] flex items-center justify-center text-gray-300 text-sm font-medium">
                  {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* Review Header */}
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-white">
                      {review.userName || 'Anonymous User'}
                    </h4>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{formatDate(review.date)}</span>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'text-[#ff9f0a]' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sentiment Badge */}
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-[#2c2c2e]">
                  {getSentimentIcon(review.sentiment)}
                  <span className="text-xs text-gray-300">
                    {(review.sentiment * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Review Title */}
            {review.title && (
              <h3 className="mt-3 text-base font-medium text-white">{review.title}</h3>
            )}
            
            {/* Review Content */}
            <p className="mt-2 text-sm text-gray-300 whitespace-pre-line">
              {review.content}
            </p>
            
            {/* Version */}
            {review.version && (
              <div className="mt-3 text-xs text-gray-500">
                Version: {review.version}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}