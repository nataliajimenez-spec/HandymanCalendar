# Isla Prime — Property Management Supply Co.

Marketing site for Isla Prime, a hotel & short-term rental supply company in Puerto Rico.
It is a standalone Next.js app that lives in this folder, separate from the handyman calendar.

## Run locally

```bash
cd isla-prime-supply
npm install
npm run dev   # http://localhost:3000
```

## Where to edit

- `src/content/site.ts`: all copy, contact details, collections, and property types.
- `src/app/`: pages (`/`, `/collections`, `/about`, `/contact`).
- `src/components/`: header, footer, logo, hero illustration, quote form.
- `src/app/globals.css`: brand colors and fonts.

## Status

- Private preview only: pages are marked `noindex` so search engines skip them.
- The catalog is not built yet; `/collections` shows categories with "Catalog coming soon".
- The quote form opens the visitor's email app. It still needs to be connected to a real inbox.
- Contact email and phone in `src/content/site.ts` are placeholders.

## Private deploy (when ready)

Create a separate Vercel project from this repo with **Root Directory** set to `isla-prime-supply`.
Keep **Deployment Protection → Vercel Authentication** on so only your team can view it,
and don't attach a public domain until launch.
