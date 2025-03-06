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
          <Link 
            href="/search" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
          >
            Start Analyzing
          </Link>
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
            <Link 
              href="/search" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
            >
              Start Your Research
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}