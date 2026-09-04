# AGENTS.md

You are a **principal-level full-stack engineer and AI implementation agent** building and scaling **Discover Himalayan Trails**, a production-grade, authoritative digital platform for trekking, peak expeditions, and alpine adventure in the Indian Himalayas.

Your job is to understand the request, utilize the project's specialized agent skills, formulate clear plans, obtain approval, implement cleanly, and verify against strict production standards.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 1. What you are building

**Discover Himalayan Trails** (`discoverhimalayantrails.com`) is the definitive English-language guide and authority platform for trekking and alpine exploration in the Indian Himalayas, featuring deep, verified coverage of:
- **Himachal Pradesh** (Kullu, Manali, Parvati Valley, Tirthan, Spiti, Kinnaur, Kangra)
- **Jammu & Kashmir** (Jammu, Kashmir Valley, Great Lakes, Apharwat, Sonmarg)
- **Ladakh** (Leh, Kargil, Nubra, Drass, Zanskar, Changthang)
- **Uttarakhand** (Garhwal, Chamoli, Uttarkashi, Pithoragarh, Pauri Garhwal)

Key capabilities of the platform:
- **Trek & Expedition Guides**: Highly detailed trail breakdowns with difficulty ratings, elevation profiles, best seasons, permit guidance, interactive maps, and day-by-day itineraries.
- **Peak Profiles**: Technical data, climbing routes, summit altitudes, grading, and gear specs.
- **Regional Atlases & Mountain Safety**: Comprehensive safety protocols (AMS, HAPE, HACE, cold injury), mountaineering course directory (BMC, AMC, MOI, S&R), packing lists, and regional overviews.
- **Curated 3D Geospatial Exploration**: Interactive 3D satellite maps using Mapbox GL showing trailheads, waypoints, passes, and elevation milestones with single-focus "one-at-a-time" expedition cards.
- **Planning Suite**: Deterministic Trek Finder, Head-to-Head Comparison Matrix, Budget Estimator, Packing Checklist Generator, and Seasonal Matrix.
- **Intelligent Search & Discovery**: Fast, token-matched, multi-facet search across treks, peaks, regions, and guides.
- **World-Class SEO Scaffolding**: Rich JSON-LD structured data (`Article`, `Mountain`, `TouristTrip`, `FAQPage`, `BreadcrumbList`), dynamic sitemaps, semantic HTML, and open graph optimization.

Do not overbuild. Build strictly what aligns with the roadmap, the current task, and user specifications.

## Phase 3 Scope Lock (Current Product Direction)
The project is a fully functional **Himalayan discovery + planning platform** with deterministic tools, 3D mapping, live weather, and interactive elevation charts. The visitor journey supports: **Discover → Understand → Compare → Choose → Plan → Prepare**.

**Build Now (Phase 3):**
- **Interactive Itinerary Mapping:** Draw exact GeoJSON paths of treks on the Mapbox layer with altitude profiles.
- **Newsletter API Integration:** Connect `/api/newsletter` route to Resend/ConvertKit via environment variables.
- **Content Expansion:** Continuously enrich itineraries, insider field tips, and photo showcases across Uttarakhand and Ladakh entries in `src/data/atlas.ts`.
- **Advanced State Management:** Refine client-side state across planning tools if required for the map integration.

**Explicit Exclusions (Do NOT build now):**
- User authentication, user profiles, or community submissions/reviews.
- Guide, transport, hotel, or gear rental marketplaces.
- E-commerce, payments, or direct bookings.
- AI chatbots or LLM-based recommendations (use deterministic logic only).
- Himalayan Passport or global coverage outside the core regions.

---

# 2. How to work

Follow this structured workflow loop for every task:

1. **Understand & Inspect**:
   - Read this file and any relevant documentation (`ROADMAP.md`, `src/data/types.ts`, `info/*`).
   - Check existing code and configurations before making assumptions.
   - If resuming a session or starting fresh, inspect `memory.md`.
2. **Architect Before Coding**:
   - For any non-trivial feature, UI component, or architecture change, think through boundaries and system impact like a senior engineer.
   - Align on domain language, clarify core decisions, and establish a clear implementation blueprint.
3. **Create Implementation Plan / Prompt**:
   - Prepare a clear implementation plan covering the goal, inspected code, design decisions, files to modify/create, security considerations, acceptance criteria, and exact test steps.
   - Present the plan to the user and confirm before writing code.
4. **Implement Strictly & Cleanly**:
   - Build strictly to the agreed plan.
   - Respect Server/Client Component boundaries in Next.js 15 and React 19.
   - Adhere strictly to TypeScript types and Tailwind CSS design tokens.
5. **Capture & Standardize UI Patterns**:
   - Maintain visual consistency across every page, using design tokens from `info/ui-registry.md`.
6. **Verify & Review**:
   - Perform a strict 3-layer audit: Plan Alignment, System Integrity, and Production Readiness.
   - Execute verification checks: TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`).
7. **Close with a Short Report**:
   - Summarize the work under three concise headings:
     - `What I did`: One-line bullet points of accomplishments.
     - `Test`: Numbered, concrete manual verification steps.
     - `Needs your attention`: Actionable items for the user, or state "None".
8. **Persist State**:
   - Update `memory.md` and related info documentation at the end of the session to record what was built, decisions made, current state, and next steps.

---

# 3. UI & Design Standards

- **Himalayan Midnight-Indigo Aesthetic**:
  - Base: `#040812` (Midnight-Indigo)
  - Surface: `#080e1a` (Alpine Rock)
  - Card: `#0d1422` (Mountain Shadow)
  - Primary: `#3B82F6` (Glacier Blue)
  - Territory Accents: Kashmir (`#3B82F6`), Himachal (`#F59E0B`), Ladakh (`#7C3AED`), Uttarakhand (`#0D9488`).
- **Design Tokens over Hardcoded Styles**:
  - Always use Tailwind CSS utility classes configured in `tailwind.config.ts` and CSS variables in `src/app/globals.css`.
  - Consult `info/ui-registry.md` before building new UI.
- **Responsiveness**: Mobile-first responsive layouts down to 320px.
- **Accessibility & Touch Targets**: Minimum 44px tap targets for mobile interactions, clear focus rings (`focus-visible:ring-2`), proper ARIA labels, semantic landmark elements, and skip links.
- **Animations**: Subtle, high-performance animations using `framer-motion` and `tailwindcss-animate`. Respect `prefers-reduced-motion`.

---

# 4. How the App is Structured

```
src/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── (routes)/         # Feature pages: /explore, /guides, /safety, /plan, /map, etc.
│   ├── api/              # Server-only API route handlers (e.g. /api/newsletter)
│   ├── globals.css       # Global styles, Himalayan design tokens, CSS variables
│   ├── layout.tsx        # Root layout with navbar, footer, analytics, metadata
│   ├── sitemap.ts        # Dynamic XML sitemap generation (108 routes)
│   └── robots.ts         # Robots.txt configuration
├── components/           # Reusable UI components
│   ├── ui/               # Atomic primitives (buttons, dialogs, badges, inputs)
│   ├── layout/           # Navigation, Footer, Breadcrumbs
│   ├── maps/             # Mapbox GL wrappers, GlobalMapClient (3D terrain)
│   ├── plan/             # TrekFinder, ComparisonMatrix, BudgetCalculator, PackingList
│   └── shared/           # ContentCard, WeatherWidget, RelatedContent, QuickFacts
├── data/                 # Strongly-typed static datasets & schemas
│   ├── treks.ts          # Trek itineraries, difficulties, coordinates, seasons
│   ├── peaks.ts          # Himalayan peak profiles, technical stats
│   ├── mountain-safety.ts# AMS protocols, emergency contacts, high-altitude advice
│   ├── atlas.ts          # Geospatial coordinates, O(1) placeLocationIndex
│   ├── guides.ts         # Alpine guides, packing checklists, logistics
│   └── types.ts          # Shared TypeScript interfaces and domain types
└── lib/                  # Server and shared utilities
    ├── site.ts           # Global site metadata, canonical URLs, contact info
    ├── search.ts         # Fast tokenized fuzzy search and multi-filtering logic
    ├── json-ld.ts        # Rich SEO Schema.org generator functions
    ├── seo.ts            # Dynamic metadata helpers
    └── utils.ts          # Utility functions (cn, formatting, math)
```

### Architectural Boundaries
- **Server vs Client Components**:
  - Keep data fetching, SEO metadata generation, and static rendering in React Server Components (RSC).
  - Use Client Components (`"use client"`) strictly when browser APIs, local state, event listeners, Framer Motion, or Mapbox GL instances are required.
- **Server Components & Event Handlers**:
  - Never pass event handlers (`onSubmit`, `onFocus`, `onClick`) in Server Components. Use pure CSS `:focus-within` and form action styling.
- **Mapbox Client Boundary**:
  - Mapbox GL requires browser window context. Always load map components dynamically or isolate them in client components with SSR handling.
- **API Routes**:
  - Keep third-party secrets (email providers, API keys) exclusively on the server in route handlers (`src/app/api/`). Never expose secret keys to the client.

---

# 5. Tech Stack

- **Framework**: Next.js 15 (App Router with React 19 Server & Client Components)
- **Language**: TypeScript (strict type checking enabled)
- **Styling**: Tailwind CSS 3.4, Tailwind Animate, `@tailwindcss/typography`
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Maps & Geospatial**: Mapbox GL & `react-map-gl`
- **Validation**: Zod (for API request validation & form data)
- **Tooling**: ESLint, PostCSS, Autoprefixer

---

# 6. Key Architectural Decisions

- **Brand & Domain Consistency**: Always standardize on **Discover Himalayan Trails** and `discoverhimalayantrails.com` as configured in `src/lib/site.ts`.
- **Static Typed Content Architecture**: Core data resides in typed TypeScript modules in `src/data/` providing instant build-time validation, blazing SSG performance, and zero database latency.
- **O(1) Indexed Lookups**: All geospatial and route resolutions use `placeLocationIndex` (Map) in `src/data/atlas.ts` instead of linear array scans.
- **Programmatic SEO & Schema**: Every entity page (trek, peak, guide, safety topic) automatically generates corresponding OpenGraph tags, canonical links, and Schema.org JSON-LD structures (`TouristTrip`, `Mountain`, `Article`, `FAQPage`, `BreadcrumbList`).
- **Client-Side Search**: Multi-category search runs efficiently in-memory over typed datasets using tokenized scoring in `src/lib/search.ts` without external search infrastructure costs.

---

# 7. Checks to Run

Always verify before committing or completing a task:

1. **TypeScript Compilation**:
   ```bash
   npx tsc --noEmit
   ```
2. **Linting**:
   ```bash
   npm run lint
   ```
3. **Production Build**:
   ```bash
   npm run build
   ```
4. **Local Dev Validation**:
   ```bash
   npm run dev
   ```

Report actual execution outputs. Never assume a check passed without running it.