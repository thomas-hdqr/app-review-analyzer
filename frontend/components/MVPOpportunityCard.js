'use client';

import { useState } from 'react';
import ThemeCloud from './ThemeCloud';

/**
 * Component to display MVP opportunity analysis
 * @param {Object} props - Component props
 * @param {Object} props.opportunityData - MVP opportunity analysis data
 * @returns {JSX.Element} - Rendered component
 */
export default function MVPOpportunityCard({ opportunityData }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!opportunityData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          No opportunity data available. Select apps to analyze.
        </div>
      </div>
    );
  }
  
  const { 
    mvpOpportunityScore, 
    marketGaps, 
    mvpRecommendedFeatures, 
    aiInsights, 
    appsAnalyzed,
    analysisDate,
    dataQuality
  } = opportunityData;
  
  // Prepare data for theme cloud
  const marketGapThemes = marketGaps?.map(gap => ({
    word: gap.feature,
    count: gap.opportunityScore || 1
  })) || [];
  
  // Format MVP core features for display
  const coreFeatures = mvpRecommendedFeatures?.core?.map(feature => ({
    word: feature.feature,
    count: feature.impactScore || 5
  })) || [];
  
  // Format differentiator features for display
  const differentiatorFeatures = mvpRecommendedFeatures?.differentiators?.map(feature => ({
    word: feature.feature,
    count: feature.impactScore || 3
  })) || [];
  
  // Get formatted date
  const formattedDate = new Date(analysisDate).toLocaleDateString();
  
  // Score backgrounds
  const getScoreBackground = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-blue-100 text-blue-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Modern header with gradient and glassy effect */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-t-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-indigo-500 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {appsAnalyzed?.length === 1 ? 'App' : 'Market'} Opportunity Analysis
              </h2>
              <div className="mt-1 text-indigo-100 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">
                  {formattedDate}
                </span>
                
                <span className="mx-2">•</span>
                
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">
                  {appsAnalyzed?.length || 0} {appsAnalyzed?.length === 1 ? 'app' : 'apps'} analyzed
                </span>
              </div>
            </div>
            
            {/* AI Badge */}
            <div className="mt-4 sm:mt-0 flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
              <svg className="w-5 h-5 mr-1.5 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-sm font-medium">AI-Powered Analysis</span>
            </div>
          </div>
          
          {/* Data quality warning */}
          {dataQuality && (
            dataQuality.error ? (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white/90">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    Limited Review Data
                  </span>
                </div>
                
                <div className="mt-2 pl-7">
                  {dataQuality.reviewCollection ? (
                    <div>
                      <p className="mb-2 text-white/80">Review status for selected apps:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-3 text-white/80">
                        {Object.entries(dataQuality.reviewCollection).map(([appId, info]) => (
                          <li key={appId}>
                            App ID {appId.slice(-4)}: {info.hasReviews ? 
                              `${info.count} reviews found` : 
                              'No reviews found'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  
                  <p className="font-medium mb-2 text-white/90">Our AI is still working with limited data:</p>
                  <ul className="list-disc pl-5 space-y-1 text-white/80">
                    <li>We've used broader market patterns to fill gaps</li>
                    <li>Try apps with more reviews for even better results</li>
                    <li>Select 3-5 apps for more comprehensive analysis</li>
                  </ul>
                </div>
              </div>
            ) : 
            dataQuality.appsWithReviews < dataQuality.totalApps && (
              <div className="mt-6 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white/90 flex items-start">
                <svg className="w-5 h-5 mr-2 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">
                    Partial data: Only {dataQuality.appsWithReviews} of {dataQuality.totalApps} apps have reviews
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Our AI has compensated for missing data, but results may be more accurate with more reviews.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
            
      {/* Opportunity Score with modern design */}
      <div className="bg-white px-8 py-10 border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Score visualization */}
          <div className="lg:col-span-4">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Opportunity Score
              </h3>
              
              <div className="relative">
                {/* Score circle with gradient */}
                <div 
                  className={`relative z-10 rounded-full h-40 w-40 flex items-center justify-center 
                    bg-gradient-to-br ${
                    (mvpOpportunityScore?.score >= 8)
                      ? 'from-green-500 to-emerald-600'
                      : (mvpOpportunityScore?.score >= 6)
                        ? 'from-blue-500 to-indigo-600'
                        : (mvpOpportunityScore?.score >= 4)
                          ? 'from-yellow-400 to-amber-500'
                          : (mvpOpportunityScore?.score > 0)
                            ? 'from-red-400 to-red-600'
                            : 'from-gray-400 to-gray-500'
                  } shadow-xl`}
                >
                  <div className="bg-white rounded-full h-32 w-32 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br
                        ${
                        (mvpOpportunityScore?.score >= 8)
                          ? 'from-green-500 to-emerald-600'
                          : (mvpOpportunityScore?.score >= 6)
                            ? 'from-blue-500 to-indigo-600'
                            : (mvpOpportunityScore?.score >= 4)
                              ? 'from-yellow-400 to-amber-500'
                              : (mvpOpportunityScore?.score > 0)
                                ? 'from-red-400 to-red-600'
                                : 'from-gray-400 to-gray-500'
                      }">
                        {(mvpOpportunityScore?.score === 0 && (!marketGaps || marketGaps.length === 0))
                          ? 'N/A'
                          : mvpOpportunityScore?.score || '?'
                        }
                      </div>
                      <div className="text-gray-400 text-sm font-medium">out of 10</div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-indigo-50 transform -translate-x-3 -translate-y-3 z-0"></div>
                
                {/* Score label */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-1 rounded-full shadow-md border border-gray-100 z-20">
                  <span className={`font-bold ${
                    (mvpOpportunityScore?.score >= 8)
                      ? 'text-green-600'
                      : (mvpOpportunityScore?.score >= 6)
                        ? 'text-blue-600'
                        : (mvpOpportunityScore?.score >= 4)
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                  }`}>
                    {(mvpOpportunityScore?.score >= 8)
                      ? 'Excellent'
                      : (mvpOpportunityScore?.score >= 6)
                        ? 'Good'
                        : (mvpOpportunityScore?.score >= 4)
                          ? 'Moderate'
                          : 'Limited'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Opportunity details */}
          <div className="lg:col-span-8">
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {appsAnalyzed?.length === 1 ? 'App' : 'Market'} Opportunity Assessment
              </h3>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl mb-4 flex-grow">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {mvpOpportunityScore?.reasoning || 'Analyzing available data to identify market opportunities.'}
                </p>
                
                {/* Show action hint if no data */}
                {mvpOpportunityScore?.score === 0 && (!marketGaps || marketGaps.length === 0) && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                    Try selecting apps with more reviews for better analysis results.
                  </div>
                )}
              </div>
              
              {/* Show base features if available */}
              {mvpOpportunityScore?.baseFeatures && mvpOpportunityScore.baseFeatures.length > 0 && (
                <div>
                  <h4 className="text-md font-bold text-gray-700 mb-3">Key Features to Consider:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mvpOpportunityScore.baseFeatures.map((feature, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-medium rounded-full shadow-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'overview' 
              ? 'border-b-2 border-purple-500 text-purple-700' 
              : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            Feature Recommendations
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'gaps' 
              ? 'border-b-2 border-purple-500 text-purple-700' 
              : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('gaps')}
          >
            Market Gaps
          </button>
          {aiInsights && (
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'ai' 
                ? 'border-b-2 border-purple-500 text-purple-700' 
                : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('ai')}
            >
              AI Insights
            </button>
          )}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Core MVP Features
              </h3>
              {coreFeatures.length > 0 ? (
                <>
                  <ThemeCloud themes={coreFeatures} type="mvp" />
                  <div className="mt-4">
                    <ul className="space-y-2">
                      {mvpRecommendedFeatures.core.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-0.5 text-amber-500">•</div>
                          <p className="text-gray-700">{feature.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No core feature recommendations available</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Differentiator Features
              </h3>
              {differentiatorFeatures.length > 0 ? (
                <>
                  <ThemeCloud themes={differentiatorFeatures} type="opportunity" />
                  <div className="mt-4">
                    <ul className="space-y-2">
                      {mvpRecommendedFeatures.differentiators.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-0.5 text-purple-500">•</div>
                          <p className="text-gray-700">{feature.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No differentiator feature recommendations available</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'gaps' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Identified Market Gaps
            </h3>
            {marketGapThemes.length > 0 ? (
              <>
                <ThemeCloud themes={marketGapThemes} type="gap" />
                <div className="mt-6 space-y-4">
                  {marketGaps.map((gap, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-medium text-gray-800">{gap.feature}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBackground(gap.opportunityScore)}`}>
                          Score: {gap.opportunityScore}/10
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{gap.painPoint}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          User Impact: {gap.impact}/10
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          Market Spread: {gap.marketSpread}/10
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                          Mentions: {gap.userMentions}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">No market gaps identified</p>
            )}
          </div>
        )}
        
        {activeTab === 'ai' && aiInsights && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              AI-Generated Insights
            </h3>
            
            {aiInsights.painPoints && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-2">Pain Points</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {Array.isArray(aiInsights.painPoints) 
                    ? aiInsights.painPoints.map((point, i) => <li key={i}>{point}</li>)
                    : <li>{aiInsights.painPoints}</li>
                  }
                </ul>
              </div>
            )}
            
            {aiInsights.marketGaps && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-2">Market Gaps</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {Array.isArray(aiInsights.marketGaps) 
                    ? aiInsights.marketGaps.map((gap, i) => <li key={i}>{gap}</li>)
                    : <li>{aiInsights.marketGaps}</li>
                  }
                </ul>
              </div>
            )}
            
            {aiInsights.exploitableFeatures && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-2">Exploitable Features</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {Array.isArray(aiInsights.exploitableFeatures) 
                    ? aiInsights.exploitableFeatures.map((feature, i) => <li key={i}>{feature}</li>)
                    : <li>{aiInsights.exploitableFeatures}</li>
                  }
                </ul>
              </div>
            )}
            
            {aiInsights.recommendations && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-2">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {Array.isArray(aiInsights.recommendations) 
                    ? aiInsights.recommendations.map((rec, i) => <li key={i}>{rec}</li>)
                    : <li>{aiInsights.recommendations}</li>
                  }
                </ul>
              </div>
            )}
            
            {aiInsights.opportunityScore && (
              <div className="p-4 border border-gray-200 rounded-lg bg-purple-50">
                <div className="flex items-center">
                  <div className="mr-3 bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-sm">
                    <span className="text-xl font-bold text-purple-800">{aiInsights.opportunityScore}/10</span>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Opportunity Score</h4>
                    <p className="text-sm text-gray-600">{aiInsights.scoreJustification}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* If AI returns raw insights instead of structured data */}
            {aiInsights.rawInsights && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-md font-medium text-gray-800 mb-2">Analysis</h4>
                <p className="text-gray-600 whitespace-pre-line">{aiInsights.rawInsights}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}