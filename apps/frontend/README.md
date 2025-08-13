This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Scroll-Cinema

`ScrollCinema` is a full-bleed video section used on the home page.

### Props

- `video` – URL to the video source.
- `poster` – image shown before the video loads or when autoplay is disabled.
- `headline`, `bullets`, `cta` – content for the call-to-action panel.

### Behavior

- Videos lazy-load when their section enters the viewport (15% threshold) and use `preload="none"` for performance.
- If the user prefers reduced motion or autoplay fails (e.g. on iOS), the poster is shown with a “Tap to play” button.
- On mobile (`< md`) the layout stacks the video and CTA so buttons never overlap.

CTA animations and video fade‑ins are skipped when `prefers-reduced-motion` is enabled.
