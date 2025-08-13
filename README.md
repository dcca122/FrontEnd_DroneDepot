# Drone Depot Frontend

This repository contains the Next.js front end for Drone Depot.

## Requirements
- Node.js 18+

## Setup
1. Install dependencies:
   ```bash
   cd apps/frontend
   npm install
   ```
2. Create a `.env` file based on `.env.example` and set values for:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_DRONEREGION_URL` (optional)

## Development
Run the dev server:
```bash
npm run dev
```

## Build
```bash
npm run build
npm start
```

## Tests
Playwright end‑to‑end tests are in `apps/frontend/tests`.
Run them with:
```bash
npx playwright test
```

## License
MIT
