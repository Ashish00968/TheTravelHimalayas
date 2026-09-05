# Discover Himalayan Trails

> The definitive digital guide, geospatial atlas, and expedition planning platform for high-altitude trekking, peak climbs, and alpine exploration across the North Indian Himalayas (Jammu & Kashmir, Himachal Pradesh, Ladakh, and Uttarakhand).

---

## Platform Overview

**Discover Himalayan Trails** (`discoverhimalayantrails.com`) is a high-performance, authoritative digital platform built with Next.js 15 App Router and React 19. It combines 100% static site generation (SSG), rich Schema.org JSON-LD structured data, interactive 3D satellite mapping (Mapbox GL), and a cinematic Himalayan Midnight-Indigo aesthetic with comprehensive dual-theme (Light & Dark) support.

### Key Capabilities
- **Cinematic Slanting Diagonal Hero**: Cascading typography progression (`Discover` on left → `Himalayan` at center → `Trails` on right) with gentle progressive revelation, continuous mountain panorama, and feathered horizon melt.
- **Geospatial 3D Atlas**: Interactive Mapbox satellite mapping with terrain elevation (1.7x DEM relief), territory-to-valley navigation, and single-focus expedition briefing cards.
- **Trek & Expedition Guides**: Day-by-day itineraries, altitude profiles, trailheads, permit regulations, gear checklists, and local field advice across 59 curated routes.
- **Precision Planning Suite**: Deterministic Trek Finder, Head-to-Head Comparison Matrix, Budget Estimator, Season Matrix, and Packing Checklist Generator.
- **Mountain Safety & Medical Hub**: Clinical medical protocols for AMS, HAPE, and HACE, altitude illness decision trees, and accredited mountaineering course guides (BMC, AMC, MOI, S&R).
- **Offline PWA & Print Ready**: Dynamic Web App Manifest (`/manifest.webmanifest`) and `@media print` paper-guide stylesheets with page-break-proof cards.
- **Zero-Auth Bookmarking**: Client-side saved expeditions drawer powered by React 19 `useSyncExternalStore` with real-time navigation badge.
- **Compressed Single-Card FAQ Engine**: Sleek capsule card with category tags and interactive accordion drawer with pre-rendered Schema.org `FAQPage` structured data.
- **Production Edge Performance**: Zero runtime database latency with strongly-typed static TypeScript datasets, O(1) indexed `placeLocationIndex` resolution, and 100% static pre-rendering (111 pre-rendered routes).

---

## Technology Stack

- **Framework**: Next.js 15 (App Router, React 19 Server & Client Components)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS 3.4, Tailwind Animate, CSS Custom Properties
- **Design System**: Himalayan Midnight-Indigo (`#040812` base, `#080e1a` surface, `#0d1422` card) with dual-theme light mode (`#F8FAFC` base, `#FFFFFF` surface) and territory accents (Glacier Blue, Alpenglow Gold, Twilight Violet, Alpine Teal)
- **Animation**: Framer Motion
- **Geospatial & 3D Maps**: Mapbox GL & `react-map-gl` (with WebGL satellite terrain)
- **Icons**: Lucide React
- **Validation**: Zod
- **Edge Deployment**: Static Export (`output: "export"`) with Cloudflare Pages Functions (`functions/api/newsletter.ts`)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Build production static export
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the platform.
