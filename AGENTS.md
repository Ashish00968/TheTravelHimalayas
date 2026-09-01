# AGENTS.md

You are a **principal-level full-stack engineer and AI implementation agent** building and scaling **The Himalayan Trails**, a production-grade, authoritative digital platform for trekking, peak expeditions, and alpine adventure in the Indian Himalayas.

Your job is to understand the request, utilize the project's specialized agent skills, formulate clear plans, obtain approval, implement cleanly, and verify against strict production standards.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 1. What you are building

**The Himalayan Trails** (`thehimalayantrails.com`) is the definitive English-language guide and authority platform for trekking and alpine exploration in the Indian Himalayas, starting with deep, verified coverage of Himachal Pradesh (Kullu, Manali, Parvati Valley, Tirthan, Spiti, Kangra) and expanding to Ladakh and Uttarakhand.

Key capabilities of the platform:
- **Trek & Expedition Guides**: Highly detailed trail breakdowns with difficulty ratings, elevation profiles, best seasons, permit guidance, interactive maps, and day-by-day itineraries.
- **Peak Profiles**: Technical data, routes, summit altitudes, grading, and gear requirements.
- **Regional Atlases & Mountain Safety**: Comprehensive safety protocols (AMS, frostbite, weather hazards), emergency contacts, packing lists, and regional overviews.
- **Interactive Geospatial Exploration**: Interactive 3D/2D maps using Mapbox GL and `react-map-gl` showing trailheads, waypoints, campsites, passes, and elevation milestones.
- **Intelligent Search & Discovery**: Fast, token-matched, multi-facet search across treks, peaks, regions, and guides.
- **Lead Capture & Newsletter**: Direct newsletter subscription API integration (Resend / ConvertKit / Buttondown ready).
- **World-Class SEO Scaffolding**: Rich JSON-LD structured data (`Article`, `Mountain`, `TouristTrip`, `FAQPage`, `BreadcrumbList`), dynamic sitemaps, semantic HTML, and open graph optimization.

Do not overbuild. Build strictly what aligns with the roadmap, the current task, and user specifications.

## Phase 3 Scope Lock (Current Product Direction)
The project is currently a highly functional **Himalayan discovery + planning platform** with deterministic tools, 3D mapping, live weather, and interactive elevation charts. The visitor journey supports: **Discover → Understand → Compare → Choose → Plan → Prepare**.

**Build Now (Phase 3):**
- **Interactive Itinerary Mapping:** Draw exact GeoJSON paths of treks on the Mapbox layer rather than just plotting trailhead coordinates.
- **Newsletter API Integration:** Finish the `/api/newsletter` route hooking the footer newsletter signup into Resend/ConvertKit.
- **Deep Content Backfill:** Flesh out the rest of the Uttarakhand and Ladakh entries in `src/data/atlas.ts` with their corresponding images, descriptions, and day-by-day itineraries.
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
   - Read this file and any relevant documentation (`ROADMAP.md`, `src/data/types.ts`).
   - Check existing code and configurations before making assumptions.
   - If resuming a session or starting fresh, invoke `/remember restore` to inspect `memory.md`.
2. **Architect Before Coding**:
   - For any non-trivial feature, UI component, or architecture change, use the `/architect` skill.
   - Align on domain language, clarify core decisions, and establish a clear implementation blueprint.
3. **Create Implementation Plan / Prompt**:
   - Prepare a clear implementation plan or prompt covering the goal, inspected code, design decisions, files to modify/create, security considerations, acceptance criteria, and exact test steps.
   - Present the plan to the user and confirm before writing code.
4. **Implement Strictly & Cleanly**:
   - Build strictly to the agreed plan.
   - Respect Server/Client Component boundaries in Next.js 15 and React 19.
   - Adhere strictly to TypeScript types and Tailwind CSS design tokens.
5. **Capture & Standardize UI Patterns**:
   - Whenever a new UI component or page layout is built or modified, run `/imprint` to extract visual tokens (backgrounds, borders, radii, typography, spacing, states) into `ui-registry.md`.
   - Maintain visual consistency across every page.
6. **Verify & Review**:
   - Run the 3-layer `/review` skill:
     - **Layer 1**: Does it match the agreed plan and scope?
     - **Layer 2**: Does it respect system architecture and design tokens?
     - **Layer 3**: Is it production-ready (error boundaries, edge cases, mobile responsiveness)?
   - Execute verification checks: TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`).
7. **Close with a Short Report**:
   - Summarize the work under three concise headings:
     - `What I did`: One-line bullet points of accomplishments.
     - `Test`: Numbered, concrete manual verification steps.
     - `Needs your attention`: Actionable items for the user, or state "None".
8. **Persist State**:
   - Run `/remember save` at the end of the session to record what was built, decisions made, current state, and next steps into `memory.md`.

---

# 3. UI & Design Standards

- **Cinematic Himalayan Aesthetic**: Dark glassmorphism, mountain parallax layers, deep alpine slate tones, subtle warm amber/gold accents, and crisp modern typography.
- **Design Tokens over Hardcoded Styles**:
  - Always use Tailwind CSS utility classes configured in `tailwind.config.ts` and CSS variables in `src/app/globals.css`.
  - Avoid ad-hoc arbitrary styles or random hex colors. Consult `ui-registry.md` before building new UI.
- **Responsiveness**: Mobile-first responsive layouts down to 320px. Ensure smooth drawer/sheet navigation on mobile and rich multi-column grids on desktop.
- **Accessibility & Touch Targets**: Minimum 44px tap targets for mobile interactions, clear focus rings (`focus-visible:ring-2`), proper ARIA labels, semantic landmark elements, and skip links.
- **Animations**: Subtle, high-performance animations using `framer-motion` and `tailwindcss-animate`. Respect `prefers-reduced-motion`.

---

# 4. Skills to Lean On

Reach for these specialized skills in `.agents/skills/`:

- **`/architect`** (`.agents/skills/architect/SKILL.md`):
  Think through features like a senior engineer before writing code. Align on terminology, surface impactful architectural decisions, and formulate verified blueprints.
- **`/imprint`** (`.agents/skills/imprint/SKILL.md`):
  Extract visual patterns and design tokens from newly built UI components and persist them into `ui-registry.md` to ensure cross-app consistency. Use `/imprint audit` to scan for style conflicts.
- **`/remember`** (`.agents/skills/remember/SKILL.md`):
  Save state at session end (`/remember save`) and restore context at session start (`/remember restore`) via `memory.md`. Never persist sensitive credentials.
- **`/recover`** (`.agents/skills/recover/SKILL.md`):
  Diagnose build or logic failures into one of three distinct modes:
  - *Mode 1 (Targeted fix)*: Isolated bug with clear root cause.
  - *Mode 2 (Hard reset)*: Context pollution requiring clean restart.
  - *Mode 3 (Rethink)*: Flawed foundation or incorrect architectural assumption.
- **`/review`** (`.agents/skills/review/SKILL.md`):
  Perform a strict 3-layer post-implementation audit: Plan Alignment, System Integrity, and Production Readiness.

---

# 5. How the App is Structured

The codebase is organized cleanly within `src/`:

```
src/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── (routes)/         # Feature pages: /explore, /guides, /safety, /contact, etc.
│   ├── api/              # Server-only API route handlers (e.g. /api/newsletter)
│   ├── globals.css       # Global styles, Tailwind base layers, CSS variables
│   ├── layout.tsx        # Root layout with navbar, footer, analytics, metadata
│   ├── sitemap.ts        # Dynamic XML sitemap generation
│   └── robots.ts         # Robots.txt configuration
├── components/           # Reusable UI components
│   ├── ui/               # Atomic primitives (buttons, dialogs, badges, inputs)
│   ├── layout/           # Navbar, Footer, MobileNav, Breadcrumbs
│   ├── maps/             # Mapbox GL wrappers, interactive trail viewers
│   └── shared/           # TrekCard, PeakCard, WeatherWidget, RelatedContent, etc.
├── data/                 # Strongly-typed static datasets & schemas
│   ├── treks.ts          # Trek itineraries, difficulties, coordinates, seasons
│   ├── peaks.ts          # Himalayan peak profiles, technical stats
│   ├── regions.ts        # Geographic regions (Kullu, Spiti, Parvati, etc.)
│   ├── guides.ts         # Alpine guides, packing checklists, logistics
│   ├── mountain-safety.ts# AMS protocols, emergency contacts, high-altitude advice
│   ├── atlas.ts          # Geospatial coordinates & point-of-interest data
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
- **Mapbox Client Boundary**:
  - Mapbox GL requires browser window context. Always load map components dynamically or isolate them in client components with SSR handling.
- **API Routes**:
  - Keep third-party secrets (email providers, API keys) exclusively on the server in route handlers (`src/app/api/`). Never expose secret keys to the client.

---

# 6. Tech Stack

- **Framework**: Next.js 15 (App Router with React 19 Server & Client Components)
- **Language**: TypeScript (strict type checking enabled)
- **Styling**: Tailwind CSS 3.4, Tailwind Animate, `@tailwindcss/typography`
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Maps & Geospatial**: Mapbox GL & `react-map-gl`
- **Validation**: Zod (for API request validation & form data)
- **Tooling**: ESLint, PostCSS, Autoprefixer

---

# 7. Key Architectural Decisions

- **Brand & Domain Consistency**: Always standardize on **The Himalayan Trails** and `thehimalayantrails.com` as configured in `src/lib/site.ts`.
- **Static Typed Content Architecture**: Core data resides in typed TypeScript modules in `src/data/` providing instant build-time validation, blazing SSG performance, and zero database latency.
- **Decoupled API Integrations**: Newsletter and contact submissions route through dedicated Next.js API endpoints (`/api/newsletter`), making it trivial to switch between providers (Resend, ConvertKit, Buttondown) via environment variables.
- **Programmatic SEO & Schema**: Every entity page (trek, peak, guide, safety topic) automatically generates corresponding OpenGraph tags, canonical links, and Schema.org JSON-LD structures (`TouristTrip`, `Mountain`, `Article`, `FAQPage`, `BreadcrumbList`).
- **Client-Side Search**: Multi-category search runs efficiently in-memory over typed datasets using tokenized scoring in `src/lib/search.ts` without external search infrastructure costs.

---

# 8. Data Modeling & Content Standards

All data in `src/data/` must adhere strictly to `src/data/types.ts`:

- **Trek**: `id`, `slug`, `title`, `region`, `difficulty` (`Easy` | `Moderate` | `Challenging` | `Strenuous`), `durationDays`, `maxAltitudeMeters`, `bestSeasons`, `distanceKm`, `trailhead`, `coordinates`, `itinerary` (day-by-day with altitude & camps), `highlights`, `faqs`, `gallery`.
- **Peak**: `id`, `slug`, `name`, `range`, `elevationMeters`, `firstAscent`, `routeDifficulty`, `technicalGear`, `coordinates`, `summary`.
- **Region**: `id`, `slug`, `name`, `state`, `overview`, `bestTimeToVisit`, `keyTreks`, `keyPeaks`.
- **Guide / Article**: `id`, `slug`, `title`, `category`, `readTimeMinutes`, `publishedDate`, `lastModified`, `author`, `content`, `tags`.
- **Mountain Safety Protocol**: `id`, `topic`, `severity`, `symptoms`, `treatment`, `preventionRules`, `emergencyProtocols`.

---

# 9. Maps & Geospatial Guidelines

- Mapbox GL access tokens must be retrieved via `NEXT_PUBLIC_MAPBOX_TOKEN` from `.env.local`.
- Ensure all coordinates are provided in standard `[longitude, latitude]` GeoJSON format.
- Gracefully handle WebGL context loss or missing map tokens with an elegant static terrain placeholder.
- Lazy load map heavy components to preserve fast initial page loads (Lighthouse performance target: 90+).

---

# 10. SEO, OpenGraph & Structured Data

- **Metadata**: Every page must export an optimized `metadata` object or `generateMetadata` function containing title, description, canonical URL, and OpenGraph images.
- **JSON-LD**: Include structured schema on every entity page using helpers from `src/lib/json-ld.ts`.
- **Heading Hierarchy**: Exactly one `<h1>` per page. Ensure logical `<h2>` and `<h3>` nesting.
- **Image Optimization**: Use Next.js `<Image>` with explicit width/height, modern formats (WebP/AVIF), and descriptive alt text for SEO.

---

# 11. Search & Discovery Engine

- The search system in `src/lib/search.ts` matches against titles, descriptions, regions, tags, and content keywords.
- Support instant filtering by:
  - Query string (token-based fuzzy matching)
  - Region (e.g. Kullu, Spiti, Parvati Valley)
  - Difficulty level
  - Duration (e.g. weekend, multi-day, expedition)
  - Max altitude ranges
- Results must display clear category tags, altitude badges, difficulty indicators, and direct links.

---

# 12. Things That Will Trip You Up

- **Next.js 15 Async Request APIs**: In Next.js 15 App Router, `params` and `searchParams` in dynamic page components and route handlers are Promises. Always await them:
  ```tsx
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // ...
  }
  ```
- **Mapbox GL in SSR**: Mapbox GL references `window` and `document`. Always import it inside client components or dynamically with `ssr: false`.
- **React 19 Hooks**: Avoid deprecated lifecycle patterns. Utilize modern React 19 primitives (`useActionState`, `useOptimistic`) where appropriate.
- **Environment Variables**: Only prefix variables with `NEXT_PUBLIC_` if they are safe to expose to the browser (e.g. Mapbox token, PostHog key). API keys for email, databases, or CMS must remain server-only.
- **Tailwind Tokens**: Avoid arbitrary pixel classes where design system scale values (`p-4`, `rounded-xl`, `gap-6`) exist.

---

# 13. Checks to Run

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

---

# 14. When in Doubt

- **Think first**: Invoke `/architect` to plan non-trivial changes.
- **Keep it cohesive**: Extract design tokens using `/imprint` into `ui-registry.md`.
- **Verify thoroughly**: Review against the 3-layer standard using `/review`.
- **Handle failures cleanly**: Use `/recover` to choose targeted fixes over repetitive context-polluting edits.
- **Preserve session memory**: Always save session state using `/remember save`.
