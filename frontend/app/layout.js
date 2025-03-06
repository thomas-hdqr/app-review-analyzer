import './globals.css';

export const metadata = {
  title: 'App Review Analyzer',
  description: 'Analyze iOS app reviews to find market gaps for indie hackers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex justify-between items-center">
                <a href="/" className="flex items-center space-x-2">
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                    />
                  </svg>
                  <h1 className="text-2xl font-bold text-white">App Review Analyzer</h1>
                </a>
                <nav className="hidden md:flex space-x-6">
                  <a href="/" className="text-blue-100 hover:text-white transition-colors px-1">
                    Home
                  </a>
                  <a href="/search" className="text-blue-100 hover:text-white transition-colors px-1">
                    Search Apps
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-gray-500 text-sm">
                  App Review Analyzer - Find market gaps through review analysis
                </div>
                <div className="mt-4 md:mt-0 flex space-x-4">
                  <span className="text-gray-400 text-xs">
                    Data provided by the App Store API
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}