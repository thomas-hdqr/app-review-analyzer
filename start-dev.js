#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.cyan}=== App Review Analyzer - Development Starter ===${colors.reset}\n`);

// Check if backend directory exists
if (!fs.existsSync(path.join(__dirname, 'backend'))) {
  console.error(`${colors.red}Error: Backend directory not found. Make sure you're running this script from the project root.${colors.reset}`);
  process.exit(1);
}

// Check if frontend directory exists
if (!fs.existsSync(path.join(__dirname, 'frontend'))) {
  console.error(`${colors.red}Error: Frontend directory not found. Make sure you're running this script from the project root.${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.yellow}This script will start both the backend and frontend development servers.${colors.reset}`);
console.log(`${colors.yellow}Make sure you have installed all dependencies with 'npm install' first.${colors.reset}\n`);

// Start backend server
console.log(`${colors.cyan}Starting backend server...${colors.reset}`);
const backendProcess = spawn('npm', ['run', 'dev:backend'], { 
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

let backendStarted = false;
let backendPort = null;

backendProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`${colors.dim}[Backend] ${output.trim()}${colors.reset}`);
  
  // Check if server has started
  const portMatch = output.match(/Server running on port (\d+)/);
  if (portMatch && !backendStarted) {
    backendPort = portMatch[1];
    backendStarted = true;
    console.log(`${colors.green}Backend server started on port ${backendPort}${colors.reset}`);
    
    // Start frontend server after backend is ready
    startFrontend(backendPort);
  }
});

backendProcess.stderr.on('data', (data) => {
  console.error(`${colors.red}[Backend Error] ${data.toString().trim()}${colors.reset}`);
});

backendProcess.on('close', (code) => {
  console.log(`${colors.yellow}Backend server process exited with code ${code}${colors.reset}`);
  // If frontend is still running, kill it
  if (frontendProcess) {
    frontendProcess.kill();
  }
});

let frontendProcess = null;

function startFrontend(backendPort) {
  console.log(`${colors.cyan}Starting frontend server...${colors.reset}`);
  
  // Set environment variable for API URL
  const env = { ...process.env, NEXT_PUBLIC_API_URL: `http://localhost:${backendPort}/api` };
  
  frontendProcess = spawn('npm', ['run', 'dev:frontend'], { 
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env
  });
  
  frontendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`${colors.dim}[Frontend] ${output.trim()}${colors.reset}`);
    
    // Check if Next.js server has started
    if (output.includes('- Local:')) {
      console.log(`${colors.green}Frontend server started${colors.reset}`);
      console.log(`\n${colors.bright}${colors.green}Both servers are now running!${colors.reset}`);
      console.log(`${colors.cyan}You can access the application at: ${colors.bright}http://localhost:3000${colors.reset}`);
      console.log(`${colors.yellow}Press Ctrl+C to stop both servers${colors.reset}\n`);
    }
  });
  
  frontendProcess.stderr.on('data', (data) => {
    console.error(`${colors.red}[Frontend Error] ${data.toString().trim()}${colors.reset}`);
  });
  
  frontendProcess.on('close', (code) => {
    console.log(`${colors.yellow}Frontend server process exited with code ${code}${colors.reset}`);
    // If backend is still running, kill it
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Shutting down servers...${colors.reset}`);
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  process.exit(0);
}); 