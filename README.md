# Drone Depot Static Front-End

This repository contains the static HTML/CSS/JS front-end for Drone Depot. It is designed to be deployed on Hostinger or any static file host.

## Structure
```
/ (root)
  index.html
  services.html
  remodel.html
  municipal.html
  about.html
  faq.html
  resources.html
  contact.html
  /legal/privacy.html
  /legal/terms.html
  /css/base.css
  /css/components.css
  /css/layout.css
  /css/pages.css
  /js/main.js
  /assets/
  /favicons/
  robots.txt
  sitemap.xml
```

## Development
No build tools are required. Edit the HTML/CSS/JS files directly.

## Deployment to Hostinger
1. Zip the project files or use git/SSH.
2. Upload to your Hostinger account under `public_html`.
3. Ensure `index.html` is at the root. Other pages sit alongside it.

## Replacing Media
- Replace `assets/hero.mp4` and `assets/hero.webm` with your hero video files.
- Replace `assets/hero-poster.jpg` with a lightweight poster image.
- Place gallery images and other assets in the `assets/` folder.

## Wiring Real APIs
Forms currently POST to `/api/*` endpoints. Update these URLs to point to your production API when ready.

## Analytics Toggle
Set `window.DD_ANALYTICS = true` before loading `js/main.js` to enable analytics beacon calls. Otherwise events log to console.

## License
MIT
