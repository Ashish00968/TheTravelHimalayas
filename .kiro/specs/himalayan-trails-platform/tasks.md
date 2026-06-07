# Implementation Plan: Himalayan Trails Platform

## Overview

Incremental build of the frontend shell: project scaffolding and design system first, then mock data layer, reusable components, page templates, SEO/structured data, and finally polish (animations, search, monetization, performance). All content is static — no backend or database.

## Tasks

- [x] 1. Project scaffolding and design system
  - [x] 1.1 Initialize Next.js 15 project with TypeScript strict mode, Tailwind CSS, Shadcn UI, and Framer Motion
    - Create Next.js 15 App Router project with `--typescript` flag
    - Enable strict mode in `tsconfig.json`
    - Install and configure Tailwind CSS with the brand color palette (Primary #7C3AED, Secondary #A78BFA, Background #09090B, Foreground #F8FAFC, Accent #C4B5FD)
    - Install Shadcn UI, Framer Motion, and next-seo
    - Configure `tailwind.config.ts` with custom colors, fonts (Inter, Plus Jakarta Sans), border-radius tokens, and `tailwindcss-animate` plugin
    - Set `darkMode: "class"` in Tailwind config
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 Create global styles with glassmorphism utilities and font setup
    - Write `src/styles/globals.css` with Tailwind base/components/utilities layers
    - Add `.glass-nav`, `.glass-card`, `.glass-panel` component classes
    - Configure `next/font` for Inter and Plus Jakarta Sans with `display: swap` in root layout
    - Set `<html lang="en" className="dark">` for dark-mode-first approach
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 15.3_

  - [x] 1.3 Set up root layout with metadata defaults and body structure
    - Create `src/app/layout.tsx` with font variables, dark class, and base `bg-background text-foreground`
    - Add placeholder `<Navigation />` and `<Footer />` component imports (stubbed)
    - Add default metadata export for site-wide title template
    - _Requirements: 1.1, 3.4_

- [x] 2. Mock data layer and TypeScript interfaces
  - [x] 2.1 Define shared TypeScript interfaces in `src/data/types.ts`
    - Create interfaces for Trek, Peak, DayHike, Guide, Region with all fields from the design document
    - Include difficulty union types and itinerary/FAQ sub-types
    - _Requirements: 5.5, 6.4, 7.4, 8.4, 9.1_

  - [x] 2.2 Create trek mock data in `src/data/treks.ts`
    - Write complete mock entries for Hampta Pass, Bhrigu Lake, Beas Kund, Chandrakhani Pass, Sar Pass, Deo Tibba Base Camp
    - Include all fields: slug, title, region, difficulty, duration, distance, maxAltitude, bestSeason, overview, routeDescription, itinerary, packingList, permits, faqs, images, heroImage, description
    - _Requirements: 5.5_

  - [x] 2.3 Create peak mock data in `src/data/peaks.ts`
    - Write complete mock entries for Friendship Peak, Hanuman Tibba, Deo Tibba, Indrasan
    - Include all fields: slug, title, region, difficulty, height, expeditionSeason, baseCamp, overview, climbingRoute, expeditionDetails, gearRequirements, faqs, images, heroImage, description
    - _Requirements: 6.4_

  - [x] 2.4 Create day hike mock data in `src/data/day-hikes.ts`
    - Write complete mock entries for Lamadugh, Jogini Falls, Patalsu Peak
    - Include all fields: slug, title, region, difficulty, duration, distance, overview, routeDescription, faqs, images, heroImage, description
    - _Requirements: 7.4_

  - [x] 2.5 Create guide mock data in `src/data/guides.ts`
    - Write complete mock entries for "Best Time To Visit Manali", "How To Reach Manali", "Trekking Permits In Himachal", "Packing List", "Best Day Hikes Near Manali"
    - Include all fields: slug, title, category, author, description, content, featuredImage, heroImage, relatedGuides
    - _Requirements: 8.4_

  - [x] 2.6 Create region mock data in `src/data/regions.ts`
    - Write region entries matching regions referenced in treks/peaks/day-hikes data
    - Include all fields: slug, title, overview, travelInfo, images, heroImage, description
    - _Requirements: 9.1, 9.2_

- [x] 3. Checkpoint
  - Ensure the project builds without errors (`npm run build`), all TypeScript types are valid, and mock data files export correctly. Ask the user if questions arise.

- [x] 4. Reusable components — media, animation, and content primitives
  - [x] 4.1 Create CloudinaryImage component and Cloudinary URL utility
    - Write `src/lib/cloudinary.ts` with `buildCloudinaryUrl` function accepting transform params
    - Write `src/components/media/CloudinaryImage.tsx` wrapping Next.js Image with blur placeholder, lazy loading, and fallback handling
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 4.2 Create animation wrapper components (PageTransition, ScrollReveal, MotionCard)
    - Write `src/components/animation/PageTransition.tsx` with Framer Motion enter/exit variants
    - Write `src/components/animation/ScrollReveal.tsx` with intersection-observer-based fade-in
    - Write `src/components/animation/MotionCard.tsx` with hover scale/translate
    - All three components MUST respect `prefers-reduced-motion` via `useReducedMotion()`
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 4.3 Create ContentCard component
    - Write `src/components/content/ContentCard.tsx` with image, title, description, badges, and meta props
    - Wrap in MotionCard for hover animation
    - Use CloudinaryImage for card images
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 6.1, 7.1_

  - [x] 4.4 Create HeroSection, QuickFacts, FAQAccordion, ImageGallery, and RelatedContent components
    - Write `src/components/content/HeroSection.tsx` — full-width hero with image, title overlay, and breadcrumbs
    - Write `src/components/content/QuickFacts.tsx` — sidebar/card displaying key-value facts
    - Write `src/components/content/FAQAccordion.tsx` — expandable Q&A using Shadcn Accordion
    - Write `src/components/content/ImageGallery.tsx` — responsive grid with lightbox interaction
    - Write `src/components/content/RelatedContent.tsx` — section rendering ContentCards for related items
    - Write `src/lib/related-content.ts` with `getRelatedContent` filter logic (region/difficulty match, exclude self)
    - _Requirements: 5.3, 5.4, 6.3, 7.3, 8.3, 9.3, 17.1, 18.1_

  - [ ]* 4.5 Write property tests for related content filter and image component
    - **Property 4: Related Content Filter Correctness** — every related item shares region or difficulty with current item, and current item never appears in its own related list
    - **Validates: Requirements 5.4, 9.4, 18.1**
    - **Property 7: Image Component Rendering Behavior** — blur placeholder present, non-priority images have lazy loading
    - **Validates: Requirements 10.1, 10.2, 10.3**
    - **Property 8: Cloudinary URL Transformation** — buildCloudinaryUrl accepts any valid params without throwing
    - **Validates: Requirements 10.4**

  - [ ]* 4.6 Write property test for reduced motion respect
    - **Property 12: Reduced Motion Respect** — when prefers-reduced-motion is active, animation components render with no motion variants
    - **Validates: Requirements 13.4**

- [x] 5. Layout components — Navigation, Footer, Breadcrumbs
  - [x] 5.1 Create Navigation component with desktop links, mobile menu, and search trigger
    - Write `src/components/layout/Navigation.tsx` as a client component
    - Implement fixed glassmorphism header with logo and nav links (Home, Treks, Peaks, Day Hikes, Regions, Guides, Gallery, About, Contact)
    - Implement mobile hamburger toggle with AnimatePresence slide animation
    - Add search icon button that opens SearchModal (stubbed initially)
    - Ensure min 44x44px touch targets on mobile
    - _Requirements: 3.1, 3.2, 3.3, 16.3_

  - [x] 5.2 Create Footer component with link columns and newsletter placeholder
    - Write `src/components/layout/Footer.tsx` with Explore links, Company links, and newsletter signup section
    - _Requirements: 3.4, 14.3_

  - [x] 5.3 Create Breadcrumbs component and breadcrumb utility
    - Write `src/lib/breadcrumbs.ts` with `buildBreadcrumbs` function generating crumb items from pathname
    - Write `src/components/layout/Breadcrumbs.tsx` rendering breadcrumb trail with links
    - _Requirements: 18.2_

  - [ ]* 5.4 Write property test for breadcrumb path correctness
    - **Property 10: Breadcrumb Path Correctness** — starts with Home at `/`, one item per path segment in order, final item matches page title
    - **Validates: Requirements 18.2**

- [x] 6. Checkpoint
  - Ensure all components render without errors in a dev build, TypeScript is clean, and the navigation/footer display correctly in the root layout. Ask the user if questions arise.

- [x] 7. Content pages — listings and detail pages
  - [x] 7.1 Create Trek listing page and Trek detail page
    - Write `src/app/treks/page.tsx` rendering filterable card grid of all treks
    - Write `src/app/treks/[slug]/page.tsx` with `generateStaticParams`, hero, quick facts, overview, route description, itinerary, packing list, permits, FAQ accordion, image gallery, related treks, and map placeholder
    - Wire breadcrumbs and page transition
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 7.2 Create Peak listing page and Peak detail page
    - Write `src/app/peaks/page.tsx` rendering filterable card grid of all peaks
    - Write `src/app/peaks/[slug]/page.tsx` with `generateStaticParams`, hero, info card, overview, climbing route, expedition details, gear requirements, FAQ accordion, image gallery, related peaks, and map placeholder
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 7.3 Create Day Hike listing page and Day Hike detail page
    - Write `src/app/day-hikes/page.tsx` rendering filterable card grid of all day hikes
    - Write `src/app/day-hikes/[slug]/page.tsx` with `generateStaticParams`, hero, quick facts, overview, route description, FAQ accordion, image gallery, related day hikes, and map placeholder
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 7.4 Create Guide listing page and Guide detail page
    - Write `src/app/guides/page.tsx` rendering filterable card grid of all guides
    - Write `src/app/guides/[slug]/page.tsx` with `generateStaticParams`, hero, article title, author, category badge, content body, and related guides section
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 7.5 Create Region listing page and Region detail page
    - Write `src/app/regions/page.tsx` rendering region grid
    - Write `src/app/regions/[slug]/page.tsx` with `generateStaticParams`, hero, overview, top treks/peaks/day-hikes lists (filtered by region), travel info, image gallery, and related guides
    - Implement cross-referential linking: trek detail links to region, region links to treks
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 18.3_

  - [ ]* 7.6 Write property tests for data-to-card rendering and slug-to-page resolution
    - **Property 1: Data-to-Card Rendering Completeness** — listing page renders exactly one card per mock data entry
    - **Validates: Requirements 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 6.1, 7.1, 8.1, 9.1**
    - **Property 2: Slug-to-Page Data Resolution** — detail page content matches mock data title, description, region
    - **Validates: Requirements 5.2, 6.2, 7.2, 8.2, 9.2**
    - **Property 3: Detail Page Section Completeness** — all required sections present in rendered output
    - **Validates: Requirements 5.3, 6.3, 7.3, 8.3, 9.3**

  - [ ]* 7.7 Write property tests for static generation and cross-referential linking
    - **Property 14: Static Generation for Content Pages** — each route module exports `generateStaticParams` returning an entry for every slug
    - **Validates: Requirements 15.2**
    - **Property 11: Cross-Referential Linking** — detail pages link to their region page, region pages link back to all matching treks/peaks/day-hikes
    - **Validates: Requirements 18.3**

- [x] 8. Homepage
  - [x] 8.1 Create Homepage with hero, featured sections, and newsletter
    - Write `src/app/page.tsx` with:
      - Full-screen hero section (cinematic background placeholder, headline, CTA button)
      - Search shell section (region, difficulty, duration filter UI — no backend)
      - Featured Treks section (ContentCards from mock data)
      - Popular Peaks section (ContentCards from mock data)
      - Best Day Hikes section (ContentCards from mock data)
      - Explore Regions grid (region cards)
      - Latest Guides section (ContentCards from mock data)
      - Newsletter signup section (email input + submit button, UI only)
    - Apply ScrollReveal animations to each section
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 9. Static pages — Gallery, About, Contact
  - [x] 9.1 Create Gallery page with responsive image grid and lightbox
    - Write `src/app/gallery/page.tsx` with responsive masonry/grid of placeholder images
    - Reuse ImageGallery component for lightbox interaction
    - _Requirements: 17.1_

  - [x] 9.2 Create About page and Contact page
    - Write `src/app/about/page.tsx` with mission statement, team section placeholder, platform story
    - Write `src/app/contact/page.tsx` with contact form (name, email, subject, message — UI only)
    - _Requirements: 17.2, 17.3_

- [x] 10. Checkpoint
  - Ensure all pages build successfully with `npm run build`, all `generateStaticParams` functions work, and pages render correct content. Ask the user if questions arise.

- [x] 11. SEO, structured data, and sitemap
  - [x] 11.1 Create SEO metadata utility and apply to all pages
    - Write `src/lib/seo.ts` with `generatePageMetadata` function producing title, description, canonical, OG tags, Twitter Card tags
    - Add `generateMetadata` exports to all dynamic route pages using mock data fields
    - Add static metadata to listing pages and static pages
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 11.2 Create JSON-LD structured data builders and embed on pages
    - Write `src/lib/json-ld.ts` with builders for TouristTrip, Mountain, Article, FAQPage, BreadcrumbList schemas
    - Embed appropriate JSON-LD `<script>` tags on trek, peak, day-hike, guide, and region detail pages
    - _Requirements: 11.4, 11.5, 11.6, 11.7, 11.8_

  - [x] 11.3 Generate XML sitemap and robots.txt
    - Write `src/app/sitemap.ts` generating entries for all static routes + dynamic routes from mock data
    - Write `src/app/robots.ts` allowing all public routes
    - _Requirements: 11.9, 11.10_

  - [ ]* 11.4 Write property tests for SEO metadata, JSON-LD correctness, and sitemap completeness
    - **Property 5: SEO Metadata Completeness** — every content page has non-empty title, description, canonical URL, OG tags, Twitter Card tags
    - **Validates: Requirements 11.1, 11.2, 11.3**
    - **Property 6: JSON-LD Schema Correctness** — correct schema type per content type, BreadcrumbList present, FAQPage present when FAQ data exists
    - **Validates: Requirements 11.4, 11.5, 11.6, 11.7, 11.8**
    - **Property 13: Sitemap Route Completeness** — sitemap has a URL entry for every dynamic route slug plus all static routes
    - **Validates: Requirements 11.9**

- [x] 12. Search, monetization, and polish
  - [x] 12.1 Implement SearchModal with client-side filtering
    - Write `src/lib/search.ts` with `searchContent` function filtering treks, peaks, day-hikes, guides by title
    - Write `src/components/search/SearchModal.tsx` as full-screen overlay with text input and categorized results
    - Handle empty/whitespace queries gracefully
    - Wire search modal to Navigation search icon
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ]* 12.2 Write property test for search filter correctness
    - **Property 9: Search Filter Correctness** — every result title contains the query (case-insensitive), no matching entry is missing from results
    - **Validates: Requirements 12.4**

  - [x] 12.3 Create monetization placeholder components
    - Write `src/components/monetization/AdSlot.tsx` rendering placeholder ad slots
    - Write `src/components/monetization/AffiliateBox.tsx` displaying product image, title, description, CTA link
    - Write `src/components/monetization/NewsletterSignup.tsx` with email input and submit button
    - Place AdSlot components in content page templates at defined positions (after hero, within body, sidebar)
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 12.4 Write property test for affiliate box rendering completeness
    - **Property 15: Affiliate Box Rendering Completeness** — all five props (image, title, description, ctaText, ctaUrl) render in the output
    - **Validates: Requirements 14.2**

- [x] 13. Responsive design and performance verification
  - [x] 13.1 Verify responsive layouts at all breakpoints and fix overflow issues
    - Audit all pages at 320px, 768px, 1024px, and 1440px breakpoints
    - Fix any horizontal overflow between 320px and 2560px
    - Ensure all touch targets are min 44x44px on mobile
    - Verify mobile-first grid layouts (1-col → 2-col → 3-col)
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 13.2 Add custom 404 Not Found page
    - Write `src/app/not-found.tsx` with branded 404 experience and link back to homepage
    - Ensure all dynamic routes call `notFound()` when slug is not found
    - _Requirements: 5.2, 6.2, 7.2, 8.2, 9.2_

- [x] 14. Final checkpoint
  - Run full `npm run build` to verify static generation succeeds for all routes. Ensure no TypeScript errors, no console warnings. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- All content comes from static TypeScript mock data files — no API calls or database queries
- Tech stack: Next.js 15 App Router, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- Dark mode first with glassmorphism aesthetic throughout

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 4, "tasks": ["4.1", "4.2"] },
    { "id": 5, "tasks": ["4.3", "4.4", "5.1", "5.2", "5.3"] },
    { "id": 6, "tasks": ["4.5", "4.6", "5.4"] },
    { "id": 7, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 8, "tasks": ["7.6", "7.7", "8.1"] },
    { "id": 9, "tasks": ["9.1", "9.2"] },
    { "id": 10, "tasks": ["11.1", "11.2", "11.3"] },
    { "id": 11, "tasks": ["11.4", "12.1", "12.3"] },
    { "id": 12, "tasks": ["12.2", "12.4"] },
    { "id": 13, "tasks": ["13.1", "13.2"] }
  ]
}
```
