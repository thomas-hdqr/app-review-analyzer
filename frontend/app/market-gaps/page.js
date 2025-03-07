'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ServerStatus from '../../components/ServerStatus';
import { getCachedAnalysis, getAppDetails, identifyMarketGaps, checkApiHealth } from '../../lib/api';

export default function MarketGapsPage() {
  const [analyzedApps, setAnalyzedApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [appDetails, setAppDetails] = useState({});
  const [marketGaps, setMarketGaps] = useState(null);
  const [loading, setLoading] = useState({
    apps: true,
    analysis: false
  });
  const [error, setError] = useState({
    apps: null,
    analysis: null
  });
  const [apiStatus, setApiStatus] = useState({ checked: false, healthy: true });

  // Fetch cached analysis reports on component mount
  useEffect(() => {
    async function fetchAnalyzedApps() {
      try {
        setLoading(prev => ({ ...prev, apps: true }));
        
        // First check API health
        const healthCheck = await checkApiHealth();
        setApiStatus({ checked: true, healthy: healthCheck.success });
        
        if (!healthCheck.success) {
          setError(prev => ({ 
            ...prev, 
            apps: `API server connection error: ${healthCheck.error}. Please check your backend server.` 
          }));
          setAnalyzedApps([]);
          setLoading(prev => ({ ...prev, apps: false }));
          return;
        }
        
        const response = await getCachedAnalysis();
        setAnalyzedApps(response.data || []);
        
        // Fetch app details for each analyzed app
        const appDetailsMap = {};
        for (const app of response.data || []) {
          try {
            const appResponse = await getAppDetails(app.appId);
            appDetailsMap[app.appId] = appResponse.data;
          } catch (err) {
            console.error(`Error fetching details for app ${app.appId}:`, err);
            appDetailsMap[app.appId] = { title: `App ${app.appId}`, icon: null };
          }
        }
        
        setAppDetails(appDetailsMap);
        setError(prev => ({ ...prev, apps: null }));
      } catch (err) {
        console.error('Error fetching analyzed apps:', err);
        setError(prev => ({ ...prev, apps: 'Failed to load analyzed apps. Please try again later.' }));
        // Set empty array to avoid undefined errors
        setAnalyzedApps([]);
      } finally {
        setLoading(prev => ({ ...prev, apps: false }));
      }
    }

    fetchAnalyzedApps();
  }, []);

  // Handle app selection
  const toggleAppSelection = (appId) => {
    setSelectedApps(prev => {
      if (prev.includes(appId)) {
        return prev.filter(id => id !== appId);
      } else {
        return [...prev, appId];
      }
    });
  };

  // Handle market gap analysis
  const analyzeMarketGaps = async () => {
    if (selectedApps.length === 0) {
      setError(prev => ({ ...prev, analysis: 'Please select at least one app to analyze.' }));
      return;
    }

    // Check if API is healthy before analyzing
    if (!apiStatus.healthy) {
      setError(prev => ({ 
        ...prev, 
        analysis: 'Cannot analyze: API server is not available. Please check your backend server.' 
      }));
      return;
    }

    setLoading(prev => ({ ...prev, analysis: true }));
    setError(prev => ({ ...prev, analysis: null }));
    
    try {
      const response = await identifyMarketGaps(selectedApps);
      setMarketGaps(response.data);
    } catch (err) {
      console.error('Error analyzing market gaps:', err);
      setError(prev => ({ ...prev, analysis: 'Failed to analyze market gaps. Please try again later.' }));
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Server Status Check */}
      {!apiStatus.healthy && <ServerStatus />}
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-4">Market Gap Analysis</h1>
            <p className="text-gray-600">
              Identify market opportunities by analyzing gaps across multiple apps in the same category.
              Select apps you've already analyzed to find common pain points and unmet user needs.
            </p>
          </div>
          
          {apiStatus.checked && !apiStatus.healthy && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              API Offline
            </div>
          )}
        </div>
      </div>

      {/* App Selection */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Select Apps to Compare</h2>
        
        {error.apps && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            {error.apps}
          </div>
        )}
        
        {loading.apps ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : analyzedApps.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700">
              No analyzed apps found. Please analyze some apps first before identifying market gaps.
            </p>
            <div className="mt-4">
              <Link 
                href="/search" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Search Apps
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {analyzedApps.map((app) => {
                const appDetail = appDetails[app.appId] || {};
                const isSelected = selectedApps.includes(app.appId);
                
                return (
                  <div 
                    key={app.appId}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => toggleAppSelection(app.appId)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {appDetail.icon ? (
                          <img 
                            src={appDetail.icon} 
                            alt={`${appDetail.title} icon`} 
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
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {appDetail.title || `App ${app.appId}`}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">
                            Analyzed: {formatDate(app.lastUpdated)}
                          </span>
                          {appDetail.score && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {appDetail.score.toFixed(1)}/5
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by the div click
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={analyzeMarketGaps}
                disabled={selectedApps.length === 0 || loading.analysis}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading.analysis ? 'Analyzing...' : 'Identify Market Gaps'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Analysis Results */}
      {error.analysis && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error.analysis}
        </div>
      )}
      
      {marketGaps && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Market Gap Analysis Results</h2>
            <p className="mt-1 text-sm text-gray-600">
              Based on analysis of {marketGaps.appsAnalyzed} apps • Generated on {formatDate(marketGaps.analysisDate)}
            </p>
          </div>
          
          <div className="px-6 py-5">
            {marketGaps.marketGaps && marketGaps.marketGaps.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700">
                    The following market gaps were identified across the selected apps. These represent common pain points and unmet user needs that could be opportunities for your app.
                  </p>
                </div>
                
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {marketGaps.marketGaps.map((gap, index) => (
                      <li key={index}>
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 capitalize">
                                  {gap.feature}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {gap.painPoint}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <span className="block text-xs text-gray-500">Impact</span>
                                <span className="text-sm font-medium text-gray-900">{gap.impact}/10</span>
                              </div>
                              <div className="text-center">
                                <span className="block text-xs text-gray-500">Competition Gap</span>
                                <span className="text-sm font-medium text-gray-900">{gap.competitionGap}/10</span>
                              </div>
                              <div className="text-center">
                                <span className="block text-xs text-gray-500">Opportunity</span>
                                <span className="text-lg font-bold text-blue-600">{gap.opportunityScore}/10</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-2 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700">Affected Apps:</h4>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {Object.keys(gap.affectedApps).map(appId => (
                                <Link 
                                  key={appId}
                                  href={`/app/${appId}`}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                                >
                                  {appDetails[appId]?.title || `App ${appId}`}
                                  <span className="ml-1 text-gray-500">({gap.affectedApps[appId]} mentions)</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-2">How to Use This Data</h3>
                  <p className="text-green-700 mb-2">
                    These market gaps represent common pain points across multiple apps in the same category.
                    Consider these opportunities when building your own app:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>Focus on gaps with high opportunity scores first</li>
                    <li>Prioritize features that address these common pain points</li>
                    <li>Consider how you can solve these problems better than existing apps</li>
                    <li>Use these insights to differentiate your app in the market</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-700">
                  No significant market gaps were identified across the selected apps. This could mean:
                </p>
                <ul className="list-disc list-inside mt-2 text-yellow-700">
                  <li>The apps are meeting user needs well</li>
                  <li>The apps don't have enough common negative themes</li>
                  <li>Try selecting more apps in the same category for better results</li>
                </ul>
              </div>
            )}
          </div>
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