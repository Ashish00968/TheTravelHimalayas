---
name: programmatic-seo-audit
description: >-
  Programmatic SEO, Schema.org JSON-LD structured data, and search engine optimization rules for Discover Himalayan Trails. Use when verifying SEO metadata, generating JSON-LD schemas (TouristTrip, Mountain, FAQPage, BreadcrumbList), updating sitemaps, or optimizing for Generative Engine Optimization (GEO/AI search).
---

# Programmatic SEO & Schema.org Audit

This skill governs search engine optimization and machine-readable structured data to maximize discoverability across Google, Bing, and AI answer engines (ChatGPT, Perplexity, Gemini).

---

## 1. Required Structured Data per Page Type

Every page on `discoverhimalayantrails.com` must inject pre-rendered Schema.org JSON-LD scripts:

### A. Trek & Expedition Detail Pages:
Must emit `TouristTrip` + `BreadcrumbList` + `FAQPage` (if applicable):
```tsx
import { generateTrekJsonLd, generateBreadcrumbJsonLd } from "@/lib/json-ld";

export default function TrekPage({ trek }: { trek: Trek }) {
  const tripSchema = generateTrekJsonLd(trek);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Explore", url: "/explore" },
    { name: trek.territory, url: `/explore/${trek.territorySlug}` },
    { name: trek.name, url: `/explore/${trek.territorySlug}/${trek.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Page Content */}
    </>
  );
}
```

### B. Mountain Peak Pages:
Must emit `Mountain` schema with elevation (`geoElevation`), geographic coordinates (`geo: GeoCoordinates`), and parent mountain range (`containedInPlace`).

### C. FAQ Sections:
Must emit `FAQPage` schema with all Question and Answer pairs matching the rendered text word-for-word.

---

## 2. Meta Tags & Canonical URLs

1. **Title Formula**:
   - `[Entity Name] Guide & Itinerary | Discover Himalayan Trails` (Max 60 chars)
2. **Meta Description**:
   - Must contain exact elevation, region, best season, and trail highlights (135–155 chars).
3. **Canonical Link**:
   - Always absolute URL: `https://discoverhimalayantrails.com/...` (never relative).

---

## 3. Dynamic XML Sitemap Protocol

- Maintained in `src/app/sitemap.ts`.
- Automatically indexes:
  - Static core pages (`/`, `/explore`, `/plan`, `/safety`, `/map`)
  - All 4 territory hubs (`/explore/[state]`)
  - All 16 division hubs (`/explore/[state]/[division]`)
  - All 59 place and trail guides (`/explore/[state]/[division]/[place]`)
  - Planning tools and safety topics
- Must regenerate cleanly upon `npm run build` with `changeFrequency` and `priority` weights.

---

## 4. Image SEO Standards & Semantic Asset Protocols

Images are prime real estate for Google Image Search and organic SERP carousels. Every photo across the platform must adhere to the following 5 pillars:

### A. Semantic File Naming Formula
- **Rule**: Lowercase, hyphen-delimited, keyword-descriptive filenames. Never use camera auto-names (`IMG_1024.jpg`) or arbitrary timestamps (`upload_123.jpg`).
- **Standard Format**: `[trail-or-peak-name]-[subject-or-landmark]-[descriptor]-[region].jpg`
- **Examples**:
  - `vashisht-village-trailhead-jogini-waterfall-manali.jpg`
  - `upper-jogini-waterfall-150ft-cascade-manali.jpg`
  - `patalsu-peak-summit-scree-ridge-solang.jpg`

### B. High-Fidelity `alt` Text Construction
- **Length**: 80–125 characters.
- **Rule**: Must describe the actual visual scene while naturally including primary target entity, elevation milestone, and regional context. Never keyword-stuff.
- **Formula**: `[Entity & Alternate Spelling] — [Visual Subject/Action] ([Elevation Milestone]): [Specific Trail Context]`
- **Example**: `Upper Jogini Waterfall Manali — 150-Foot Majestic Vertical Plunge and Glacial Amphitheater (2,240m)`

### C. Surrounding Semantic DOM Context
- Google analyzes textual anchors adjacent to the `<img>` element.
- Surround each image with semantic context:
  - An `<h3>` title identifying the landmark or trail stage.
  - A `<p>` caption detailing the geographical and hydrological features.
  - Optional `personalNote` or field quote establishing first-person authority (E-E-A-T).

### D. Technical Performance & Layout Stability (CLS Prevention)
- Utilize Next.js `Image` component with explicit aspect ratios (`aspect-[16/10]`, `aspect-[21/11]`) or `fill` with responsive `sizes` attribute:
  ```tsx
  <Image
    src={src}
    alt={meta.seoAlt}
    fill
    loading="lazy"
    sizes="(max-width: 1024px) 100vw, 66vw"
    className="object-cover"
  />
  ```
- Lazy-load all images below the fold; eager-load / prioritize only the above-the-fold hero wallpaper.

### E. Structured ImageObject & Social Graph Metadata
- Every page must declare a 1200x630 high-resolution OpenGraph image in `generatePageMetadata`.
- Include `ImageObject` markup within `TouristTrip` or `Mountain` schemas specifying `contentUrl`, `caption`, and creator credit.

---

## 5. Long-Tail Keyword & SERP PAA Harvesting Workflow

To capture dominant organic rankings across low-competition long-tail queries and Google SERP features:

### A. Dual-Spelling & Phonetic Regional Strategy
- Many Himalayan entities have dual spellings between official revenue records and colloquial phonetics:
  - `Jogini Waterfall` (Mainstream search volume ~85%) vs `Jogni Falls` (Low-KD local search ~15%).
  - `Rohtang Pass` vs `Rotang Pass`.
  - `Beas Kund` vs `Vyas Kund`.
- **Protocol**: Target the low-KD variation in specific H2/H3 headings and photo alt tags to achieve quick #1 rankings, while keeping the high-volume variant in primary page titles, URLs, and JSON-LD schemas.

### B. "People Also Ask" (PAA) Schema Harvesting
- Inspect Google SERP PAA dropdowns for the target query.
- Copy questions **verbatim** into the entity's `faqs` array in `src/data/treks/` or `src/data/peaks/`.
- Provide direct, concise answers (40–60 words) starting with the direct answer in the first sentence to trigger Google Featured Snippets and AI Overviews.
- Include intent clusters:
  1. **Logistics**: "How long is...", "How to reach... from [hub]", "Where to park..."
  2. **Seasonal**: "Can you visit in winter?", "Trail conditions in [Month]"
  3. **Attraction**: "Why is [entity] famous?", "Is it open now?", "Entry fees and permits"
  4. **Safety & Terrain**: "Is it safe for beginners?", "Difference between Lower and Upper..."

