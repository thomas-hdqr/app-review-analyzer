'use client';

import { useState, useEffect } from 'react';
import { checkApiHealth } from '../lib/api';

/**
 * ApiStatus component for displaying API connection status
 * @param {Object} props - Component props
 * @param {Function} props.onStatusChange - Callback when status changes (optional)
 */
export default function ApiStatus({ onStatusChange }) {
  const [status, setStatus] = useState({ checked: false, healthy: true, message: '' });
  const [loading, setLoading] = useState(false);

  // Check API health on component mount
  useEffect(() => {
    async function checkHealth() {
      setLoading(true);
      try {
        const healthCheck = await checkApiHealth();
        const newStatus = { 
          checked: true, 
          healthy: healthCheck.success,
          message: healthCheck.success ? 'API Connected' : healthCheck.error
        };
        setStatus(newStatus);
        
        // Call onStatusChange callback if provided
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      } catch (err) {
        console.error('Error checking API health:', err);
        const newStatus = { 
          checked: true, 
          healthy: false,
          message: 'Could not connect to API server'
        };
        setStatus(newStatus);
        
        // Call onStatusChange callback if provided
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
    
    // Set up interval to check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [onStatusChange]);

  // Don't render anything if not checked yet
  if (!status.checked && !loading) {
    return null;
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      loading 
        ? 'bg-gray-100 text-gray-800' 
        : status.healthy 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
    }`}>
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Checking API
        </>
      ) : status.healthy ? (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          API Connected
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          API Offline
        </>
      )}
    </div>
  );
} 