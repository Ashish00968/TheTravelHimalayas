# Data Schema Guide

This document outlines how content is managed in The Travel Himalayas project. Since we are using static Next.js Generation without a CMS, all data must adhere to the TypeScript interfaces defined in `src/data/types.ts`.

## 1. Content Entities

### Trek (`src/data/treks.ts`)
- **Core fields**: `slug`, `title`, `region`, `description`
- **Trek Details**: `difficulty` (Easy | Moderate | Difficult | Challenging), `duration`, `distance`, `maxAltitude`, `bestSeason`
- **Rich Content**: `overview`, `routeDescription`
- **Structured Arrays**: `itinerary` (day, title, description), `packingList`, `faqs`
- **Media**: `images`, `heroImage`

### Peak (`src/data/peaks.ts`)
- Similar to Treks but includes specific mountaineering fields:
- `height` (number), `expeditionSeason`, `baseCamp`
- `climbingRoute`, `expeditionDetails`, `gearRequirements`

### Region (`src/data/regions.ts`)
- Used for topic clusters (e.g., Kullu-Manali, Spiti).
- Includes `overview` and `travelInfo` for getting there, permits, etc.

### Guide (`src/data/guides.ts`)
- Standalone articles or packing guides.
- Includes `category`, `author`, `content` (Markdown/HTML), and `relatedGuides`.

## 2. Best Practices for Adding Content
1. **Never mutate slugs:** Changing a `slug` will break URLs and SEO. If a slug must change, set up a 301 redirect in `next.config.ts`.
2. **Image Optimization:** Always upload images to Cloudinary first. Use the Cloudinary public ID in the `images` and `heroImage` fields. Do not store massive JPGs in the Git repository.
3. **Data Integrity:** Run `npm run build` after adding new data to ensure the TypeScript compiler verifies all required fields are present.
