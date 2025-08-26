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

## License
MIT

## Asset paths & cache busting
Run these before deploys:

    make fix-paths
    make bust-cache

This forces absolute /css and /js URLs and bumps a ?cb=<timestamp> query so CDNs/browsers pull fresh files.

## VPS sanity check (Hostinger, Nginx)
Docroot should be: ~/domains/drone-depot.ai/public_html

On the VPS:
    curl -I https://drone-depot.ai/css/base.css  # expect 200 and content-type: text/css

If content-type is not text/css, in /etc/nginx/nginx.conf ensure:
    include /etc/nginx/mime.types;

Reload:
    nginx -t && systemctl reload nginx

Purge Hostinger cache (hPanel > Cache Manager), then hard-refresh the browser.
