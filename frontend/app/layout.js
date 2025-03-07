'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                      App Review Analyzer
                    </Link>
                  </div>
                  <nav className="ml-6 flex space-x-8">
                    <Link
                      href="/"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/') 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/search"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/search') 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Search
                    </Link>
                    <Link
                      href="/reports"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/reports') 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Reports
                    </Link>
                    <Link
                      href="/market-gaps"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/market-gaps') || isActive('/opportunity')
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Market Gaps
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </header>
          
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          
          <footer className="bg-white">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                App Review Analyzer - A tool for indie hackers to find market gaps
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}