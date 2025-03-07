import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import ClientApiStatus from '../components/ClientApiStatus';
import Footer from '../components/Footer';

// Load Inter font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'App Review Analyzer',
  description: 'Analyze iOS app reviews to identify market gaps and opportunities',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-[#000000]">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-[#1c1c1e]/80 backdrop-blur-md border-b border-[#2c2c2e]">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-white">App Review Analyzer</span>
                </Link>
                
                {/* Navigation */}
                <nav className="flex items-center space-x-1">
                  <Link 
                    href="/" 
                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#2c2c2e] rounded-lg transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/search" 
                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#2c2c2e] rounded-lg transition-colors"
                  >
                    Search
                  </Link>
                  <Link 
                    href="/saved" 
                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#2c2c2e] rounded-lg transition-colors"
                  >
                    Saved Apps
                  </Link>
                  <Link 
                    href="/insights" 
                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#2c2c2e] rounded-lg transition-colors"
                  >
                    Insights
                  </Link>
                </nav>
                
                {/* API Status */}
                <div className="api-status-container">
                  <ClientApiStatus />
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}