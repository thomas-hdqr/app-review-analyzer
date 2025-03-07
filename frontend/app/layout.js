'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ApiStatus from '../components/ApiStatus';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Function to determine if a nav link is active
  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <html lang="en">
      <head>
        <title>App Review Analyzer</title>
        <meta name="description" content="Find market gaps by analyzing iOS app reviews" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-black">
          <header className="border-b border-[#2c2c2e]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold text-white">
                      <span className="text-[#ff453a] glow-text">App</span>Review Analyzer
                    </Link>
                  </div>
                  <nav className="ml-6 flex space-x-8">
                    <Link
                      href="/"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/') 
                          ? 'border-[#ff453a] text-white' 
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/search"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/search') 
                          ? 'border-[#ff453a] text-white' 
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                      }`}
                    >
                      Search
                    </Link>
                    <Link
                      href="/reports"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/reports') 
                          ? 'border-[#ff453a] text-white' 
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                      }`}
                    >
                      Reports
                    </Link>
                    <Link
                      href="/market-gaps"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/market-gaps') || isActive('/opportunity')
                          ? 'border-[#ff453a] text-white' 
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                      }`}
                    >
                      Market Gaps
                    </Link>
                  </nav>
                </div>
                
                <div className="flex items-center">
                  <ApiStatus />
                </div>
              </div>
            </div>
          </header>
          
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          
          <footer className="border-t border-[#2c2c2e] mt-12">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">App Review Analyzer</h3>
                  <p className="text-gray-400">
                    A powerful tool for indie hackers to find market gaps by analyzing iOS app reviews.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-gray-400 hover:text-white">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/search" className="text-gray-400 hover:text-white">
                        Search Apps
                      </Link>
                    </li>
                    <li>
                      <Link href="/market-gaps" className="text-gray-400 hover:text-white">
                        Market Gaps
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                  <p className="text-gray-400">
                    Built with Next.js, Express, and natural language processing to help you discover opportunities in the App Store.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#2c2c2e] text-center">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} App Review Analyzer. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}