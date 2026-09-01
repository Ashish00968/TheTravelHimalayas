# The Himalayan Trails — Technical Roadmap

_Last updated: September 2026_

This document is the single strategic reference for the engineering and development of **The Himalayan Trails** (`thehimalayantrails.com`).

---

## 1. What the site is (honest positioning)

**Recommended positioning:** _The definitive English-language guide to trekking the Indian Himalayas, starting with Himachal Pradesh (Kullu, Manali, Tirthan, Spiti) and expanding to Ladakh and Uttarakhand._

This is a strong, winnable niche. "Premium global 8000m expeditions" is a crowded, hard-to-rank space dominated by established operators. A focused regional authority site built on high-performance, deterministic web architecture can rank fast, build trust, and eventually monetize well.

---

## 2. Current State Audit (Phase 1 Complete)

**Tech:** Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion. Clean, modern, fast. Build is 100% green (110 statically generated pages).

**Foundation Achieved in Phase 1:**
- ✅ **Planning Engine**: Shipped `Trek Finder`, `Trek Comparison`, `Budget Calculator`, `Packing Generator`, and `Season Finder`.
- ✅ **Geospatial Maps**: Integrated `react-map-gl` and Mapbox GL with strict `ssr: false` client boundaries.
- ✅ **SEO & A11y**: Fully implemented JSON-LD (`TouristTrip`, `Mountain`, `FAQPage`), 44px tap targets, skip links, and `next/image` optimizations.
- ✅ **Brand & Design**: Stripped arbitrary colors; standardized on cinematic glassmorphism using Tailwind tokens (`bg-surface`, `bg-background`, `text-primary`).
- ✅ **Zero Errors**: Flawless TypeScript compilation and ESLint validation.

---

## 3. Phase 2: Interactive Data & Live Integrations

Now that the static foundation is built, Phase 2 focuses on bringing the data to life with live integrations and deep visual storytelling.

- [x] **Interactive Elevation Profiles**: 
  - Parse the `itinerary` array in `treks.ts` to render dynamic, interactive SVG/Canvas elevation profile charts on individual trek pages.
  - Implement tooltip hover states showing daily altitude gain, camp elevations, and distance.
- [x] **Live Mountain Weather APIs**:
  - Connect a reliable weather API (e.g., OpenWeatherMap or Tomorrow.io) to fetch real-time alpine conditions.
  - Inject this live data into the `/conditions` hub and relevant individual peak/trek pages.
- [x] **Geospatial & Atlas Expansion**:
  - Scale out `src/data/atlas.ts` with deep metadata covering Ladakh (Zanskar, Nubra) and Uttarakhand (Garhwal, Kumaon).
  - Add more custom Mapbox layers (e.g., trail GPS tracks via GeoJSON).
- [ ] **Dynamic Trail Conditions**:
  - Build a frontend mechanism to display "Status" (Open, Snowbound, Closed) for major passes based on the current month and live API data.

---

## 4. Phase 3: User State & Scale (Future Scope)

Once the core discovery engine is finalized, Phase 3 will introduce persistence.

- [ ] **User Authentication**:
  - Integrate a lightweight auth provider (e.g., Clerk or Supabase Auth).
- [ ] **Saved Expeditions & Lists**:
  - Allow authenticated users to save treks to a "Wishlist".
  - Allow users to save their specific gear selections from the `Packing Generator` and cost estimates from the `Budget Calculator` to their profile.
- [ ] **Interactive 3D Terrain mapping**:
  - Upgrade the Mapbox implementation to utilize 3D terrain mapping (`setTerrain`) for an immersive fly-through experience of the mountain ranges.

---

## 5. Logo & Brand Identity

**Concept:** A clean, modern mark that reads at favicon size and feels premium-outdoor (National Geographic / Patagonia tone).

**Brand system:**
- Primary accent: warm orange `#F97316` (sunrise-on-snow).
- Display/serif: **Fraunces** (headings). Body: **Inter**. Both already wired in.
- Dark, cinematic theme with glass surfaces — consistent and on-trend.

**Asset deliverables to produce:**
- `logo-full.svg` (mark + wordmark), `logo-mark.svg` (icon only), light + dark variants.
- Favicon set: `favicon.ico`, `icon.png` (512), `apple-icon.png` (180), `og-default.jpg`.

---

## 6. Where things live in the code

| What | File |
|------|------|
| Brand name, domain, email, social handles, OG image | `src/lib/site.ts` |
| Per-page SEO helper | `src/lib/seo.ts` |
| Structured data (JSON-LD) | `src/lib/json-ld.ts` |
| Sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Newsletter API (connect provider here) | `src/app/api/newsletter/route.ts` |
| Content data | `src/data/{treks,peaks,regions,guides}.ts` |
| Interactive Planning Tools | `src/components/plan/*` |
| Geospatial Mapping Components | `src/components/maps/*` |
