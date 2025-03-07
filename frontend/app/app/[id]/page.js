'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAppDetails, getSimilarApps, getReviews, analyzeReviews, getAnalysis } from '../../../lib/api';
import AppCard from '../../../components/AppCard';
import ReviewList from '../../../components/ReviewList';
import SentimentChart from '../../../components/SentimentChart';
import ThemeCloud from '../../../components/ThemeCloud';

export default function AppDetailsPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [similarApps, setSimilarApps] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState({
    app: true,
    reviews: false,
    analysis: false
  });
  const [error, setError] = useState({
    app: null,
    reviews: null,
    analysis: null
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchData() {
      setLoading(prev => ({ ...prev, app: true }));
      setError(prev => ({ ...prev, app: null }));
      
      try {
        // Get app details
        const appResponse = await getAppDetails(id);
        setApp(appResponse.data);
        
        // Get similar apps
        const similarResponse = await getSimilarApps(id);
        setSimilarApps(similarResponse.data || []);
      } catch (err) {
        console.error('Error fetching app details:', err);
        setError(prev => ({ ...prev, app: 'Failed to load app details' }));
      } finally {
        setLoading(prev => ({ ...prev, app: false }));
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFetchReviews = async (force = false) => {
    setLoading(prev => ({ ...prev, reviews: true }));
    setError(prev => ({ ...prev, reviews: null }));
    
    try {
      const response = await getReviews(id, force);
      setReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(prev => ({ ...prev, reviews: 'Failed to fetch reviews' }));
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
    }
  };

  const handleAnalyzeReviews = async (force = false) => {
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(prev => ({ ...prev, analysis: null }));
    
    try {
      // First check if analysis already exists
      try {
        const existingAnalysis = await getAnalysis(id);
        if (existingAnalysis.data && !force) {
          setAnalysis(existingAnalysis.data);
          setLoading(prev => ({ ...prev, analysis: false }));
          return;
        }
      } catch (err) {
        // No existing analysis, continue to create new one
      }
      
      // If no reviews, fetch them first
      if (reviews.length === 0) {
        await handleFetchReviews();
      }
      
      // Analyze reviews
      const response = await analyzeReviews(id, force);
      setAnalysis(response.data);
    } catch (err) {
      console.error('Error analyzing reviews:', err);
      setError(prev => ({ ...prev, analysis: 'Failed to analyze reviews' }));
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  if (loading.app) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error.app) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error.app}
        <div className="mt-4">
          <Link href="/search" className="text-blue-600 hover:underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
        App not found
        <div className="mt-4">
          <Link href="/search" className="text-blue-600 hover:underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* App Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <Image
              src={app.icon || '/placeholder-app-icon.png'}
              alt={`${app.title} icon`}
              width={96}
              height={96}
              className="rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-app-icon.png';
              }}
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{app.title}</h1>
            <p className="text-gray-600">{app.developer}</p>
            
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(app.score) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-700">
                  {app.score.toFixed(1)} ({app.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View in App Store
              </a>
              
              <button
                onClick={() => handleFetchReviews(true)}
                disabled={loading.reviews}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading.reviews ? 'Fetching...' : reviews.length > 0 ? 'Refresh Reviews' : 'Fetch Reviews'}
              </button>
              
              <button
                onClick={() => handleAnalyzeReviews(true)}
                disabled={loading.analysis || reviews.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
              >
                {loading.analysis ? 'Analyzing...' : analysis ? 'Refresh Analysis' : 'Analyze Reviews'}
              </button>
            </div>
          </div>
        </div>
        
        {/* App Description */}
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-700">
            {app.description?.substring(0, 300)}
            {app.description?.length > 300 ? '...' : ''}
          </p>
        </div>
        
        {/* App Metadata */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-gray-500">Category</span>
            <span className="font-medium">{app.primaryGenre}</span>
          </div>
          <div>
            <span className="block text-gray-500">Price</span>
            <span className="font-medium">{app.free ? 'Free' : `$${app.price}`}</span>
          </div>
          <div>
            <span className="block text-gray-500">Last Updated</span>
            <span className="font-medium">{new Date(app.updated).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="block text-gray-500">Version</span>
            <span className="font-medium">{app.version || 'Unknown'}</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab('market-gaps')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'market-gaps'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Market Gaps
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">App Overview</h2>
              
              {reviews.length === 0 ? (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">
                    No reviews fetched yet. Click the "Fetch Reviews" button to get started.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Review Stats</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Reviews:</span>
                        <span className="font-medium">{reviews.length}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Average Rating:</span>
                        <span className="font-medium">{
                          (reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length).toFixed(1)
                        } / 5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latest Review:</span>
                        <span className="font-medium">{
                          reviews.length > 0 ? new Date(reviews[0].date).toLocaleDateString() : 'N/A'
                        }</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Analysis Status</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {analysis ? (
                        <>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Analysis Date:</span>
                            <span className="font-medium">{new Date(analysis.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Positive Reviews:</span>
                            <span className="font-medium text-green-600">{analysis.sentimentAnalysis.positive}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Negative Reviews:</span>
                            <span className="font-medium text-red-600">{analysis.sentimentAnalysis.negative}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-600">
                          No analysis performed yet. Click the "Analyze Reviews" button to get insights.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Next Steps</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-blue-800">
                    {reviews.length === 0 && (
                      <li>Fetch reviews using the "Fetch Reviews" button above</li>
                    )}
                    {reviews.length > 0 && !analysis && (
                      <li>Analyze reviews to get sentiment and theme insights</li>
                    )}
                    {analysis && (
                      <>
                        <li>Check the "Analysis" tab to see sentiment and themes</li>
                        <li>Explore the "Market Gaps" tab to identify opportunities</li>
                      </>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">App Reviews</h2>
                
                <div className="flex space-x-2">
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Reviews</option>
                    <option value="positive">Positive Only</option>
                    <option value="negative">Negative Only</option>
                    <option value="neutral">Neutral Only</option>
                  </select>
                  
                  <button
                    onClick={() => handleFetchReviews(true)}
                    disabled={loading.reviews}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading.reviews ? 'Fetching...' : 'Refresh'}
                  </button>
                </div>
              </div>
              
              {error.reviews && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                  {error.reviews}
                </div>
              )}
              
              {loading.reviews ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">
                    No reviews fetched yet. Click the "Fetch Reviews" button to get started.
                  </p>
                </div>
              ) : (
                <ReviewList reviews={reviews} filter={reviewFilter} />
              )}
            </div>
          )}
          
          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Review Analysis</h2>
                
                <button
                  onClick={() => handleAnalyzeReviews(true)}
                  disabled={loading.analysis || reviews.length === 0}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:bg-green-400"
                >
                  {loading.analysis ? 'Analyzing...' : 'Refresh Analysis'}
                </button>
              </div>
              
              {error.analysis && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                  {error.analysis}
                </div>
              )}
              
              {loading.analysis ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : !analysis ? (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">
                    {reviews.length === 0 
                      ? 'Please fetch reviews first before analyzing.' 
                      : 'No analysis performed yet. Click the "Analyze Reviews" button to get insights.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <SentimentChart sentimentData={analysis.sentimentAnalysis} />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <ThemeCloud themes={analysis.positiveThemes} type="positive" />
                    <ThemeCloud themes={analysis.negativeThemes} type="negative" />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Market Gaps Tab */}
          {activeTab === 'market-gaps' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Market Gaps & Opportunities</h2>
              
              {!analysis ? (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">
                    {reviews.length === 0 
                      ? 'Please fetch and analyze reviews first to identify market gaps.' 
                      : 'Please analyze reviews first to identify market gaps.'}
                  </p>
                </div>
              ) : analysis.marketGaps && analysis.marketGaps.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900">
                        Potential Market Gaps
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Based on negative reviews that highlight unaddressed user needs
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {analysis.marketGaps.map((gap, index) => (
                          <li key={index} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 bg-red-100 text-red-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-lg font-medium text-gray-900 capitalize">
                                    {gap.feature}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {gap.painPoint}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="text-center px-3">
                                  <span className="block text-sm font-medium text-gray-500">Opportunity</span>
                                  <span className="text-xl font-bold text-blue-600">{gap.opportunityScore}/10</span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">How to Use This Data</h3>
                    <p className="text-blue-700 mb-4">
                      These market gaps represent features or improvements that users want but aren't adequately addressed in this app.
                      Consider these opportunities when building your own app in this category.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Focus on the highest opportunity score items first</li>
                      <li>Research how competitors handle these features</li>
                      <li>Consider building an MVP that addresses these specific pain points</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    No significant market gaps identified in the analysis. This could mean the app is meeting user needs well,
                    or that more reviews need to be analyzed for a better assessment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Link href="/search" className="text-blue-600 hover:underline">
          ← Back to Search
        </Link>
      </div>
    </div>
  );
}