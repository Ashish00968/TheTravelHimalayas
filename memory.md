# Project Memory: The Himalayan Trails

**Last Session End**: 2026-09-01
**Phase**: 3 In Progress (Newsletter skipped)

## What Was Built
- **Interactive Itinerary Mapping**: Upgraded `GlobalMapClient` and `LocationMapClient` to trace full trek paths on the 3D Mapbox terrain using GeoJSON `LineString` paths.
- **Deep Content Backfill**: Flesh out detailed itineraries, packing lists, and FAQS for Uttarakhand (Kedarnath, Har Ki Dun, Chopta Tungnath) and Ladakh (Markha Valley).
- **Core Entities Framework**: Standardized data structure for Treks, Peaks, Lakes, Passes, Villages, Monasteries, and Campgrounds.
- **Interactive Planning Tools (`/plan`)**: Trek Finder, Trek Comparison, Budget Calculator, Packing List Generator, Season Finder.
- **Geospatial Discovery (`/map`)**: Interactive `react-map-gl` web viewer rendering Mapbox datasets.
- **Data Scaffolding & SEO**: Programmatic generation of `TouristTrip`, `Mountain`, and `FAQPage` JSON-LD schemas.
- **UI Architecture**: Cinematic glassmorphism aesthetic built on strict Tailwind CSS tokens.

## Core Decisions Made
- Skipped Newsletter API integration for now.
- Used synthetic mock coordinates for `pathCoords` to enable the map line-drawing feature until real GPS `.gpx` tracks are acquired.
- Kept the `ssr: false` Mapbox implementation purely on the client via `next/dynamic` to evade Next.js SSR Webpack collisions with GL bindings.
- All tools currently rely on hardcoded TypeScript data (`src/data/*.ts`). We purposefully deferred databases (PostgreSQL/Supabase).

## Current State
- The repository is compiling flawlessly.
- Zero TypeScript errors (`tsc --noEmit`).
- Zero ESLint violations (`npm run lint`).
- 110/110 pages statically rendering successfully.

## Next Steps
- Newsletter API Integration: Finish the `/api/newsletter` route hooking the footer newsletter signup into Resend/ConvertKit.
- Scale out the `atlas.ts` datasets further if needed.
- Shift focus toward Phase 2/4 scope: potentially introducing user accounts, or hooking into a live Mountain Weather API for the `/conditions` page.
