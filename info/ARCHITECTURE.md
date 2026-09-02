# Architecture Blueprint — The Himalayan Trails

## 1. System Vision & Scope

**The Himalayan Trails** (`thehimalayantrails.com`) is a high-performance, deterministic authority platform and geospatial atlas for high-altitude trekking, peak expeditions, and alpine safety across the North Indian Himalayas.

The platform follows a zero-database, statically pre-rendered architecture (SSG) powering 108 static routes with instant sub-millisecond page loads, rich Schema.org JSON-LD structured data, and high-fidelity 3D Mapbox geospatial exploration.

---

## 2. Technical Stack

- **Framework:** Next.js 15 (App Router with React 19 Server & Client Components)
- **Language:** TypeScript 5 with strict typing and strict null checks
- **Styling:** Tailwind CSS 3.4, Tailwind Animate, `@tailwindcss/typography`
- **Design System:** Himalayan Midnight-Indigo (`#040812` base, `#080e1a` surface, `#0d1422` card) with territory-specific color grading (Kashmir Glacier Blue `#3B82F6`, Himachal Alpenglow Amber `#F59E0B`, Ladakh Twilight Violet `#7C3AED`, Uttarakhand Alpine Teal `#0D9488`)
- **Animations:** Framer Motion (respecting `prefers-reduced-motion`)
- **Geospatial & 3D Mapping:** Mapbox GL with `mapbox-terrain-dem-v1` (1.7x vertical relief exaggeration), satellite-v9 imagery, and space fog
- **Icons:** Lucide React
- **Media Engine:** Next.js `<Image />` with AVIF/WebP image formats and remote patterns for Unsplash, Pexels, Wikimedia, Cloudinary, and Pixabay
- **Data Architecture:** In-memory, typed static datasets with O(1) Map indexing in `src/data/`

---

## 3. Core Routing Structure

```
src/app/
├── (root)/
│   ├── page.tsx                           # Homepage (Parallax Hero, Territory Cards, Field Highlights)
│   ├── layout.tsx                         # Root Layout with Nav, Footer, and Global Metadata
│   ├── sitemap.ts                         # Dynamic XML Sitemap generation for all 108 routes
│   └── robots.ts                          # Robots.txt configuration
├── explore/
│   ├── page.tsx                           # Territories Directory
│   ├── [state]/
│   │   ├── page.tsx                       # Territory Hub (Himachal, J&K, Ladakh, Uttarakhand)
│   │   └── [division]/
│   │       ├── page.tsx                   # Division/Valley Hub (SSG with DivisionClient)
│   │       └── [place]/
│   │           └── page.tsx               # Place & Trail Detail Page (Itinerary, Altitude, Gallery)
├── map/
│   └── page.tsx                           # Full-screen 3D Geospatial Atlas Map
├── plan/
│   ├── page.tsx                           # Planning Hub
│   ├── trek-finder/page.tsx               # Deterministic Multi-Filter Trek Finder
│   ├── compare/page.tsx                   # Head-to-Head Trek Comparison Matrix
│   ├── budget/page.tsx                    # Expedition Budget Calculator
│   ├── packing/page.tsx                   # Dynamic Altitude Packing List Generator
│   └── season/page.tsx                    # Seasonal Weather & Trek Matrix
├── safety/
│   └── page.tsx                           # Mountain Glossary, AMS/HAPE/HACE Medicine, & Course Directory
├── conditions/
│   └── page.tsx                           # Live Alpine Weather & Seasonal Pass Conditions Hub
├── guides/
│   ├── page.tsx                           # Field Guides & Dispatches Knowledge Base
│   └── [slug]/page.tsx                    # Long-form Field Guide Article
├── contact/
│   └── page.tsx                           # Basecamp Dispatch & Contact Interface
└── api/
    └── newsletter/route.ts                # Server Route Handler for Newsletter Submissions
```

---

## 4. Architectural Boundaries

### Server vs. Client Components (RSC Boundary)
- **Server Components (Default):** All page wrappers, layout shells, SEO metadata generators, and static text renderers are React Server Components (RSC). They run strictly at build time (SSG) with zero JavaScript bundle overhead.
- **Client Components (`"use client"`):** Isolate interactive state, browser-only APIs, Mapbox GL instances, Framer Motion animations, and local filter forms.
- **Form States & SSR Safety:** Server Components (such as `Footer.tsx`) use pure CSS `:focus-within` and tailwind state classes rather than attaching React event listeners (`onSubmit`, `onFocus`), ensuring seamless SSG prerendering.

### Geospatial & Map Engine Boundary
- `GlobalMapClient.tsx` is dynamically isolated with browser guards and cleanup routines.
- Event listeners on Mapbox route layers and markers are tracked in `routeListenersRef` to prevent memory leaks during unmounts.
- Marker elements are constructed safely via the DOM API to prevent XSS.
- Manual camera controls are disabled to enforce a curated "one-at-a-time" guided discovery flow.

---

## 5. Data Architecture (`src/data/`)

1. **`atlas.ts`**: The canonical geographic index.
   - Structured 3-tier hierarchy (`HimalayaRegion` > `HimalayaSubRegion` > `HimalayaPlace`).
   - Populated with 100% verified coordinates for all places, treks, peaks, lakes, and passes.
   - Optimized with pre-computed `placeLocationIndex = new Map<string, PlaceLocation>()` providing instant **O(1)** path and region resolution.
2. **`treks.ts`**: Detailed trail datasets including day-by-day itineraries with elevation stats, coordinates, seasons, difficulty ratings, and highlights.
3. **`peaks.ts`**: High-altitude mountaineering profiles (summit elevations, first ascents, climbing routes, technical gear, coordinates).
4. **`mountain-safety.ts`**: High-altitude medical encyclopedia (AMS, HAPE, HACE), altitude zones, mountaineering courses (BMC, AMC, MOI, S&R), and cold-weather protocols.
5. **`guides.ts`**: Verified field dispatches, permit processes, and logistics guides.
6. **`types.ts`**: Shared TypeScript domain interfaces.

---

## 6. SEO, Schema & Search Engine (`src/lib/`)

- **`json-ld.ts`**: Rich Schema.org structured data generators for `TouristTrip`, `Mountain`, `Article`, `FAQPage`, and `BreadcrumbList`.
- **`seo.ts`**: Dynamic OpenGraph, Twitter card, and canonical URL helpers.
- **`site.ts`**: Global platform metadata, contact details, and canonical domain definitions.
- **`search.ts`**: In-memory token-matched search engine indexing places, treks, peaks, guides, and mountain terms with exact route resolution.
