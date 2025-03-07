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
      {/* Header section */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">MVP Opportunity Analysis</h2>
          <div className="text-sm text-gray-500">
            Analyzed {appsAnalyzed?.length || 0} apps • {formattedDate}
          </div>
        </div>
        
        {/* Data quality warning */}
        {dataQuality && dataQuality.appsWithReviews < dataQuality.totalApps && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>
                Limited data: Only {dataQuality.appsWithReviews} of {dataQuality.totalApps} apps have reviews. Results may be incomplete.
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Opportunity Score */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="mr-4">
            <div className={`text-4xl font-bold rounded-full h-20 w-20 flex items-center justify-center ${
              (mvpOpportunityScore?.score === 0 && (!marketGaps || marketGaps.length === 0))
                ? 'bg-gray-100 text-gray-600' 
                : getScoreBackground(mvpOpportunityScore?.score || 0)
            }`}>
              {(mvpOpportunityScore?.score === 0 && (!marketGaps || marketGaps.length === 0))
                ? 'N/A'
                : `${mvpOpportunityScore?.score || '?'}/10`
              }
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Opportunity Score
            </h3>
            <p className="text-gray-600">
              {mvpOpportunityScore?.reasoning || 'No opportunity score available'}
            </p>
            
            {/* Show action hint if no data */}
            {mvpOpportunityScore?.score === 0 && (!marketGaps || marketGaps.length === 0) && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-sm text-blue-700">
                Try selecting different apps with more reviews for better analysis results.
              </div>
            )}
            
            {/* Show base features if available */}
            {mvpOpportunityScore?.baseFeatures && mvpOpportunityScore.baseFeatures.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Recommended base features:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mvpOpportunityScore.baseFeatures.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
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