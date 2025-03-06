# App Review Analyzer Development Guide

## Build & Run Commands
```bash
# Development mode (both backend and frontend)
npm run dev

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Build frontend
npm run build

# Production start
npm start

# Setup project
npm run setup
```

## Code Style Guidelines

### Architecture
- Backend: Express.js (CommonJS)
- Frontend: Next.js with App Router (ES Modules)
- Data: Local JSON storage in data/ directory

### Naming Conventions
- Variables/functions: camelCase
- Components: PascalCase
- Constants: UPPER_SNAKE_CASE
- API routes: kebab-case (/api/apps/search)

### Imports
- Backend: CommonJS (`const express = require('express')`)
- Frontend: ES Modules (`import { useState } from 'react'`)

### Error Handling
- Pattern: try/catch with specific status codes (400, 404, 500)
- Format: `{ error: true, message: 'Error description' }`
- Always log errors to console before responding

### Documentation
- Use JSDoc for components, routes and functions
- Group code with section comments
- Document non-obvious logic with inline comments