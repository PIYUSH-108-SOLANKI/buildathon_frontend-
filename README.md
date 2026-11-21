# Autonomous AI SRE Platform — Frontend

Frontend application for the Autonomous AI Site Reliability Engineering (AIA-02) platform.

## Architecture & Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Architecture Readiness**: Prepared for Three.js / React Three Fiber / Drei, Motion for React, and WebSocket telemetry streaming.

## Project Structure

```
frontend/
  src/
    components/     # Reusable UI primitives & components
    features/       # Domain-specific feature modules (topology, incidents, telemetry)
    layouts/        # Shell and layout structures
    pages/          # Page-level views
    hooks/          # Custom React hooks (streaming, state, animation)
    services/       # API & WebSocket connection services
    types/          # TypeScript domain type definitions
    styles/         # Global stylesheets and theme tokens
    data/           # Static constants and mock fallbacks
  public/           # Static public assets
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  .env.example
  README.md
```

## Available Scripts

- `npm run dev`: Starts the local Vite development server
- `npm run build`: Type-checks and creates production build
- `npm run preview`: Previews the production build locally
