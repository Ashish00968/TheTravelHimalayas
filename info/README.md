# The Travel Himalayas

The definitive English-language guide to trekking the Indian Himalayas, starting with Himachal Pradesh (Kullu, Manali, Tirthan, Spiti).

## Overview

A high-performance, SEO-optimized travel authority site focused on Himalayan trekking. It features static generation (SSG) for all content pages, structured data (JSON-LD) for rich Google search results, and a cinematic, responsive UI.

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI & Styling:** React 19, Tailwind CSS, shadcn/ui, Framer Motion
- **Deployment:** Vercel
- **Data Source:** Local static TypeScript files (`src/data/*.ts`)

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

## Documentation

Please refer to the other files in the `info/` directory for detailed documentation:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Core architecture and routing.
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - Data models for Treks, Peaks, Regions, and Guides.
- [ROADMAP.md](./ROADMAP.md) - Launch plan, SEO strategy, and 1-year roadmap.
- [ui-registry.md](./ui-registry.md) - UI component registry and design patterns.
