# Discover Himalayan Trails

The definitive English-language guide, geospatial atlas, and expedition planning platform for high-altitude trekking, peak climbs, and alpine exploration across the North Indian Himalayas (Jammu & Kashmir, Himachal Pradesh, Ladakh, and Uttarakhand).

---

## Overview

**Discover Himalayan Trails** (`discoverhimalayantrails.com`) is a high-performance, authoritative digital platform built with Next.js 15 App Router and React 19. It combines 100% static site generation (SSG), rich Schema.org JSON-LD structured data, interactive 3D satellite mapping (Mapbox GL), and a cinematic Himalayan Midnight-Indigo aesthetic.

### Core Capabilities
- **Geospatial 3D Atlas**: Interactive Mapbox satellite mapping with terrain elevation (1.7x DEM relief), territory-to-valley navigation, and single-focus expedition briefing cards.
- **Trek & Expedition Guides**: Day-by-day itineraries, altitude profiles, trailheads, permit regulations, gear checklists, and local field advice.
- **Planning & Preparation Tools**: Deterministic Trek Finder, Trek Comparison, Budget Calculator, Season Matrix, and Packing List Generator.
- **Mountain Terms & Safety Hub**: Medical protocols for AMS, HAPE, and HACE, altitude illness decision trees, certified mountaineering course guides (BMC, AMC, MOI, S&R), and alpine glossary.
- **Production Performance**: Zero runtime database latency with strongly-typed static TypeScript datasets, AVIF/WebP image optimization, and 100% static pre-rendering (108/108 pages).

---

## Technology Stack

- **Framework:** Next.js 15 (App Router, React 19 Server & Client Components)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS 3.4, Tailwind Animate, CSS Custom Properties
- **Design System:** Himalayan Midnight-Indigo (`#040812` base, `#080e1a` surface, `#0d1422` card) with territory-specific dynamic accent colors (Glacier Blue, Alpenglow Gold, Twilight Violet, Alpine Teal)
- **Animation:** Framer Motion
- **Geospatial & 3D Maps:** Mapbox GL & `react-map-gl` (with WebGL satellite terrain)
- **Icons:** Lucide React
- **Validation:** Zod

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

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser to run the platform.

---

## Documentation Index

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture, routing structure, data flow, and runtime boundaries.
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) — Strongly-typed schemas for Atlas, Treks, Peaks, Safety, and Guides.
- [ROADMAP.md](./ROADMAP.md) — Product roadmap, current milestone tracking, and SEO strategy.
- [ui-registry.md](./ui-registry.md) — Himalayan Design System tokens, component registry, and styling rules.
- [memory.md](./memory.md) — Persistent state, architectural decisions, and current session context.
