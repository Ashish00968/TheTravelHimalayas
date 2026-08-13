# Architecture Blueprint — The Travel Himalayas

## 1. What we are building
A high-performance, SEO-optimized travel authority site focused on Himalayan trekking (specifically Himachal Pradesh). It features static generation (SSG) for all content pages, structured data (JSON-LD) for rich Google search results, and a cinematic, responsive UI.

## 2. Technical Stack
- **Framework:** Next.js 15 (App Router)
- **UI & Styling:** React 19, Tailwind CSS, shadcn/ui, Framer Motion (for parallax and scroll animations)
- **Deployment:** Vercel (Edge caching, static exports)
- **Data Source:** Local static TypeScript files (`src/data/*.ts`) representing a local database without the latency of an external CMS.

## 3. Core Architecture & Routing (`src/app/`)
- `/` - Homepage (Cinematic hero, top treks, regions)
- `/treks/[slug]` - Individual trek itineraries and details
- `/peaks/[slug]` - Expedition details
- `/regions/[slug]` - Regional pillar pages linking to multiple treks (Topic Clusters)
- `/guides/[slug]` - Standalone articles and packing guides
- `/api/newsletter` - Edge function handling newsletter subscriptions

## 4. Data Architecture (`src/data/`)
The project utilizes a static, type-safe data architecture:
- `types.ts` - TypeScript interfaces defining Trek, Peak, Region, and Guide schemas.
- `treks.ts`, `peaks.ts`, `regions.ts`, `guides.ts` - The single source of truth for all content. 
*Decision:* We are keeping this local for now to maximize speed and developer experience, deferring any CMS migration until the content volume strictly requires it (e.g. >100 entries).

## 5. SEO & Metadata (`src/lib/`)
- `seo.ts` - Dynamic OpenGraph and metadata generators for every page.
- `json-ld.ts` - Generates schema.org structured data (Article, Mountain, TouristTrip) injected into `<script type="application/ld+json">`.
- `site.ts` - Centralized brand, domain, and social configuration.

## 6. Assumptions
- Content is updated via PRs and redeployed via Vercel.
- Performance (Core Web Vitals) is the top priority for ranking travel content.
