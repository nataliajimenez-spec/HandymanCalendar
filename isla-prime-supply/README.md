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
- `src/app/`: pages (`/`, `/catalog`, `/about`, `/contact`, `/sign-in`).
- `src/components/`: header, side menu, footer, logo, hero illustration, starter list planner, quote and sign-in forms.
- `src/app/globals.css`: brand colors and fonts.

## Status

- Private preview only: pages are marked `noindex` so search engines skip them.
- The catalog is not built yet; `/catalog` shows categories with "Online catalog coming soon".
- Sign in is a placeholder screen; real customer accounts still need to be built.
- The quote form opens the visitor's email app. It still needs to be connected to a real inbox.
- Contact email and phone in `src/content/site.ts` are placeholders.

## Private deploy (when ready)

Create a separate Vercel project from this repo with **Root Directory** set to `isla-prime-supply`.
Keep **Deployment Protection → Vercel Authentication** on so only your team can view it,
and don't attach a public domain until launch.
