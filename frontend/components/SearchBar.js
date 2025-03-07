'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * SearchBar component for searching apps
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback when search is submitted
 * @param {string} props.initialValue - Initial search value (optional)
 * @param {string} props.placeholder - Placeholder text (optional)
 * @param {boolean} props.autoFocus - Whether to autofocus the input (optional)
 */
export default function SearchBar({ 
  onSearch, 
  initialValue = '', 
  placeholder = 'Search for apps...', 
  autoFocus = false 
}) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  // Clear search input
  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused 
          ? 'bg-[#2c2c2e] ring-2 ring-[#0a84ff]' 
          : 'bg-[#1c1c1e] hover:bg-[#2c2c2e]'
      } rounded-xl overflow-hidden`}>
        <div className="flex-shrink-0 pl-4">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3 px-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 pr-3"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          className={`flex-shrink-0 h-full px-4 py-3 font-medium transition-colors ${
            query.trim() 
              ? 'bg-[#0a84ff] text-white hover:bg-[#0a84ff]/90' 
              : 'bg-[#3a3a3c] text-gray-400 cursor-not-allowed'
          }`}
          disabled={!query.trim()}
        >
          Search
        </button>
      </div>
      
      {/* Keyboard shortcut hint */}
      <div className="mt-1 text-xs text-gray-500 flex justify-end">
        Press <kbd className="mx-1 px-1.5 py-0.5 bg-[#2c2c2e] rounded text-gray-400 font-mono">Enter</kbd> to search
      </div>
    </form>
  );
} 