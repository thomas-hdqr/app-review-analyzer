'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * AppCard component for displaying app information
 * @param {Object} props - Component props
 * @param {Object} props.app - App data
 * @param {boolean} props.saved - Whether the app is saved (optional)
 * @param {Function} props.onSave - Callback when save button is clicked (optional)
 */
export default function AppCard({ app, saved = false, onSave }) {
  const [isSaved, setIsSaved] = useState(saved);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(app, !isSaved);
    }
  };

  // Format rating to display one decimal place if needed
  const formattedRating = app.rating ? 
    (Math.round(app.rating * 10) / 10).toFixed(1).replace(/\.0$/, '') : 
    'N/A';

  return (
    <Link 
      href={`/app/${app.appId}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-xl transition-all duration-200 ${
        isHovered ? 'bg-[#2c2c2e] scale-[1.02] shadow-lg' : 'bg-[#1c1c1e]'
      }`}>
        <div className="p-4">
          <div className="flex items-start space-x-4">
            {/* App Icon */}
            <div className="flex-shrink-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-700">
                {app.icon ? (
                  <Image
                    src={app.icon}
                    alt={`${app.title} icon`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    priority={true}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* App Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-white truncate">{app.title}</h3>
              <p className="mt-1 text-sm text-gray-400 truncate">{app.developer}</p>
              
              {/* Rating */}
              <div className="mt-1 flex items-center">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-[#ff9f0a]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-gray-300">{formattedRating}</span>
                </div>
                {app.price !== undefined && (
                  <span className="ml-2 text-sm text-gray-400">
                    {app.price === 0 ? 'Free' : `$${app.price.toFixed(2)}`}
                  </span>
                )}
              </div>
            </div>

            {/* Save Button */}
            {onSave && (
              <button
                onClick={handleSave}
                className={`flex-shrink-0 rounded-full p-1.5 transition-colors ${
                  isSaved 
                    ? 'bg-[#0a84ff]/20 text-[#0a84ff]' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                aria-label={isSaved ? "Remove from saved" : "Save app"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill={isSaved ? "currentColor" : "none"} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Categories */}
          {app.genres && app.genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {app.genres.slice(0, 3).map((genre, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[#3a3a3c] text-gray-300"
                >
                  {genre}
                </span>
              ))}
              {app.genres.length > 3 && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[#3a3a3c] text-gray-300">
                  +{app.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}