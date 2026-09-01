# Architecture Blueprint — The Himalayan Trails

## 1. What We Are Building
A high-performance, SEO-optimized authority encyclopedia and expedition atlas focused on Himalayan trekking, high-altitude physiology, and mountaineering. It features static site generation (SSG) for all 98 content pages, structured data (JSON-LD) for rich search results, and a minimalist, deep-black obsidian editorial aesthetic.

## 2. Technical Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **UI & Styling:** Tailwind CSS, Framer Motion (for page transitions, tab switches, and card animations)
- **Design System:** Deep Black Obsidian Theme (Pitch Black `#000000` base, Surface Tiles `#0c0c0e`/`#121216`, Accents `#0066cc`/`#0071e3`, Borders `border-white/10`)
- **Icons:** Lucide React
- **Media Engine:** Next.js `<Image />` with `remotePatterns` configured for Unsplash, Pexels, Wikimedia Commons, Cloudinary, and Pixabay
- **Content Engine:** Local type-safe structured TypeScript data files (`src/data/`)

## 3. Core Routing Structure
- `/` — Homepage (Parallax Typography Hero, Ambient Mesh Glows, 4 Territorial Atlas Hubs)
- `/safety` — **Mountain Terms & Safety Hub**:
  - *Mountain Terms (Default Tab)*: Embedded Hike vs. Trek vs. Peak breakdown and 25+ searchable mountain terms.
  - *Mountaineering & Courses Tab*: Alpinism overview, 4 core disciplines (Rock, Snow, Ice, Glacier), National Courses (BMC, AMC, MOI, S&R), and Premier Institutes.
  - *AMS, HAPE & HACE Tab*: High-altitude medicine, early warnings, medication dosages, and descent rules.
  - *Altitude & Oxygen Tab*: Hypoxia mechanics and 1,500m to >8,000m Death Zone scale.
  - *Cold Injury & Protocols Tab*: Hypothermia, frostbite, water disinfection, and 5 Golden Rules.
- `/explore/[state]` — State Hub (Himachal Pradesh, Jammu & Kashmir, Ladakh, Uttarakhand)
- `/explore/[state]/[division]` — **Division/Valley Hubs (`DivisionClient`)**:
  - Interactive top category filter tabs: **All Places**, **Treks**, **Day Hikes**, **Peaks & Expeditions**, **Scenic & Sanctuaries**.
  - Real-time in-division search bar and live count badges.
- `/explore/[state]/[division]/[place]` — **Place & Trail Detail Pages**:
  - Atmospheric hero backdrop + High-impact Featured Landscape Showcase Photo Banner (with elevation badges and zoom).
  - Quick facts sidebar, Day-by-Day Itineraries, Local Insider Tips, Packing Checklists, FAQs, and Lightbox Gallery.
- `/guides` — Knowledge Hub of dispatches, permits, season calendars, and packing lists.
- `/guides/[slug]` — Individual long-form guides and planning articles.
- `/contact` — About & Basecamp Dispatch interface (direct contact channels and territory links).
- `/api/newsletter` — Static API endpoint handling newsletter dispatches.

## 4. Data Architecture (`src/data/`)
- `mountain-safety.ts`: Mountain glossary terms, mountaineering courses (BMC, AMC, MOI, S&R), altitude zones, AMS/HAPE/HACE medical matrix, and cold safety protocols.
- `atlas.ts`: Hierarchical geographic structure (`HimalayaRegion` > `HimalayaSubRegion` > `HimalayaPlace`) mapping treks, day hikes, peaks, and scenic sanctuaries.
- `treks.ts`: Multi-day treks and day hikes with coordinates, itineraries, elevations, seasons, gear lists, and image arrays.
- `peaks.ts`: Mountaineering expedition profiles, routes, technical difficulties, heights, and equipment specs.
- `guides.ts`: Comprehensive planning, permit, and travel guides.

## 5. SEO & Metadata (`src/lib/`)
- `seo.ts` — Dynamic OpenGraph and metadata generators for every page.
- `json-ld.ts` — Generates Schema.org structured data (TouristTrip, Mountain, Article, FAQPage, BreadcrumbList).
- `site.ts` — Centralized brand, domain, and social configuration.
- `search.ts` — Real-time instant search indexing Atlas destinations, guides, and mountain terms.
