# App Review Analyzer Frontend

This is the frontend for the App Review Analyzer, a tool for indie hackers to find market gaps by analyzing iOS app reviews.

## Features

- Search for iOS apps by name or category
- View and analyze app reviews
- Visualize sentiment and common themes
- Identify market gaps and opportunities
- Save and manage analysis reports

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query
- **Visualizations**: Chart.js
- **Backend API**: Express.js (see `/backend` directory)

## Getting Started

First, make sure the backend server is running (see main README.md).

Then, install dependencies and run the development server:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/                  # App Router
│   ├── page.js           # Home page
│   ├── layout.js         # Root layout
│   ├── search/           # Search page
│   │   └── page.js
│   ├── app/[id]/         # App details page
│   │   └── page.js
│   ├── reports/          # Reports page
│   │   └── page.js
│   └── market-gaps/      # Market gaps page
│       └── page.js
├── components/           # Reusable components
│   ├── AppCard.js        # App display card
│   ├── ReviewList.js     # Review display component
│   ├── SentimentChart.js # Sentiment visualization
│   └── ThemeCloud.js     # Theme/keyword visualization
└── lib/                  # Frontend utilities
    └── api.js            # API client functions
```

## API Integration

The frontend communicates with the backend API to:

1. Search for apps in the App Store
2. Fetch reviews for specific apps
3. Analyze reviews for sentiment and themes
4. Identify market gaps across multiple apps

All API calls are handled through the functions in `lib/api.js`.

## Deployment

This is an MVP for personal use, so deployment instructions are not included. However, you can deploy this Next.js application using services like Vercel or Netlify. 