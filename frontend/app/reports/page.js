'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCachedAnalysis, getAppDetails } from '../../lib/api';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appDetails, setAppDetails] = useState({});

  // Fetch cached analysis reports on component mount
  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const response = await getCachedAnalysis();
        setReports(response.data || []);
        
        // Fetch app details for each report
        const appDetailsMap = {};
        for (const report of response.data || []) {
          try {
            const appResponse = await getAppDetails(report.appId);
            appDetailsMap[report.appId] = appResponse.data;
          } catch (err) {
            console.error(`Error fetching details for app ${report.appId}:`, err);
            appDetailsMap[report.appId] = { title: `App ${report.appId}`, icon: null };
          }
        }
        
        setAppDetails(appDetailsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle report selection
  const handleReportSelect = (appId) => {
    router.push(`/app/${appId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Saved Reports</h1>
        <p className="text-gray-600">
          View your previously analyzed app reports. Click on a report to view the detailed analysis.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg 
            className="w-16 h-16 mx-auto text-gray-300"
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
          <h2 className="mt-4 text-xl font-medium text-gray-700">No Reports Found</h2>
          <p className="mt-2 text-gray-500">
            You haven't analyzed any apps yet. Search for an app and analyze its reviews to create a report.
          </p>
          <div className="mt-6">
            <Link 
              href="/search" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Search Apps
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => {
              const app = appDetails[report.appId] || {};
              return (
                <li 
                  key={report.appId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleReportSelect(report.appId)}
                >
                  <div className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {app.icon ? (
                        <img 
                          src={app.icon} 
                          alt={`${app.title} icon`} 
                          className="h-12 w-12 rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-app-icon.png';
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Icon</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {app.title || `App ${report.appId}`}
                        </p>
                        <p className="ml-2 flex-shrink-0 text-sm text-gray-500">
                          {formatDate(report.lastUpdated)}
                        </p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {app.score ? `${app.score.toFixed(1)}/5` : 'N/A'}
                            </span>
                            <span className="ml-2">
                              App ID: {report.appId}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex justify-between">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 