const inquirer = require('inquirer');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { searchApps } = require('./lib/appStore');
const { fetchReviews } = require('./lib/reviews');
const { analyzeReviews } = require('./lib/analysis');
const { generateReport } = require('./lib/report');
const config = require('./config');

// Ensure data directories exist
function ensureDirectoriesExist() {
  const dirs = [
    path.join(__dirname, 'data'),
    path.join(__dirname, 'data/reviews'),
    path.join(__dirname, 'data/analysis'),
    path.join(__dirname, 'reports')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function main() {
  console.log(colors.cyan.bold('\n🔍 APP REVIEW ANALYZER 🔍'));
  console.log(colors.cyan('Find market gaps by analyzing app reviews\n'));

  // Ensure directories exist
  ensureDirectoriesExist();

  // Step 1: Ask user for app category or specific app
  const { searchType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'searchType',
      message: 'How would you like to search for apps?',
      choices: [
        { name: 'Search by category', value: 'category' },
        { name: 'Search by keyword', value: 'keyword' },
        { name: 'Enter specific app ID', value: 'appId' }
      ]
    }
  ]);

  let apps = [];
  
  if (searchType === 'category') {
    const { category } = await inquirer.prompt([
      {
        type: 'list',
        name: 'category',
        message: 'Select an app category:',
        choices: [
          { name: 'Weather', value: 6002 },
          { name: 'Productivity', value: 6007 },
          { name: 'Photo & Video', value: 6008 },
          { name: 'Health & Fitness', value: 6017 },
          { name: 'Finance', value: 6015 },
          { name: 'Social Networking', value: 6005 }
        ]
      }
    ]);
    
    console.log(colors.yellow(`\nSearching for top apps in the selected category...`));
    apps = await searchApps({ category });
  } else if (searchType === 'keyword') {
    const { keyword } = await inquirer.prompt([
      {
        type: 'input',
        name: 'keyword',
        message: 'Enter a keyword to search for apps:',
        validate: input => input.length > 0 ? true : 'Please enter a keyword'
      }
    ]);
    
    console.log(colors.yellow(`\nSearching for apps matching "${keyword}"...`));
    apps = await searchApps({ term: keyword });
  } else {
    const { appId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'appId',
        message: 'Enter the App Store ID:',
        validate: input => /^\d+$/.test(input) ? true : 'Please enter a valid numeric App ID'
      }
    ]);
    
    try {
      const appInfo = await searchApps({ id: appId });
      apps = appInfo.length ? [appInfo[0]] : [];
    } catch (error) {
      console.error(colors.red(`Error retrieving app with ID ${appId}:`), error.message);
      return;
    }
  }

  // Step 2: Select apps to analyze
  if (apps.length === 0) {
    console.log(colors.red('No apps found. Please try a different search.'));
    return;
  }

  const { selectedApps } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedApps',
      message: 'Select apps to analyze (up to 5):',
      choices: apps.map(app => ({
        name: `${app.title} (Rating: ${app.score})`,
        value: app.id
      })),
      validate: input => input.length > 0 && input.length <= 5 ? 
        true : 'Please select between 1 and 5 apps'
    }
  ]);

  // Step 3: Collect reviews
  console.log(colors.yellow('\nFetching reviews for selected apps...'));
  const reviews = {};
  
  for (const appId of selectedApps) {
    const appInfo = apps.find(app => app.id === appId);
    console.log(colors.gray(`- Fetching reviews for ${appInfo.title}...`));
    reviews[appId] = await fetchReviews(appId);
    console.log(colors.green(`  ✓ Retrieved ${reviews[appId].length} reviews`));
  }

  // Step 4: Analyze reviews
  console.log(colors.yellow('\nAnalyzing reviews...'));
  const analysisResults = await analyzeReviews(reviews, apps);
  
  // Step 5: Generate report
  console.log(colors.yellow('\nGenerating market gap report...'));
  const report = await generateReport(analysisResults, apps);
  
  // Step 6: Display findings
  console.log(colors.green.bold('\n📊 MARKET GAP ANALYSIS REPORT 📊\n'));
  
  // Display key findings
  console.log(colors.cyan.underline('Key Market Gaps Identified:'));
  report.marketGaps.forEach((gap, i) => {
    console.log(colors.white(`\n${i+1}. ${gap.feature}`));
    console.log(colors.gray(`   - Pain Point: ${gap.painPoint}`));
    console.log(colors.gray(`   - User Impact: ${gap.impact}/10`));
    console.log(colors.gray(`   - Competition Gap: ${gap.competitionGap}/10`));
    console.log(colors.gray(`   - Opportunity Score: ${gap.opportunityScore}/10`));
  });

  // Ask if user wants to save the report
  const { saveReport } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'saveReport',
      message: 'Would you like to save this report?',
      default: true
    }
  ]);

  if (saveReport) {
    const reportPath = path.join(__dirname, 'reports', `market_gap_report_${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(colors.green(`\nReport saved to ${reportPath}`));
  }

  console.log(colors.cyan.bold('\nHappy building! 🚀'));
}

main().catch(err => {
  console.error(colors.red('An error occurred:'), err);
});
