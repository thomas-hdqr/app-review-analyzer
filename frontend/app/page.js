import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-16 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Find Market Gaps in iOS Apps
          </h1>
          <p className="text-xl mb-8">
            Analyze app reviews to discover what users love, what they hate, and where opportunities exist.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/search" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
            >
              Start Analyzing
            </Link>
            <Link 
              href="/market-gaps" 
              className="inline-block bg-blue-500 bg-opacity-30 text-white border border-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-opacity-40 transition-colors"
            >
              Explore Market Gaps
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="px-8 py-12">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Search Apps</h3>
            <p className="text-gray-600">
              Find iOS apps by name or browse by category to start your research.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Analyze Reviews</h3>
            <p className="text-gray-600">
              Scrape and analyze user reviews to understand sentiment and common themes.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Discover Gaps</h3>
            <p className="text-gray-600">
              Identify market opportunities based on user pain points and unmet needs.
            </p>
          </div>
        </div>
      </div>
      
      {/* New Feature Highlight */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-8 py-12 border-t border-b border-purple-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                NEW: MVP Opportunity Analyzer
              </h2>
              <p className="text-gray-700 mb-6">
                Find the perfect niche for your next app by comparing similar apps and identifying common pain points. Our AI-powered analysis highlights exploitable market gaps and provides a readiness score for your MVP.
              </p>
              <Link 
                href="/opportunity" 
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-purple-700 transition-colors"
              >
                Find Your MVP Opportunity →
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-gray-800">Opportunity Score</div>
                  <div className="h-16 w-16 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-2xl font-bold">8/10</div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="font-medium text-blue-800 mb-1">Core Features</div>
                    <p className="text-sm text-gray-700">Address these top 3 pain points for maximum impact</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md border border-green-100">
                    <div className="font-medium text-green-800 mb-1">AI Insights</div>
                    <p className="text-sm text-gray-700">Market analysis with OpenAI-powered recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="bg-gray-50 px-8 py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Getting Started</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Search for an App</h3>
                <p className="text-gray-600">
                  Start by searching for an iOS app by name or browse by category to find apps in your niche.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Fetch Reviews</h3>
                <p className="text-gray-600">
                  Select an app to fetch its reviews. The tool will scrape up to 200 recent reviews from the App Store.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Analyze Sentiment</h3>
                <p className="text-gray-600">
                  The tool will analyze the sentiment of reviews and identify common themes in both positive and negative feedback.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Discover Opportunities</h3>
                <p className="text-gray-600">
                  Review the analysis to identify market gaps and opportunities for your own app ideas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/search" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
              >
                Start Your Research
              </Link>
              <Link 
                href="/reports" 
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-300 transition-colors"
              >
                View Saved Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Market Gaps Section */}
      <div className="px-8 py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Find Market Gaps Across Multiple Apps</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-6 md:mb-0 md:mr-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">Compare Multiple Apps</h3>
                <p className="text-blue-700 mb-4">
                  Take your market research to the next level by analyzing common pain points across multiple apps in the same category.
                </p>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Identify trends across competitors</li>
                  <li>Find common user complaints</li>
                  <li>Discover unmet needs in the market</li>
                  <li>Prioritize features for your MVP</li>
                </ul>
              </div>
              <div className="flex-shrink-0">
                <Link 
                  href="/market-gaps" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
                >
                  Analyze Market Gaps
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}