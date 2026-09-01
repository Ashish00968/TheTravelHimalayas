# The Himalayan Trails

The definitive English-language guide and atlas for high-altitude trekking and mountaineering across Jammu & Kashmir, Himachal Pradesh, Ladakh, and Uttarakhand.

## Overview

A high-performance, SEO-optimized travel platform built with Next.js 15 (App Router). It features static site generation (SSG) for all routes, Schema.org JSON-LD structured data, dynamic breadcrumbs, and a sleek, deep-black obsidian editorial design.

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI & Styling:** React 19, Tailwind CSS, Framer Motion
- **Design System:** Deep Black Obsidian Theme (`#000000` base, `#0c0c0e`/`#121216` surfaces, Action Blue `#0066cc` accents)
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Data Source:** Local static TypeScript data files (`src/data/*.ts`)

## Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run TypeScript check
npx tsc --noEmit

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the website.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Core architecture, routing, and stack.
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) — Data models for the Atlas, Treks, Peaks, and Guides.
- [ROADMAP.md](./ROADMAP.md) — Launch plan, SEO strategy, and milestones.
- [memory.md](./memory.md) — Session decisions, recent updates, and context.
- [ui-registry.md](./ui-registry.md) — UI component registry and design tokens.
