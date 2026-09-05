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
- **Cinematic Slanting Diagonal Scroll Hero**: Progressive scroll-driven typography cascade (`Discover` on left -> `Himalayan` at center -> `Trails` on right) matching the natural crest of the Himalayan ridge, gentle progressive revelation ("fade little little"), zero blackout overlay, continuous mountain panorama, `brightness(1.24) saturate(1.18)` dark mode wallpaper boost, and smooth scroll-driven feathered bottom horizon melt.
- **Trek & Expedition Guides**: Highly detailed trail breakdowns with difficulty ratings, elevation profiles, best seasons, permit guidance, interactive maps, and day-by-day itineraries.
- **Peak Profiles**: Technical data, climbing routes, summit altitudes, grading, and gear specs.
- **Regional Atlases & Mountain Safety**: Comprehensive safety protocols (AMS, HAPE, HACE, cold injury), mountaineering course directory (BMC, AMC, MOI, S&R), packing lists, and regional overviews.
- **Three Golden Rules of Altitude Safety**: Prominent high-altitude medical directive automatically rendered on all routes climbing above 3,000 meters.
- **Curated 3D Geospatial Exploration**: Interactive 3D satellite maps using Mapbox GL showing trailheads, waypoints, passes, and elevation milestones with single-focus "one-at-a-time" expedition cards.
- **Planning Suite**: Deterministic Trek Finder, Head-to-Head Comparison Matrix, Budget Estimator, Packing Checklist Generator, and Seasonal Matrix.
- **Sticky Trail QuickNav & Bookmarking**: Fixed sub-navigation on trail guides with dynamic scrollspy, native Web Share API, print triggers, and zero-auth client-side saved expeditions drawer (`SavedExpeditionsDrawer`).
- **PWA & Offline Print Readiness**: Dynamic W3C Web App Manifest (`/manifest.webmanifest`) and `@media print` paper-guide stylesheets with page-break-proof cards and clean layout.
- **Compressed Single-Card FAQ Engine**: Single compact capsule card expanding into 10 interactive question accordions with pre-rendered Schema.org `FAQPage` structured data.
- **Platform Authority Ribbon**: 4 trust pillars on the homepage highlighting Zero Commercial Bias, 100% Geospatially Mapped, Clinical Altitude Protocols, and Offline PWA & Print Ready.
- **Intelligent Search & Discovery**: Fast, token-matched, multi-facet search across treks, peaks, regions, and guides with instant O(1) `placeLocationIndex` resolution.
- **World-Class SEO Scaffolding**: Rich JSON-LD structured data (`Article`, `Mountain`, `TouristTrip`, `FAQPage`, `BreadcrumbList`), dynamic sitemaps, semantic HTML, and open graph optimization across all 111 static pre-rendered routes.

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
   - Read this file and the private project documentation in `info/` (`info/context.md`, `info/TECHNICAL_SPECS.md`, `info/BUILD_LOG.md`, `src/data/types.ts`).
   - Check existing code and configurations before making assumptions.
   - If resuming a session or starting fresh, inspect `info/memory.md`.
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
   - Maintain visual consistency across every page, using design tokens from `info/context.md` and `info/TECHNICAL_SPECS.md`.
6. **Verify & Review**:
   - Perform a strict 3-layer audit: Plan Alignment, System Integrity, and Production Readiness.
   - Execute verification checks: TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`).
7. **Close with a Short Report**:
   - Summarize the work under three concise headings:
     - `What I did`: One-line bullet points of accomplishments.
     - `Test`: Numbered, concrete manual verification steps.
     - `Needs your attention`: Actionable items for the user, or state "None".
8. **Persist State & Respect Privacy Boundaries**:
   - Update `info/memory.md` at the end of every session to record what was built, decisions made, current state, and next steps.
   - **CRITICAL**: Keep the workspace root strictly clean. The workspace root must contain ONLY `README.md` as public project documentation.
   - All private build logs, developer memory, and technical specifications must reside inside `info/` (`BUILD_LOG.md`, `TECHNICAL_SPECS.md`, `context.md`, `memory.md`).
   - The `info/` and `scratch/` directories are Git-ignored via `.gitignore` and must never be committed or pushed to public repositories.

---

# 3. UI & Design Standards

- **Himalayan Midnight-Indigo Aesthetic**:
  - Base: `#040812` (Midnight-Indigo)
  - Surface: `#080e1a` (Alpine Rock)
  - Card: `#0d1422` (Mountain Shadow)
  - Primary: `#3B82F6` (Glacier Blue)
  - Territory Accents: Kashmir (`#3B82F6`), Himachal (`#F59E0B`), Ladakh (`#7C3AED`), Uttarakhand (`#0D9488`).
- **Dual-Theme Integrity (Light & Dark)**:
  - Dark mode: High-contrast midnight-indigo palette with boosted hero wallpaper visibility (`brightness(1.24) saturate(1.18)`).
  - Light mode: Crisp alpine slate/snow aesthetic with high-contrast readable text (`text-slate-900`, `text-slate-700`). Zero blinding white fog at scroll 0; horizon melt feathers in progressively.
- **Typography & Rendering Safety**:
  - Never combine `-webkit-text-fill-color: transparent` with CSS `filter: blur(...)` on text (causes WebKit green ghost smudge artifacts).
  - Use solid, crisp typography (`#60A5FA` / `text-blue-400`) and pure CSS text shadows for hero titles.
- **Design Tokens over Hardcoded Styles**:
  - Always use Tailwind CSS utility classes configured in `tailwind.config.ts` and CSS variables in `src/app/globals.css`.
  - Consult `info/context.md` before building new UI.
- **Responsiveness**: Mobile-first responsive layouts down to 320px.
- **Accessibility & Touch Targets**: Minimum 44px tap targets for mobile interactions, clear focus rings (`focus-visible:ring-2`), proper ARIA labels, semantic landmark elements, and skip links.
- **Animations**: Subtle, high-performance animations using `framer-motion` and `tailwindcss-animate`. Respect `prefers-reduced-motion`.

---

# 4. How the App is Structured

```
├── .agents/              # Agent skills, operational instructions, and configuration
│   ├── AGENTS.md         # Authoritative agent rules & implementation guidelines (this file)
│   └── skills/           # 7 installed workspace skills (.agents/skills/)
├── info/                 # Private developer documentation (Git-ignored)
│   ├── BUILD_LOG.md      # Full milestone chronicle & bug resolution log
│   ├── TECHNICAL_SPECS.md# Static export rules, schemas & O(1) lookup indexing
│   ├── context.md        # Technical context, full 111-route map & design tokens
│   └── memory.md         # Active session memory, recent updates & next priorities
├── README.md             # ONLY markdown file at the root (public repository guide)
├── functions/            # Cloudflare Pages Functions
│   └── api/newsletter.ts # Edge serverless route handler for newsletter submissions
├── src/
│   ├── app/              # Next.js App Router (pages, layouts, static SSG)
│   │   ├── (routes)/     # 111 static routes (/explore, /guides, /safety, /plan, /map, etc.)
│   │   ├── globals.css   # Global styles, Himalayan design tokens, CSS variables
│   │   ├── layout.tsx    # Root layout with navbar, footer, analytics, metadata
│   │   ├── sitemap.ts    # Dynamic XML sitemap generation (111 routes)
│   │   ├── robots.ts     # Robots.txt configuration
│   │   └── manifest.webmanifest/ # Dynamic W3C Web App Manifest route
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Atomic primitives (buttons, dialogs, badges, inputs)
│   │   ├── layout/       # Navigation, Footer, Breadcrumbs, SavedExpeditionsDrawer
│   │   ├── maps/         # Mapbox GL wrappers, GlobalMapClient (3D terrain)
│   │   ├── plan/         # TrekFinder, ComparisonMatrix, BudgetCalculator, PackingList
│   │   ├── home/         # HomeClient, FaqSection, PlanningSection, RidgeTrail
│   │   ├── search/       # SearchModal with token-matched scoring
│   │   └── shared/       # ContentCard, WeatherWidget, RelatedContent, TrailQuickNav
│   ├── data/             # Strongly-typed static datasets & schemas
│   │   ├── atlas.ts      # Geospatial coordinates, O(1) placeLocationIndex
│   │   ├── treks.ts      # Trek itineraries, difficulties, coordinates, seasons
│   │   ├── peaks.ts      # Himalayan peak profiles, technical stats
│   │   ├── mountain-safety.ts # AMS protocols, emergency contacts, high-altitude advice
│   │   ├── guides.ts     # Alpine guides, packing checklists, logistics
│   │   ├── homepage-faqs.ts   # Indiahikes-grade FAQs with Schema.org FAQPage structured data
│   │   └── types.ts      # Shared TypeScript interfaces and domain types
│   └── lib/              # Server and shared utilities
│       ├── site.ts       # Global site metadata, canonical URLs, contact info
│       ├── search.ts     # Fast tokenized fuzzy search and multi-filtering logic
│       ├── json-ld.ts    # Rich SEO Schema.org generator functions
│       ├── seo.ts        # Dynamic metadata helpers
│       └── utils.ts      # Utility functions (cn, formatting, math)
```

### Architectural Boundaries
- **Server vs Client Components**:
  - Keep data fetching, SEO metadata generation, and static rendering in React Server Components (RSC).
  - Use Client Components (`"use client"`) strictly when browser APIs, local state, event listeners, Framer Motion, or Mapbox GL instances are required.
- **Server Components & Event Handlers**:
  - Never pass event handlers (`onSubmit`, `onFocus`, `onClick`) in Server Components. Use pure CSS `:focus-within` and form action styling.
- **Mapbox Client Boundary**:
  - Mapbox GL requires browser window context. Always load map components dynamically or isolate them in client components with SSR handling.
- **Static Export & Edge Functions**:
  - The app uses `output: "export"` for sub-millisecond static CDN delivery. Dynamic server APIs run via Cloudflare Pages Functions (`functions/api/`). Keep third-party secrets exclusively on the server side. Never expose secret keys to the client.

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
- **Zero-Auth LocalStorage Bookmark Engine**: Client-side bookmarking using React 19 `useSyncExternalStore` for flicker-free, hydration-safe cross-component synchronization without backend overhead.
- **Programmatic SEO & Schema**: Every entity page (trek, peak, guide, safety topic) automatically generates corresponding OpenGraph tags, canonical links, and Schema.org JSON-LD structures (`TouristTrip`, `Mountain`, `Article`, `FAQPage`, `BreadcrumbList`).
- **Client-Side Search**: Multi-category search runs efficiently in-memory over typed datasets using tokenized scoring in `src/lib/search.ts` without external search infrastructure costs.
- **Strict Git Documentation Privacy**: Private developer context and historical build logs reside exclusively in `info/` which is ignored by Git, leaving the repository clean with a single public `README.md`.

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

---

# 8. Installed Workspace Skills (`.agents/skills/`)

The following 7 project skills are installed and automatically discovered by Antigravity:

| Skill Name | Path | Trigger & Usage |
|---|---|---|
| **`vercel-react-best-practices`** | [SKILL.md](file:///.agents/skills/vercel-react-best-practices/SKILL.md) | Vercel performance rules, eliminating waterfalls, avoiding re-renders, and bundle size optimization. |
| **`nextjs-app-router-patterns`** | [SKILL.md](file:///.agents/skills/nextjs-app-router-patterns/SKILL.md) | Next.js 15 App Router static export (`output: "export"`), Cloudflare Functions, dynamic metadata. |
| **`tailwind-design-system`** | [SKILL.md](file:///.agents/skills/tailwind-design-system/SKILL.md) | Himalayan midnight-indigo tokens, territory accents, frosted glass cards, dual-theme styling. |
| **`programmatic-seo-audit`** | [SKILL.md](file:///.agents/skills/programmatic-seo-audit/SKILL.md) | Schema.org JSON-LD structured data (`TouristTrip`, `Mountain`, `FAQPage`), XML sitemaps, and GEO. |
| **`mapbox-geospatial-visualizer`** | [SKILL.md](file:///.agents/skills/mapbox-geospatial-visualizer/SKILL.md) | Mapbox GL 3D terrain meshes, GeoJSON trail paths, camera fly-tos, and free-tier token conservation. |
| **`himalayan-content-curator`** | [SKILL.md](file:///.agents/skills/himalayan-content-curator/SKILL.md) | Trail, peak, and place verification in `src/data/`, coordinate accuracy, and O(1) index sync. |
| **`altitude-safety-compliance`** | [SKILL.md](file:///.agents/skills/altitude-safety-compliance/SKILL.md) | Clinical altitude safety protocols (AMS, HAPE, HACE), acclimatization schedules, and SAR contacts. |

