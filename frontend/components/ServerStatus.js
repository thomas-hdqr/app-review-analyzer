'use client';

import { useState, useEffect } from 'react';
import { checkApiHealth } from '../lib/api';

export default function ServerStatus() {
  const [status, setStatus] = useState({
    checked: false,
    running: false,
    message: '',
    showHelp: false
  });

  useEffect(() => {
    async function checkServer() {
      try {
        const result = await checkApiHealth();
        setStatus({
          checked: true,
          running: result.success,
          message: result.success ? 'Connected to backend server' : result.error,
          showHelp: !result.success
        });
      } catch (error) {
        setStatus({
          checked: true,
          running: false,
          message: error.message || 'Failed to connect to backend server',
          showHelp: true
        });
      }
    }

    checkServer();
  }, []);

  if (!status.checked) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
        <p className="text-gray-500">Checking server status...</p>
      </div>
    );
  }

  if (!status.running) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Backend Server Not Running
        </h3>
        <p className="mt-2 text-red-700">{status.message}</p>
        
        {status.showHelp && (
          <div className="mt-4 bg-white p-3 rounded border border-red-100">
            <h4 className="font-medium text-red-800">Troubleshooting Steps:</h4>
            <ol className="mt-2 text-sm text-red-700 list-decimal list-inside space-y-1">
              <li>Make sure the backend server is running with <code className="bg-red-50 px-1 rounded">npm run dev:backend</code></li>
              <li>Check that the server is running on port 3002 (or update the API_BASE_URL in frontend/lib/api.js)</li>
              <li>Verify there are no errors in the backend server console</li>
              <li>Ensure your firewall isn't blocking the connection</li>
              <li>Try restarting both the frontend and backend servers</li>
            </ol>
            <div className="mt-3 text-sm text-red-700">
              <p>Expected API URL: <code className="bg-red-50 px-1 rounded">http://localhost:3002/api</code></p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null; // Don't show anything if server is running
} 