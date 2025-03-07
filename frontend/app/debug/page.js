'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApiDebugger from '../../components/ApiDebugger';

export default function DebugPage() {
  const [envInfo, setEnvInfo] = useState({
    nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL || 'Not set',
    nodeEnv: process.env.NODE_ENV || 'Not set',
    baseUrl: typeof window !== 'undefined' ? window.location.origin : 'Not available'
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">API Debug Page</h1>
        <Link 
          href="/" 
          className="px-3 py-1.5 bg-[#3a3a3c] text-white rounded-lg hover:bg-[#48484a] transition-colors text-sm"
        >
          Back to Home
        </Link>
      </div>

      <div className="p-4 bg-[#1c1c1e] border border-[#3a3a3c] rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Environment Information</h2>
        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="text-gray-400">NEXT_PUBLIC_API_URL:</span>
            <code className="bg-[#2c2c2e] px-2 py-1 rounded text-white">{envInfo.nextPublicApiUrl}</code>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">NODE_ENV:</span>
            <code className="bg-[#2c2c2e] px-2 py-1 rounded text-white">{envInfo.nodeEnv}</code>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Frontend Base URL:</span>
            <code className="bg-[#2c2c2e] px-2 py-1 rounded text-white">{envInfo.baseUrl}</code>
          </div>
        </div>
      </div>

      <ApiDebugger />

      <div className="p-4 bg-[#1c1c1e] border border-[#3a3a3c] rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Troubleshooting Steps</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-300">
          <li>
            <strong>Check if both servers are running:</strong>
            <p className="ml-6 text-sm text-gray-400 mt-1">
              Make sure both the frontend and backend servers are running. The best way to do this is to run <code className="bg-[#2c2c2e] px-1 py-0.5 rounded">npm run dev</code> from the project root.
            </p>
          </li>
          <li>
            <strong>Verify API URL configuration:</strong>
            <p className="ml-6 text-sm text-gray-400 mt-1">
              The frontend should be configured to use the correct API URL. This is set via the <code className="bg-[#2c2c2e] px-1 py-0.5 rounded">NEXT_PUBLIC_API_URL</code> environment variable.
            </p>
          </li>
          <li>
            <strong>Check browser console for errors:</strong>
            <p className="ml-6 text-sm text-gray-400 mt-1">
              Open your browser's developer tools (F12) and check the console for any error messages related to API calls.
            </p>
          </li>
          <li>
            <strong>Test API endpoints directly:</strong>
            <p className="ml-6 text-sm text-gray-400 mt-1">
              Try accessing the API endpoints directly in your browser or using a tool like Postman. For example: <code className="bg-[#2c2c2e] px-1 py-0.5 rounded">http://localhost:3001/api/health</code>
            </p>
          </li>
          <li>
            <strong>Restart the development servers:</strong>
            <p className="ml-6 text-sm text-gray-400 mt-1">
              Sometimes, simply restarting the development servers can resolve connectivity issues.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
} 