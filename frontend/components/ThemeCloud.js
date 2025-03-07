'use client';

/**
 * ThemeCloud component for displaying themes as a tag cloud
 * @param {Object} props - Component props
 * @param {Array} props.themes - Array of theme objects with word and count
 * @param {string} props.type - Type of themes (positive or negative)
 */
export default function ThemeCloud({ themes, type = 'positive' }) {
  if (!themes || themes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {type === 'positive' ? 'Positive Themes' : 'Negative Themes'}
        </h3>
        <div className="text-center py-8 text-gray-500">
          No {type} themes identified
        </div>
      </div>
    );
  }

  // Find the maximum and minimum counts
  const maxCount = Math.max(...themes.map(theme => theme.count));
  const minCount = Math.min(...themes.map(theme => theme.count));
  
  // Calculate font size based on count
  const calculateFontSize = (count) => {
    // Scale between 0.75rem and 1.5rem
    const minSize = 0.75;
    const maxSize = 1.5;
    const scale = (count - minCount) / (maxCount - minCount || 1);
    return minSize + scale * (maxSize - minSize);
  };
  
  // Calculate opacity based on count
  const calculateOpacity = (count) => {
    // Scale between 0.7 and 1.0
    const minOpacity = 0.7;
    const maxOpacity = 1.0;
    const scale = (count - minCount) / (maxCount - minCount || 1);
    return minOpacity + scale * (maxOpacity - minOpacity);
  };

  // Set color scheme based on type
  const colors = {
    positive: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      count: 'text-green-600',
      title: 'Positive Themes'
    },
    negative: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      count: 'text-red-600',
      title: 'Negative Themes'
    },
    opportunity: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      count: 'text-purple-600',
      title: 'Market Opportunities'
    },
    mvp: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      count: 'text-amber-600',
      title: 'Recommended MVP Features'
    },
    gap: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      count: 'text-blue-600',
      title: 'Market Gaps'
    }
  };
  
  const { bg, text, count: countColor, title } = colors[type] || colors.positive;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {themes.map((theme, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-3 py-1 rounded-full ${bg} ${text}`}
            style={{
              fontSize: `${calculateFontSize(theme.count)}rem`,
              opacity: calculateOpacity(theme.count)
            }}
          >
            {theme.word}
            <span className={`ml-1 text-xs ${countColor}`}>
              {theme.count}
            </span>
          </span>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          {type === 'positive' 
            ? 'These are the most mentioned positive aspects in user reviews.' 
            : type === 'negative'
            ? 'These are the most common complaints or issues mentioned in user reviews.'
            : type === 'opportunity'
            ? 'These are potential market opportunities based on app review analysis.'
            : type === 'mvp'
            ? 'These are recommended features for an MVP based on market analysis.'
            : type === 'gap'
            ? 'These are market gaps identified across multiple similar apps.'
            : 'Themes identified from review analysis.'}
        </p>
      </div>
    </div>
  );
}