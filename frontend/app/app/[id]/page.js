'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAppDetails, getSimilarApps, getReviews, analyzeReviews } from '@/lib/api';
import AppCard from '@/components/AppCard';
import ReviewList from '@/components/ReviewList';

export default function AppDetailsPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [similarApps, setSimilarApps] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get app details
        const appResponse = await getAppDetails(id);
        setApp(appResponse.data);
        
        // Get similar apps
        const similarResponse = await getSimilarApps(id);
        setSimilarApps(similarResponse.data || []);
      } catch (err) {
        console.error('Error fetching app details:', err);
        setError('Error loading app details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchReviews = async (forceRefresh = false) => {
    setIsReviewsLoading(true);
    setError(null);
    
    try {
      const response = await getReviews(id, forceRefresh);
      setReviews(response.data || []);
      setActiveTab('reviews');
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Error loading reviews. Please try again.');
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const analyzeAppReviews = async (forceReanalysis = false) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await analyzeReviews(id, forceReanalysis);
      setAnalysis(response.data);
      setActiveTab('analysis');
    } catch (err) {
      console.error('Error analyzing reviews:', err);
      setError('Error analyzing reviews. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/search" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-2">App Not Found</h2>
        <p>The requested app could not be found.</p>
        <div className="mt-4">
          <Link href="/search" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* App Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* App Icon */}
            <div className="flex-shrink-0">
              <Image
                src={app.icon}
                alt={`${app.title} icon`}
                width={128}
                height={128}
                className="rounded-2xl shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='5' ry='5'/%3E%3Cpath d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'/%3E%3Cline x1='17.5' y1='6.5' x2='17.51' y2='6.5'/%3E%3C/svg%3E";
                }}
              />
            </div>
            
            {/* App Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{app.title}</h1>
              <p className="text-blue-100 mb-3">{app.developer}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex items-center mr-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(app.score) ? 'text-yellow-300' : 'text-gray-300 text-opacity-50'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-medium">{app.score.toFixed(1)}</span>
                </div>
                
                <div className="text-blue-100">
                  {app.reviews.toLocaleString()} ratings
                </div>
                
                <div className="text-blue-100">
                  {app.genres.join(', ')}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  View in App Store
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <button
                  onClick={() => fetchReviews(false)}
                  disabled={isReviewsLoading}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-30 text-white rounded-lg font-medium hover:bg-opacity-40 transition-colors disabled:opacity-50"
                >
                  {isReviewsLoading ? 'Loading...' : 'Fetch Reviews'}
                </button>
                
                <button
                  onClick={() => analyzeAppReviews(false)}
                  disabled={isAnalyzing}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-30 text-white rounded-lg font-medium hover:bg-opacity-40 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze App'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-center font-medium text-sm md:text-base ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              App Details
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              disabled={reviews.length === 0}
              className={`py-4 px-6 text-center font-medium text-sm md:text-base ${
                reviews.length === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : activeTab === 'reviews'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </button>
            
            <button
              onClick={() => setActiveTab('analysis')}
              disabled={!analysis}
              className={`py-4 px-6 text-center font-medium text-sm md:text-base ${
                !analysis
                  ? 'text-gray-300 cursor-not-allowed'
                  : activeTab === 'analysis'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analysis
            </button>
            
            <button
              onClick={() => setActiveTab('similar')}
              className={`py-4 px-6 text-center font-medium text-sm md:text-base ${
                activeTab === 'similar'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Similar Apps
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{app.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dl className="grid grid-cols-2 gap-3">
                      <dt className="text-sm font-medium text-gray-500">Developer</dt>
                      <dd className="text-sm text-gray-800">{app.developer}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-800">{app.primaryGenre}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Price</dt>
                      <dd className="text-sm text-gray-800">{app.price === 0 ? 'Free' : `$${app.price.toFixed(2)}`}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Version</dt>
                      <dd className="text-sm text-gray-800">{app.version}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="text-sm text-gray-800">{Math.round(app.size / 1024 / 1024)} MB</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Languages</dt>
                      <dd className="text-sm text-gray-800">{app.languages ? app.languages.slice(0, 3).join(', ') : 'N/A'}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Age Rating</dt>
                      <dd className="text-sm text-gray-800">{app.contentRating}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Released</dt>
                      <dd className="text-sm text-gray-800">{new Date(app.released).toLocaleDateString()}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Updated</dt>
                      <dd className="text-sm text-gray-800">{new Date(app.updated).toLocaleDateString()}</dd>
                    </dl>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Quick Analysis</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-600 mb-1">Rating Distribution</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(app.score / 5) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Market Potential:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {app.score >= 4.5 ? 'Highly Competitive' : app.score >= 4.0 ? 'Competitive' : app.score >= 3.5 ? 'Moderate' : 'Opportunity for Improvement'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600">Review Frequency:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {app.reviews >= 10000 ? 'Very High' : app.reviews >= 5000 ? 'High' : app.reviews >= 1000 ? 'Moderate' : 'Low'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600">Recommendation:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          Analyze reviews to identify user pain points and feature gaps
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={() => analyzeAppReviews(false)}
                        disabled={isAnalyzing}
                        className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-blue-400"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Run Full Analysis'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              {reviews.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Reviews ({reviews.length})
                    </h2>
                    <button
                      onClick={() => fetchReviews(true)}
                      disabled={isReviewsLoading}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      {isReviewsLoading ? 'Refreshing...' : 'Refresh Reviews'}
                    </button>
                  </div>
                  
                  <ReviewList reviews={reviews} />
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">No Reviews Available</h3>
                  <p className="mt-2 text-gray-500">Click the "Fetch Reviews" button to get the latest reviews for this app.</p>
                  <button
                    onClick={() => fetchReviews(false)}
                    disabled={isReviewsLoading}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isReviewsLoading ? 'Loading...' : 'Fetch Reviews'}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div>
              {analysis ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                    <button
                      onClick={() => analyzeAppReviews(true)}
                      disabled={isAnalyzing}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      {isAnalyzing ? 'Reanalyzing...' : 'Refresh Analysis'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Sentiment Analysis */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Sentiment Distribution</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-green-700">Positive</span>
                            <span className="text-sm text-gray-600">{analysis.sentimentAnalysis.positive} reviews ({((analysis.sentimentAnalysis.positive / analysis.sentimentAnalysis.total) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(analysis.sentimentAnalysis.positive / analysis.sentimentAnalysis.total) * 100}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Neutral</span>
                            <span className="text-sm text-gray-600">{analysis.sentimentAnalysis.neutral} reviews ({((analysis.sentimentAnalysis.neutral / analysis.sentimentAnalysis.total) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: `${(analysis.sentimentAnalysis.neutral / analysis.sentimentAnalysis.total) * 100}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-red-700">Negative</span>
                            <span className="text-sm text-gray-600">{analysis.sentimentAnalysis.negative} reviews ({((analysis.sentimentAnalysis.negative / analysis.sentimentAnalysis.total) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${(analysis.sentimentAnalysis.negative / analysis.sentimentAnalysis.total) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Average Rating</span>
                          <span className="text-lg font-bold text-blue-600">{analysis.sentimentAnalysis.averageScore.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-gray-700">Sentiment Ratio</span>
                          <span className="text-lg font-bold text-blue-600">{analysis.sentimentAnalysis.sentimentRatio.toFixed(1)}:1</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Market Gaps */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Potential Market Gaps</h3>
                      
                      {analysis.marketGaps && analysis.marketGaps.length > 0 ? (
                        <div className="space-y-4">
                          {analysis.marketGaps.slice(0, 5).map((gap, index) => (
                            <div key={index} className="border-b border-gray-100 pb-3">
                              <div className="flex justify-between items-start">
                                <h4 className="text-md font-medium text-gray-800">{gap.feature}</h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Score: {gap.opportunityScore}/10
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{gap.painPoint}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No significant market gaps identified.</p>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          These gaps represent potential opportunities for improvement based on negative user feedback that isn't addressed in positive reviews.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Positive Themes */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Positive Themes</h3>
                      
                      {analysis.positiveThemes && analysis.positiveThemes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {analysis.positiveThemes.map((theme, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                              style={{ fontSize: `${Math.max(0.75, Math.min(1.25, 0.75 + (theme.count / 50) * 0.5))}rem` }}
                            >
                              {theme.word}
                              <span className="ml-1 text-xs text-green-600">{theme.count}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No positive themes identified.</p>
                      )}
                    </div>
                    
                    {/* Negative Themes */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Negative Themes</h3>
                      
                      {analysis.negativeThemes && analysis.negativeThemes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {analysis.negativeThemes.map((theme, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                              style={{ fontSize: `${Math.max(0.75, Math.min(1.25, 0.75 + (theme.count / 50) * 0.5))}rem` }}
                            >
                              {theme.word}
                              <span className="ml-1 text-xs text-red-600">{theme.count}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No negative themes identified.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Analysis Summary */}
                  <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Summary</h3>
                    <p className="text-gray-700">
                      Based on the analysis of {analysis.reviewCount} reviews, this app has a {analysis.sentimentAnalysis.averageScore.toFixed(1)} average rating with a 
                      {analysis.sentimentAnalysis.sentimentRatio.toFixed(1)}:1 positive to negative sentiment ratio.
                    </p>
                    <p className="text-gray-700 mt-2">
                      Users particularly appreciate features related to {analysis.positiveThemes.slice(0, 3).map(t => t.word).join(', ')}, 
                      while common complaints focus on {analysis.negativeThemes.slice(0, 3).map(t => t.word).join(', ')}.
                    </p>
                    <p className="text-gray-700 mt-2">
                      The analysis suggests potential market opportunities in addressing: {analysis.marketGaps.slice(0, 3).map(g => g.feature).join(', ')}.
                    </p>
                    <p className="text-gray-500 text-sm mt-4">
                      Last updated: {new Date(analysis.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">No Analysis Available</h3>
                  <p className="mt-2 text-gray-500">Run an analysis to discover insights from this app's reviews.</p>
                  <button
                    onClick={() => analyzeAppReviews(false)}
                    disabled={isAnalyzing}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Similar Apps Tab */}
          {activeTab === 'similar' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Similar Apps</h2>
              
              {similarApps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarApps.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
                  No similar apps found for this application.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 mb-8">
        <Link href="/search" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Search
        </Link>
      </div>
    </div>
  );
}