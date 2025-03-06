# App Review Analyzer

A tool for indie hackers to find market gaps by analyzing iOS app reviews.

## Features

- Search for iOS apps by name or category
- Scrape reviews (both positive and negative) from these apps
- Analyze sentiment and find common themes/complaints
- Highlight gaps between what users want and what existing apps provide
- Save data for personal market research

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: Next.js (App Router) with Tailwind CSS
- **Data Storage**: Simple JSON files locally
- **Key Dependencies**:
  - app-store-scraper for getting app data
  - natural.js for basic NLP/sentiment analysis
  - react-query for data fetching
  - chart.js for visualizations

## Project Structure

```
app-review-analyzer/
├── backend/                  # Express backend
│   ├── server.js             # Express server setup
│   ├── routes/               # API routes
│   │   ├── apps.js           # App search endpoints
│   │   ├── reviews.js        # Review scraping endpoints
│   │   └── analysis.js       # Analysis endpoints
│   ├── services/             # Business logic
│   │   ├── appStore.js       # App Store API integration
│   │   ├── reviews.js        # Review scraping logic
│   │   └── analysis.js       # Sentiment and theme analysis
│   └── utils/                # Helper functions
│       └── storage.js        # File storage utilities
│
├── frontend/                 # Next.js frontend
│   ├── app/                  # App Router
│   │   ├── page.js           # Home page
│   │   ├── layout.js         # Root layout
│   │   ├── search/           # Search page
│   │   │   └── page.js
│   │   ├── app/[id]/         # App details page
│   │   │   └── page.js
│   │   └── analysis/[id]/    # Analysis results page
│   │       └── page.js
│   ├── components/           # Reusable components
│   │   ├── ui/               # UI components
│   │   ├── AppCard.js        # App display card
│   │   ├── ReviewList.js     # Review display component
│   │   ├── SentimentChart.js # Sentiment visualization
│   │   └── ThemeCloud.js     # Theme/keyword visualization
│   ├── lib/                  # Frontend utilities
│   │   └── api.js            # API client functions
│   └── public/               # Static assets
│
├── data/                     # Data storage
│   ├── reviews/              # Scraped reviews
│   ├── analysis/             # Analysis results
│   └── reports/              # Saved reports
│
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Rate Limiting Considerations

The App Store API has rate limits that may affect the scraping capabilities:
- Limit requests to avoid IP blocking
- Implement delays between requests
- Consider caching results to minimize API calls

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/app-review-analyzer.git

# Change directory
cd app-review-analyzer

# Install dependencies
npm install
```

## Usage

### Basic Usage

```bash
# Start the application
npm start
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```
# Optional: OpenAI API key for deeper analysis
OPENAI_API_KEY=your_openai_api_key
```

## How It Works

1. **Data Collection**: The app scrapes reviews from specified iOS apps
2. **Sentiment Analysis**: Reviews are analyzed for sentiment (positive/negative)
3. **Theme Extraction**: Common themes are identified across reviews
4. **Gap Analysis**: The app compares positive and negative reviews to identify opportunities
5. **Reporting**: Results are presented in an easy-to-understand format

## License

MIT


The App Review Analyzer works like this:

  1. Search for iOS Apps: You can search for any iOS app by keyword or browse by
  categories like Weather, Productivity, etc.
  2. View App Details: After finding an app, you can see its basic information like
   ratings, developer, and description.
  3. Fetch Reviews: Click the "Fetch Reviews" button to collect actual user reviews
   from the App Store. The system pulls up to 200 recent reviews.
  4. Analyze Reviews: Hit "Analyze App" to automatically process all those reviews
  and identify:
    - Sentiment (how many positive vs. negative reviews)
    - Common themes in positive feedback
    - Common complaints and problems
    - Potential market gaps
  5. Discover Opportunities: The analysis highlights what users love, what they
  hate, and where current apps are falling short. These gaps represent
  opportunities for new apps or features.

  The app uses natural language processing to understand review text and organize
  it into meaningful insights, all presented in a user-friendly dashboard with
  charts and visualizations.