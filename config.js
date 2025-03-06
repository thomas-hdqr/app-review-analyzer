require('dotenv').config();

module.exports = {
  // OpenAI API configuration (optional, for deeper analysis)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || null,
    model: 'gpt-3.5-turbo',
  },
  
  // Default categories to analyze
  defaultCategories: [
    6002, // Weather
    6007, // Productivity
    6008, // Photo & Video
    6017, // Health & Fitness
  ],
  
  // Number of reviews to fetch per app
  reviewsPerApp: 200,
  
  // Paths for storing data
  paths: {
    reviews: './data/reviews',
    analysis: './data/analysis',
    reports: './data/reports',
  },
  
  // Analysis settings
  analysis: {
    // Minimum number of mentions to consider a feature/theme significant
    minMentions: 3,
    // Minimum rating to consider a review positive
    positiveThreshold: 4,
  }
};
