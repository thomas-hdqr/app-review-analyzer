import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff453a]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        
        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-[#ff453a] glow-text">Your shortcut to</span>
            <br />
            <span className="text-white">everything.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Analyze app reviews to discover what users love, what they hate, and where opportunities exist.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/search" 
              className="raycast-button-primary"
            >
              Start Analyzing
            </Link>
            <Link 
              href="/market-gaps" 
              className="raycast-button-secondary"
            >
              Explore Market Gaps
            </Link>
          </div>
          
          <div className="mt-16 relative">
            <div className="absolute -inset-4 bg-[#ff453a]/10 blur-xl rounded-3xl"></div>
            <div className="relative bg-[#111111] border border-[#2c2c2e] rounded-xl overflow-hidden shadow-2xl">
              <div className="w-full h-[400px] bg-gradient-to-br from-[#111111] to-[#1c1c1e] flex items-center justify-center">
                <div className="text-[#ff453a] text-6xl font-bold glow-text">App Review Analyzer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-[#ff453a]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#ff453a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Search Apps</h3>
            <p className="text-gray-400">
              Find iOS apps by name or browse by category to start your research.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#0a84ff]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#0a84ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Analyze Reviews</h3>
            <p className="text-gray-400">
              Scrape and analyze user reviews to understand sentiment and common themes.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#30d158]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#30d158]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Discover Gaps</h3>
            <p className="text-gray-400">
              Identify market opportunities based on user pain points and unmet needs.
            </p>
          </div>
        </div>
      </div>
      
      {/* Cards Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">Powerful Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="raycast-card-blue p-6">
            <div className="h-12 w-12 rounded-full bg-[#0a84ff]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0a84ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Sentiment Analysis</h3>
            <p className="text-gray-400 mb-4">
              Automatically categorize reviews as positive, negative, or neutral to understand user sentiment.
            </p>
            <div className="flex justify-end">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#0a84ff]"></div>
                <div className="w-2 h-2 rounded-full bg-[#0a84ff]/60"></div>
                <div className="w-2 h-2 rounded-full bg-[#0a84ff]/30"></div>
              </div>
            </div>
          </div>
          
          <div className="raycast-card-purple p-6">
            <div className="h-12 w-12 rounded-full bg-[#bf5af2]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#bf5af2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Theme Extraction</h3>
            <p className="text-gray-400 mb-4">
              Identify common themes and keywords in reviews to understand what users are talking about.
            </p>
            <div className="flex justify-end">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#bf5af2]"></div>
                <div className="w-2 h-2 rounded-full bg-[#bf5af2]/60"></div>
                <div className="w-2 h-2 rounded-full bg-[#bf5af2]/30"></div>
              </div>
            </div>
          </div>
          
          <div className="raycast-card-green p-6">
            <div className="h-12 w-12 rounded-full bg-[#30d158]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#30d158]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Gap Analysis</h3>
            <p className="text-gray-400 mb-4">
              Compare positive and negative reviews to identify opportunities and unmet user needs.
            </p>
            <div className="flex justify-end">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#30d158]"></div>
                <div className="w-2 h-2 rounded-full bg-[#30d158]/60"></div>
                <div className="w-2 h-2 rounded-full bg-[#30d158]/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff453a]/10 to-transparent rounded-3xl"></div>
        <div className="relative raycast-card p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Find Your Next Big Opportunity?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Start analyzing app reviews today and discover gaps in the market that you can fill with your next product.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/search" 
                className="raycast-button-primary"
              >
                Get Started
              </Link>
              <Link 
                href="/market-gaps" 
                className="raycast-button-secondary"
              >
                View Market Gaps
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}