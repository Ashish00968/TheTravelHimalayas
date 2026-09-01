# Data Schema Guide

This document outlines how content and geographic routes are structured in The Himalayan Trails. All data is type-safe and defined in `src/data/types.ts` and managed in `src/data/atlas.ts`, `treks.ts`, `peaks.ts`, `mountain-safety.ts`, and `guides.ts`.

## 1. Geographic Atlas Hierarchy (`src/data/atlas.ts`)

The site uses a strict three-tier geographic hierarchy mapped directly to SEO-friendly routes (`/explore/[state]/[division]/[place]`):

```
State (HimalayaRegion)
 └── Division / Valley (HimalayaSubRegion)
      └── Destination / Trail (HimalayaPlace)
```

### HimalayaRegion (State Level)
- `id`: Unique URL slug (e.g., `himachal-pradesh`, `ladakh`, `uttarakhand`, `jammu-kashmir`).
- `name`: Display name (e.g., `Himachal Pradesh`).
- `emoji`: Regional icon.
- `cardDesc`: High-level summary of the territory.
- `subregions`: Array of `HimalayaSubRegion` objects.

### HimalayaSubRegion (Division Level)
- `id`: Division slug (e.g., `kullu`, `lahaul-spiti`, `zanskar`, `garhwal`).
- `name`: Division name (e.g., `Lahaul & Spiti`).
- `tagline`: Editorial tagline for the valley or mountain district.
- `places`: Array of `HimalayaPlace` objects.

### HimalayaPlace (Destination / Trail Level)
- `id`: Place slug (e.g., `beas-kund`, `patalsu-peak`, `chandratal-lake`, `friendship-peak`).
- `name`: Display title.
- `type`: Category (`trek` | `day-hike` | `peak` | `spiritual` | `scenic` | `road` | `lake` | `adventure`).
- `emoji`: Visual identifier (e.g., `🥾` for treks, `🚶` for day hikes, `⛰️` for peaks).
- `elevation`: Max altitude (e.g., `3,700 m`, `5,289 m`).
- `difficulty`: Route rating (`Easy` | `Moderate` | `Difficult` | `Challenging`).
- `duration`: Time needed (e.g., `5 Days`, `1 Day (5-6 hours)`).
- `bestSeason`: Optimal trekking months.
- `heroImage`: Optional high-resolution hero showcase photograph URL.
- `images`: Array of optional gallery photo URLs.
- `overview`: Detailed background text.
- `routeDescription`: Step-by-step route or climbing narrative.
- `itinerary`: Array of `{ day, title, description }`.
- `packingList`: Essential gear checklist.
- `tips`: Field insider recommendations.
- `faqs`: Array of `{ question, answer }`.

---

## 2. Specialized Content Models

### Mountain Terms & Altitude Medicine (`src/data/mountain-safety.ts`)
- **`GlossaryTerm`**: Mountain terminology dictionary (`term`, `localTerm`, `category`, `definition`, `significance`).
- **`MountaineeringCourse`**: Certified courses (`code: BMC | AMC | MOI | S&R`, `name`, `duration`, `eligibility`, `curriculum`, `overview`, `significance`).
- **`ALTITUDE_LEVELS`**: Atmospheric pressure, hypoxia, and oxygen percentage across altitude zones (High Altitude to the >8,000m Death Zone).
- **`ALTITUDE_ILLNESSES`**: Medical matrix for AMS, HAPE, and HACE (`severity`, `urgency`, `symptoms`, `prevention`, `treatment`, `goldenRules`).
- **`SAFETY_PROTOCOLS`**: Hypothermia management, frostbite thaw rules, water disinfection methods, and 5 Golden Rules of Acclimatization.

### Trek (`src/data/treks.ts`)
- Multi-day routes and day hikes with trailhead coordinates (`coords: [lat, lng]`), start points, guide rate estimates (INR/day), itineraries, packing checklists, and permit rules.

### Peak (`src/data/peaks.ts`)
- Mountaineering specifications: summit height in meters (`height`), expedition seasons, base camp locations, climbing route descriptions, gear requirements, and permit guidelines.

### Guide (`src/data/guides.ts`)
- Standalone long-form planning dispatches (`slug`, `title`, `category`, `author`, `description`, `content`, `relatedGuides`).

---

## 3. Best Practices
1. **Preserve Slugs:** Never change existing slugs to protect search engine indexing and permalinks.
2. **Clean Media Integration:** External image CDN domains (`images.unsplash.com`, `images.pexels.com`, `upload.wikimedia.org`, `res.cloudinary.com`, `cdn.pixabay.com`) are configured in `next.config.ts`.
3. **Graceful Fallbacks:** If no image is provided, components render elegant dark glassmorphism typography and badges without broken image placeholders.
