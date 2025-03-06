'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * AppCard component for displaying app information
 * @param {Object} props - Component props
 * @param {Object} props.app - App data
 * @param {Function} props.onSelect - Selection callback (optional)
 * @param {boolean} props.isSelected - Whether the app is selected (optional)
 * @param {boolean} props.showDetails - Whether to show details button (optional)
 */
export default function AppCard({ app, onSelect, isSelected = false, showDetails = true }) {
  const [imageError, setImageError] = useState(false);
  
  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Format rating stars
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {halfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className="ml-1 text-gray-600 text-sm">
          ({app.score.toFixed(1)})
        </span>
      </div>
    );
  };
  
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* App Icon */}
          <div className="flex-shrink-0">
            {!imageError ? (
              <Image
                src={app.icon}
                alt={`${app.title} icon`}
                width={64}
                height={64}
                className="rounded-xl"
                onError={handleImageError}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
          
          {/* App Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{app.title}</h3>
            <p className="text-sm text-gray-600 truncate">{app.developer}</p>
            {renderStars(app.score)}
            <p className="text-xs text-gray-500 mt-1">
              {app.reviews.toLocaleString()} reviews
            </p>
          </div>
          
          {/* Selection Checkbox (if onSelect provided) */}
          {onSelect && (
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(app.id)}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        
        {/* App Description (truncated) */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {app.description || 'No description available.'}
        </p>
        
        {/* Action Buttons */}
        <div className="mt-4 flex justify-between items-center">
          {showDetails && (
            <Link
              href={`/app/${app.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Details
            </Link>
          )}
          
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            View in App Store →
          </a>
        </div>
      </div>
    </div>
  );
}