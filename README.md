# DFW Fan Compass

A mobile-first PWA helping international football fans navigate Dallas-Fort Worth during FIFA World Cup 2026. Live place discovery powered by Google Places API, match-day transit guides, multi-language support, and directions planning.

## Features

- **Map Explorer** — Live nearby search for restaurants, bars, parking, hotels, and essentials
- **Match Day Mode** — Select your match, get stadium transit info, weather, and pre-configured map
- **Directions Planner** — Transit, driving, and walking routes with quick presets
- **Visitor Essentials** — Practical guides in EN, ES, PT, FR, DE
- **9-Match Schedule** — All Dallas Stadium fixtures including the semi-final
- **PWA** — Installable, works offline for static content

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en`.

The app runs in **demo mode** without API keys, showing sample place data and mock directions.

## API Keys

### Google Maps Platform

1. Create a project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable: **Maps JavaScript API**, **Places API (New)**, **Directions API**
3. Create two keys (recommended):
   - `GOOGLE_MAPS_API_KEY` — server-side only (Places + Directions). Restrict by IP or API.
   - `NEXT_PUBLIC_GOOGLE_MAPS_KEY` — client-side map rendering. Restrict by HTTP referrer.

### OpenWeather (optional)

Get a free key at [openweathermap.org](https://openweathermap.org/api) for live match-day weather.

## Cost Notes

Google Places Nearby Search bills per request. The app caches responses (30 min for search, 24 hr for details) and uses tight field masks to minimize cost. Google Maps Platform includes a $200/month free credit.

## Tech Stack

- Next.js 16 (App Router)
- next-intl (5 locales)
- Tailwind CSS v4
- Google Maps JS API + Places API (New) + Directions API
- Serwist (PWA)

## Deploy to Vercel

```bash
npx vercel
```

Set environment variables in the Vercel dashboard. No extra config needed.

## Project Structure

```
src/
├── app/[locale]/     # Localized pages
├── app/api/          # Places, directions, weather proxies
├── components/       # UI, map, match-day, directions
├── data/             # Anchors, matches, essentials
├── lib/              # Google API clients, cache, geo
├── messages/         # i18n JSON (en, es, pt, fr, de)
└── i18n/             # next-intl routing
```

## License

MIT
