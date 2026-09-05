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
