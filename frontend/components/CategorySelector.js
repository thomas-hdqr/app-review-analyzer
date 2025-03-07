'use client';

import { useState, useEffect } from 'react';

/**
 * CategorySelector component for selecting app categories
 * @param {Object} props - Component props
 * @param {Array} props.categories - Array of category objects
 * @param {string} props.selectedCategory - Currently selected category ID
 * @param {Function} props.onSelectCategory - Callback when category is selected
 * @param {boolean} props.loading - Whether categories are loading
 */
export default function CategorySelector({ 
  categories = [], 
  selectedCategory = 'all', 
  onSelectCategory,
  loading = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  // Update filtered categories when categories or search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categories, searchTerm]);

  // Get the name of the selected category
  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') return 'All Categories';
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.name : 'All Categories';
  };

  // Handle category selection
  const handleSelectCategory = (categoryId) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        type="button"
        className={`flex items-center justify-between w-full px-4 py-2.5 text-left rounded-xl transition-colors ${
          isOpen 
            ? 'bg-[#2c2c2e] ring-2 ring-[#0a84ff]' 
            : 'bg-[#1c1c1e] hover:bg-[#2c2c2e]'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate text-white">
          {loading ? 'Loading categories...' : getSelectedCategoryName()}
        </span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#1c1c1e] border border-[#3a3a3c] rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="sticky top-0 p-2 bg-[#1c1c1e] border-b border-[#3a3a3c]">
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#2c2c2e] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a84ff]"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Categories List */}
          <div className="max-h-48 overflow-y-auto">
            {/* All Categories Option */}
            <button
              type="button"
              className={`w-full px-4 py-2 text-left hover:bg-[#2c2c2e] ${
                selectedCategory === 'all' ? 'bg-[#0a84ff]/20 text-[#0a84ff]' : 'text-white'
              }`}
              onClick={() => handleSelectCategory('all')}
            >
              All Categories
            </button>
            
            {/* Category Options */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  className={`w-full px-4 py-2 text-left hover:bg-[#2c2c2e] ${
                    selectedCategory === category.id ? 'bg-[#0a84ff]/20 text-[#0a84ff]' : 'text-white'
                  }`}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  {category.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">
                No categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 