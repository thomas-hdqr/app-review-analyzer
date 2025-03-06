'use client';

import { useState } from 'react';

/**
 * ReviewList component for displaying reviews
 * @param {Object} props - Component props
 * @param {Array} props.reviews - List of reviews to display
 */
export default function ReviewList({ reviews }) {
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  // Filter reviews by rating
  const filterReviews = (review) => {
    if (filterRating === 'all') return true;
    if (filterRating === 'positive') return review.score >= 4;
    if (filterRating === 'neutral') return review.score === 3;
    if (filterRating === 'negative') return review.score <= 2;
    return true;
  };

  // Search reviews
  const searchReviews = (review) => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (review.title && review.title.toLowerCase().includes(searchTermLower)) ||
      (review.text && review.text.toLowerCase().includes(searchTermLower))
    );
  };

  // Sort reviews
  const sortReviews = (a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'rating-high') {
      return b.score - a.score;
    }
    if (sortBy === 'rating-low') {
      return a.score - b.score;
    }
    return 0;
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(filterReviews)
    .filter(searchReviews)
    .sort(sortReviews);

  // Paginate reviews
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Render stars
  const renderStars = (score) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < score ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Reviews
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by keyword..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Rating
          </label>
          <select
            id="rating"
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="positive">Positive (4-5★)</option>
            <option value="neutral">Neutral (3★)</option>
            <option value="negative">Negative (1-2★)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Most Recent</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>
      
      {/* Results summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          {filteredReviews.length > 0 
            ? `Showing ${filteredReviews.length} ${filterRating !== 'all' ? filterRating : ''} reviews`
            : 'No reviews match your filters'
          }
        </p>
        
        {totalPages > 1 && (
          <div className="flex text-sm">
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
      
      {/* Reviews list */}
      {paginatedReviews.length > 0 ? (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div 
              key={review.id} 
              className={`p-4 border rounded-lg ${
                review.score >= 4 
                  ? 'bg-green-50 border-green-100' 
                  : review.score <= 2 
                  ? 'bg-red-50 border-red-100' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {review.title || 'Untitled Review'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {review.userName} • {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  {renderStars(review.score)}
                </div>
              </div>
              
              <p className="text-gray-700 whitespace-pre-line">
                {review.text || 'No review text provided.'}
              </p>
              
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className="mr-2">App version: {review.version || 'Unknown'}</span>
                {review.url && (
                  <a 
                    href={review.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View on App Store
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No reviews match your current filters.</p>
          <button 
            onClick={() => {
              setFilterRating('all');
              setSearchTerm('');
              setCurrentPage(1);
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              // Show pages around current page
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageToShow)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === pageToShow
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}