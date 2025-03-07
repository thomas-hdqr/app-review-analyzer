'use client';

import { useState } from 'react';
import { checkApiHealth, testAppDetails, convertBundleIdToAppId } from '../lib/api';

/**
 * ApiDebugger component for debugging API connectivity issues
 */
export default function ApiDebugger() {
  const [apiStatus, setApiStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [convertResult, setConvertResult] = useState(null);
  const [loading, setLoading] = useState({
    health: false,
    test: false,
    convert: false
  });
  const [error, setError] = useState({
    health: null,
    test: null,
    convert: null
  });
  const [showDetails, setShowDetails] = useState(false);
  const [testAppId, setTestAppId] = useState('553834731'); // Default to Candy Crush Saga as a test
  const [bundleId, setBundleId] = useState('com.king.candycrushsaga'); // Default to Candy Crush Saga as a test

  const checkConnection = async () => {
    setLoading(prev => ({ ...prev, health: true }));
    setError(prev => ({ ...prev, health: null }));
    
    try {
      const result = await checkApiHealth();
      setApiStatus(result);
      console.log('API Health Check Result:', result);
    } catch (err) {
      console.error('API Health Check Error:', err);
      setError(prev => ({ ...prev, health: err.message || 'Failed to connect to API' }));
    } finally {
      setLoading(prev => ({ ...prev, health: false }));
    }
  };

  const testAppEndpoint = async () => {
    if (!testAppId.trim()) {
      setError(prev => ({ ...prev, test: 'Please enter an App ID' }));
      return;
    }

    setLoading(prev => ({ ...prev, test: true }));
    setError(prev => ({ ...prev, test: null }));
    setTestResult(null);
    
    try {
      const result = await testAppDetails(testAppId);
      setTestResult(result);
      console.log('App Test Result:', result);
    } catch (err) {
      console.error('App Test Error:', err);
      setError(prev => ({ ...prev, test: err.message || 'Failed to test app endpoint' }));
    } finally {
      setLoading(prev => ({ ...prev, test: false }));
    }
  };

  const convertBundleId = async () => {
    if (!bundleId.trim()) {
      setError(prev => ({ ...prev, convert: 'Please enter a Bundle ID' }));
      return;
    }

    setLoading(prev => ({ ...prev, convert: true }));
    setError(prev => ({ ...prev, convert: null }));
    setConvertResult(null);
    
    try {
      const appId = await convertBundleIdToAppId(bundleId);
      setConvertResult({
        bundleId,
        appId,
        success: true,
        message: `Successfully converted bundle ID to App Store ID: ${appId}`
      });
      console.log('Bundle ID Conversion Result:', appId);
    } catch (err) {
      console.error('Bundle ID Conversion Error:', err);
      setError(prev => ({ ...prev, convert: err.message || 'Failed to convert bundle ID' }));
    } finally {
      setLoading(prev => ({ ...prev, convert: false }));
    }
  };

  return (
    <div className="p-4 bg-[#1c1c1e] border border-[#3a3a3c] rounded-xl">
      <h2 className="text-lg font-semibold text-white mb-4">API Connection Debugger</h2>
      
      {/* Health Check Section */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-white mb-2">API Health Check</h3>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={checkConnection}
            disabled={loading.health}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              loading.health 
                ? 'bg-[#3a3a3c] text-gray-400 cursor-not-allowed' 
                : 'bg-[#0a84ff] text-white hover:bg-[#0a84ff]/90'
            }`}
          >
            {loading.health ? 'Checking...' : 'Check API Connection'}
          </button>
          
          {apiStatus && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-[#3a3a3c] text-white rounded-lg hover:bg-[#48484a] transition-colors"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          )}
        </div>
        
        {error.health && (
          <div className="p-4 bg-[#ff453a]/10 border border-[#ff453a]/30 text-[#ff453a] rounded-lg mb-4">
            <p className="font-medium">Error:</p>
            <p>{error.health}</p>
          </div>
        )}
        
        {apiStatus && (
          <div className="p-4 bg-[#30d158]/10 border border-[#30d158]/30 text-[#30d158] rounded-lg">
            <p className="font-medium">API Connected Successfully!</p>
            <p>Status: {apiStatus.status}</p>
            <p>Message: {apiStatus.message}</p>
            
            {showDetails && (
              <div className="mt-4">
                <p className="font-medium">API Details:</p>
                <pre className="mt-2 p-3 bg-[#2c2c2e] rounded-lg overflow-x-auto text-xs text-gray-300">
                  {JSON.stringify(apiStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* App ID Test Section */}
      <div className="border-t border-[#3a3a3c] pt-6 mb-6">
        <h3 className="text-md font-medium text-white mb-2">Test App ID Endpoint</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={testAppId}
            onChange={(e) => setTestAppId(e.target.value)}
            placeholder="Enter App ID (e.g., 553834731)"
            className="flex-1 px-4 py-2 bg-[#2c2c2e] text-white rounded-lg border border-[#3a3a3c] focus:outline-none focus:ring-2 focus:ring-[#0a84ff]"
          />
          <button
            onClick={testAppEndpoint}
            disabled={loading.test}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              loading.test 
                ? 'bg-[#3a3a3c] text-gray-400 cursor-not-allowed' 
                : 'bg-[#0a84ff] text-white hover:bg-[#0a84ff]/90'
            }`}
          >
            {loading.test ? 'Testing...' : 'Test Endpoint'}
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-[#2c2c2e] rounded-lg text-sm text-gray-300">
          <p className="font-medium text-white mb-1">App ID Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use <span className="text-[#0a84ff]">numeric App Store IDs</span> for best results (e.g., 553834731 for Candy Crush)</li>
            <li>Bundle IDs (e.g., com.example.app) may work but are less reliable</li>
            <li>Find App IDs by searching for the app in the App Store and looking at the URL</li>
            <li>Example: https://apps.apple.com/us/app/candy-crush-saga/id<span className="text-[#0a84ff]">553834731</span></li>
          </ul>
        </div>
        
        {error.test && (
          <div className="p-4 bg-[#ff453a]/10 border border-[#ff453a]/30 text-[#ff453a] rounded-lg mb-4">
            <p className="font-medium">Error:</p>
            <p>{error.test}</p>
          </div>
        )}
        
        {testResult && (
          <div className="p-4 bg-[#30d158]/10 border border-[#30d158]/30 text-[#30d158] rounded-lg">
            <p className="font-medium">Test Successful!</p>
            <p>Received ID: {testResult.receivedId}</p>
            <p>Timestamp: {testResult.timestamp}</p>
            
            <div className="mt-4">
              <p className="font-medium">Response Details:</p>
              <pre className="mt-2 p-3 bg-[#2c2c2e] rounded-lg overflow-x-auto text-xs text-gray-300">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
      
      {/* Bundle ID Converter Section */}
      <div className="border-t border-[#3a3a3c] pt-6">
        <h3 className="text-md font-medium text-white mb-2">Bundle ID to App ID Converter</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={bundleId}
            onChange={(e) => setBundleId(e.target.value)}
            placeholder="Enter Bundle ID (e.g., com.king.candycrushsaga)"
            className="flex-1 px-4 py-2 bg-[#2c2c2e] text-white rounded-lg border border-[#3a3a3c] focus:outline-none focus:ring-2 focus:ring-[#0a84ff]"
          />
          <button
            onClick={convertBundleId}
            disabled={loading.convert}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              loading.convert 
                ? 'bg-[#3a3a3c] text-gray-400 cursor-not-allowed' 
                : 'bg-[#0a84ff] text-white hover:bg-[#0a84ff]/90'
            }`}
          >
            {loading.convert ? 'Converting...' : 'Convert to App ID'}
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-[#2c2c2e] rounded-lg text-sm text-gray-300">
          <p className="font-medium text-white mb-1">Bundle ID Converter:</p>
          <p>This tool attempts to convert a bundle ID (e.g., com.king.candycrushsaga) to a numeric App Store ID (e.g., 553834731).</p>
          <p className="mt-2">It works by searching the App Store for apps matching the bundle ID and returning the first match.</p>
          <p className="mt-2 text-[#ff9f0a]">Note: This is not always accurate and depends on the App Store search results.</p>
        </div>
        
        {error.convert && (
          <div className="p-4 bg-[#ff453a]/10 border border-[#ff453a]/30 text-[#ff453a] rounded-lg mb-4">
            <p className="font-medium">Error:</p>
            <p>{error.convert}</p>
          </div>
        )}
        
        {convertResult && (
          <div className="p-4 bg-[#30d158]/10 border border-[#30d158]/30 text-[#30d158] rounded-lg">
            <p className="font-medium">Conversion Successful!</p>
            <p>Bundle ID: {convertResult.bundleId}</p>
            <p>App Store ID: {convertResult.appId}</p>
            
            <div className="mt-4">
              <p className="font-medium">Try it now:</p>
              <div className="mt-2 flex">
                <a 
                  href={`/app/${convertResult.appId}`}
                  className="px-4 py-2 bg-[#0a84ff] text-white rounded-lg hover:bg-[#0a84ff]/90 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View App Details
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>API Base URL: <code className="bg-[#2c2c2e] px-1 py-0.5 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}</code></p>
        <p className="mt-1">If you're experiencing issues, try running both servers with <code className="bg-[#2c2c2e] px-1 py-0.5 rounded">npm run dev</code> from the project root.</p>
      </div>
    </div>
  );
} 