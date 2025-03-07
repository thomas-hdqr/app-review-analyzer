const natural = require('natural');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const analyzer = new natural.SentimentAnalyzer('English', stemmer, 'afinn');
const TfIdf = natural.TfIdf;

// Initialize OpenAI if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Analyze reviews for sentiment and themes
 * @param {Array} reviews - List of reviews to analyze
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeReviews(reviews) {
  try {
    // Separate reviews by rating
    const positiveReviews = reviews.filter(review => review.score >= 4);
    const negativeReviews = reviews.filter(review => review.score <= 2);
    const neutralReviews = reviews.filter(review => review.score === 3);
    
    // Calculate sentiment scores
    const sentimentResults = {
      positive: positiveReviews.length,
      negative: negativeReviews.length,
      neutral: neutralReviews.length,
      total: reviews.length,
      averageScore: reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length,
      sentimentRatio: positiveReviews.length / (negativeReviews.length || 1)
    };
    
    // Extract themes from positive reviews
    const positiveThemes = extractThemes(positiveReviews);
    
    // Extract themes from negative reviews
    const negativeThemes = extractThemes(negativeReviews);
    
    // Identify potential market gaps
    const marketGaps = identifyPotentialGaps(positiveThemes, negativeThemes);
    
    // Use OpenAI for deeper analysis if available
    let aiInsights = null;
    if (openai && process.env.OPENAI_API_KEY) {
      aiInsights = await getAIInsights(reviews, positiveThemes, negativeThemes);
    }
    
    return {
      sentimentAnalysis: sentimentResults,
      positiveThemes,
      negativeThemes,
      marketGaps,
      aiInsights,
      reviewCount: reviews.length,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing reviews:', error);
    throw error;
  }
}

/**
 * Extract common themes from a set of reviews
 * @param {Array} reviews - List of reviews
 * @returns {Array} - List of themes with counts
 */
function extractThemes(reviews) {
  // Skip if no reviews
  if (!reviews.length) return [];
  
  // Combine all review text
  const allText = reviews.map(review => `${review.title || ''} ${review.text || ''}`).join(' ');
  
  // Tokenize and remove stop words
  const tokens = tokenizer.tokenize(allText.toLowerCase());
  const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 
    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
    'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 
    'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 
    'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 
    'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 
    'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
    'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'app', 'use',
    'using', 'used', 'would', 'could', 'get', 'got', 'gets', 'also', 'even', 'like', 'one', 'two',
    'make', 'made', 'making', 'time', 'day', 'days', 'week', 'month', 'year'];
  
  const filteredTokens = tokens.filter(token => 
    token.length > 2 && !stopwords.includes(token) && !token.match(/^\d+$/));
  
  // Use TF-IDF to find important terms
  const tfidf = new TfIdf();
  
  // Add each review as a document
  reviews.forEach(review => {
    const text = `${review.title || ''} ${review.text || ''}`;
    tfidf.addDocument(text);
  });
  
  // Count word frequencies
  const wordCounts = {};
  filteredTokens.forEach(token => {
    wordCounts[token] = (wordCounts[token] || 0) + 1;
  });
  
  // Convert to array and sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .filter(([word, count]) => count >= 3) // Only include words mentioned at least 3 times
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20) // Get top 20 words
    .map(([word, count]) => ({ word, count }));
  
  return sortedWords;
}

/**
 * Identify potential market gaps based on themes
 * @param {Array} positiveThemes - Themes from positive reviews
 * @param {Array} negativeThemes - Themes from negative reviews
 * @returns {Array} - List of potential market gaps
 */
function identifyPotentialGaps(positiveThemes, negativeThemes) {
  // Extract words from themes
  const positiveWords = new Set(positiveThemes.map(theme => theme.word));
  
  // Find negative themes that aren't addressed in positive themes
  const potentialGaps = negativeThemes
    .filter(theme => !positiveWords.has(theme.word))
    .map(theme => ({
      feature: theme.word,
      painPoint: `Users complain about "${theme.word}" but it's not mentioned positively`,
      count: theme.count,
      opportunityScore: Math.min(10, Math.round((theme.count / 5) * 10)) // Scale from 1-10
    }))
    .slice(0, 10); // Top 10 gaps
  
  return potentialGaps;
}

/**
 * Get AI-powered insights from OpenAI
 * @param {Array} reviews - List of reviews
 * @param {Array} positiveThemes - Themes from positive reviews
 * @param {Array} negativeThemes - Themes from negative reviews
 * @returns {Promise<Object>} - AI insights
 */
async function getAIInsights(reviews, positiveThemes, negativeThemes) {
  try {
    if (!openai) return null;
    
    // Sample a subset of reviews for analysis
    const sampleSize = Math.min(reviews.length, 20);
    const sampleReviews = reviews
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, sampleSize)
      .map(review => `"${review.text}" (Rating: ${review.score}/5)`);
    
    // Create prompt for OpenAI
    const prompt = `
      I have ${reviews.length} reviews for an iOS app. Here's a sample:
      
      ${sampleReviews.join('\n\n')}
      
      Positive themes: ${positiveThemes.map(t => t.word).join(', ')}
      Negative themes: ${negativeThemes.map(t => t.word).join(', ')}
      
      Based on these reviews, please provide:
      1. What are the main pain points users experience?
      2. What features do users love the most?
      3. What market gaps or opportunities do you see?
      4. What specific features could a new app implement to exploit these gaps?
      5. What would be your top 3 recommendations for improving this app?
      6. Provide an opportunity score (1-10) for building a new app in this space, with justification.
      
      Format your response as JSON with these keys: painPoints, lovedFeatures, marketGaps, exploitableFeatures, recommendations, opportunityScore, scoreJustification.
    `;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a product analyst specializing in mobile app reviews and identifying market opportunities for MVP development.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    try {
      // Try to parse as JSON
      return JSON.parse(content);
    } catch (e) {
      // If not valid JSON, return as text
      return { rawInsights: content };
    }
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return null;
  }
}

/**
 * Compare analysis of multiple apps
 * @param {Array} analysisResults - List of app analysis results
 * @returns {Promise<Object>} - Comparison results
 */
async function compareAnalysis(analysisResults) {
  try {
    // Extract app IDs
    const appIds = analysisResults.map(result => result.appId);
    
    // Compare sentiment scores
    const sentimentComparison = analysisResults.map(result => ({
      appId: result.appId,
      positivePercentage: (result.analysis.sentimentAnalysis.positive / result.analysis.sentimentAnalysis.total) * 100,
      negativePercentage: (result.analysis.sentimentAnalysis.negative / result.analysis.sentimentAnalysis.total) * 100,
      averageScore: result.analysis.sentimentAnalysis.averageScore
    }));
    
    // Compare themes
    const themeComparison = {
      positive: {},
      negative: {}
    };
    
    // Collect all themes
    analysisResults.forEach(result => {
      // Positive themes
      result.analysis.positiveThemes.forEach(theme => {
        if (!themeComparison.positive[theme.word]) {
          themeComparison.positive[theme.word] = {};
        }
        themeComparison.positive[theme.word][result.appId] = theme.count;
      });
      
      // Negative themes
      result.analysis.negativeThemes.forEach(theme => {
        if (!themeComparison.negative[theme.word]) {
          themeComparison.negative[theme.word] = {};
        }
        themeComparison.negative[theme.word][result.appId] = theme.count;
      });
    });
    
    // Convert to arrays
    const positiveThemeComparison = Object.entries(themeComparison.positive).map(([theme, counts]) => ({
      theme,
      counts
    }));
    
    const negativeThemeComparison = Object.entries(themeComparison.negative).map(([theme, counts]) => ({
      theme,
      counts
    }));
    
    return {
      appIds,
      sentimentComparison,
      positiveThemeComparison,
      negativeThemeComparison
    };
  } catch (error) {
    console.error('Error comparing analysis:', error);
    throw error;
  }
}

/**
 * Identify market gaps based on app analysis
 * @param {Array} analysisResults - List of app analysis results
 * @returns {Promise<Object>} - Market gap analysis
 */
async function identifyMarketGaps(analysisResults) {
  try {
    // Collect all negative themes across apps
    const allNegativeThemes = {};
    
    analysisResults.forEach(result => {
      result.analysis.negativeThemes.forEach(theme => {
        if (!allNegativeThemes[theme.word]) {
          allNegativeThemes[theme.word] = {
            word: theme.word,
            totalCount: 0,
            appCount: 0,
            apps: {},
            ratings: []
          };
        }
        
        allNegativeThemes[theme.word].totalCount += theme.count;
        allNegativeThemes[theme.word].appCount += 1;
        allNegativeThemes[theme.word].apps[result.appId] = theme.count;
        // Store associated app rating
        if (result.analysis.sentimentAnalysis && result.analysis.sentimentAnalysis.averageScore) {
          allNegativeThemes[theme.word].ratings.push(result.analysis.sentimentAnalysis.averageScore);
        }
      });
    });
    
    // Convert to array and sort by total count
    let sortedThemes = Object.values(allNegativeThemes)
      .sort((a, b) => b.totalCount - a.totalCount);
      
    // If we have at least 2 apps, filter for themes appearing in multiple apps
    if (analysisResults.length >= 2) {
      sortedThemes = sortedThemes.filter(theme => theme.appCount >= 2);
    }
    
    // If we still have no themes, include all negative themes regardless of app count
    if (sortedThemes.length === 0) {
      sortedThemes = Object.values(allNegativeThemes)
        .sort((a, b) => b.totalCount - a.totalCount);
    }
    
    // Calculate opportunity score
    const marketGaps = sortedThemes.map(theme => {
      // More sophisticated scoring algorithm
      const userImpact = Math.min(10, Math.round(theme.totalCount / 5)); // How many users mentioned this
      const marketSpread = Math.min(10, Math.round(theme.appCount * 2)); // How widespread is this issue
      const avgRating = theme.ratings.length > 0 
        ? theme.ratings.reduce((sum, rating) => sum + rating, 0) / theme.ratings.length
        : 3; // Default to neutral if no ratings
        
      // Adjust opportunity score based on current app ratings
      // Lower ratings = higher opportunity (space for improvement)
      const ratingFactor = (5 - avgRating) / 2; // Scale: 0-2.5
      
      // Calculate final weighted score
      const opportunityScore = Math.min(10, Math.round(
        (userImpact * 0.4) + (marketSpread * 0.3) + (ratingFactor * 3)
      ));
      
      return {
        feature: theme.word,
        painPoint: `Users across ${theme.appCount} apps complain about "${theme.word}"`,
        impact: userImpact,
        marketSpread: marketSpread,
        competitionGap: Math.min(10, Math.round(theme.appCount * 2)),
        opportunityScore,
        avgCompetitorRating: avgRating.toFixed(1),
        affectedApps: theme.apps,
        userMentions: theme.totalCount
      };
    });
    
    return {
      marketGaps: marketGaps.slice(0, 10), // Top 10 market gaps
      analysisDate: new Date().toISOString(),
      appsAnalyzed: analysisResults.length,
      mvpOpportunityScore: calculateMVPOpportunityScore(marketGaps),
      mvpRecommendedFeatures: identifyMVPFeatures(marketGaps)
    };
  } catch (error) {
    console.error('Error identifying market gaps:', error);
    throw error;
  }
}

/**
 * Calculate an overall MVP opportunity score based on market gaps
 * @param {Array} marketGaps - List of identified market gaps
 * @returns {Object} - MVP opportunity score and reasoning
 */
function calculateMVPOpportunityScore(marketGaps) {
  if (!marketGaps || marketGaps.length === 0) {
    return {
      score: 0,
      reasoning: "No market gaps identified to evaluate opportunity"
    };
  }
  
  // Take top 5 market gaps for MVP consideration
  const topGaps = marketGaps.slice(0, 5);
  
  // Calculate weighted score based on top gaps
  let totalScore = 0;
  let totalWeight = 0;
  
  // Apply diminishing weights (5, 4, 3, 2, 1)
  topGaps.forEach((gap, index) => {
    const weight = 5 - index;
    totalScore += gap.opportunityScore * weight;
    totalWeight += weight;
  });
  
  const weightedScore = Math.round(totalScore / totalWeight);
  
  // Generate reasoning based on score
  let reasoning = "";
  if (weightedScore >= 8) {
    reasoning = "Strong opportunity for a new MVP with multiple high-impact gaps to address";
  } else if (weightedScore >= 6) {
    reasoning = "Good opportunity for an MVP with several meaningful improvements over existing apps";
  } else if (weightedScore >= 4) {
    reasoning = "Moderate opportunity with some potential areas for improvement";
  } else {
    reasoning = "Limited opportunity in this space as existing apps address most user needs";
  }
  
  return {
    score: weightedScore,
    reasoning,
    baseFeatures: topGaps.map(gap => gap.feature).slice(0, 3)
  };
}

/**
 * Identify key features for an MVP based on market gaps
 * @param {Array} marketGaps - List of identified market gaps
 * @returns {Object} - MVP feature recommendations
 */
function identifyMVPFeatures(marketGaps) {
  if (!marketGaps || marketGaps.length === 0) {
    return {
      core: [],
      differentiators: [],
      potential: []
    };
  }
  
  // Top 3 for core features
  const core = marketGaps.slice(0, 3).map(gap => ({
    feature: gap.feature,
    description: `Solve "${gap.painPoint}" with score ${gap.opportunityScore}/10`,
    impactScore: gap.impact
  }));
  
  // Next 2 for differentiators
  const differentiators = marketGaps.slice(3, 5).map(gap => ({
    feature: gap.feature,
    description: `Address "${gap.painPoint}" to stand out`,
    impactScore: gap.impact
  }));
  
  // Next 5 for potential future features
  const potential = marketGaps.slice(5, 10).map(gap => ({
    feature: gap.feature,
    description: `Consider for future updates`,
    impactScore: gap.impact
  }));
  
  return {
    core,
    differentiators,
    potential
  };
}

module.exports = {
  analyzeReviews,
  compareAnalysis,
  identifyMarketGaps
}; 