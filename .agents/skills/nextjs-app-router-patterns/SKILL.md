---
name: nextjs-app-router-patterns
description: >-
  Next.js 15 App Router architectural patterns and static export (SSG) rules. Use when creating new pages or layouts, configuring static site generation, writing route handlers, optimizing edge caching, or integrating Cloudflare Pages Functions.
---

# Next.js 15 App Router Patterns

This skill guides engineering within Next.js 15 App Router with full static export (`output: "export"`) and Cloudflare Edge deployment.

---

## 1. Static Export (`output: "export"`) Constraints

Our platform uses `output: "export"` in `next.config.ts` for sub-millisecond CDN delivery across Cloudflare Pages.

### Strict Rules:
1. **No Runtime Server APIs in Pages**:
   - Do NOT use `cookies()`, `headers()`, or `searchParams` as dynamic runtime promises in Server Components without static params.
   - Do NOT use `export const dynamic = "force-dynamic"` on exported static pages.
2. **Every Dynamic Route Must Implement `generateStaticParams()`**:
   - For `app/explore/[state]/page.tsx`, export:
     ```tsx
     export function generateStaticParams() {
       return Object.keys(TERRITORIES).map((state) => ({ state }));
     }
     ```
   - For nested routes `[state]/[division]/[place]/page.tsx`, generate all valid path combinations at build time.
3. **Dynamic Server APIs Belong in Cloudflare Functions**:
   - Put all serverless endpoints requiring runtime execution (e.g. newsletter subscriptions, form webhooks) in `functions/api/` (e.g. `functions/api/newsletter.ts`).
   - Do NOT create `src/app/api/` routes that fail static export.

---

## 2. Dynamic SEO & Metadata Generation

Every page must define authoritative metadata using `generateMetadata()`:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, place } = await params;
  const data = getPlaceData(state, place);

  return {
    title: `${data.title} Guide | Discover Himalayan Trails`,
    description: data.summary,
    alternates: {
      canonical: `https://discoverhimalayantrails.com/explore/${state}/${place}`,
    },
    openGraph: {
      title: data.title,
      description: data.summary,
      images: [{ url: data.heroImage, width: 1200, height: 630, alt: data.title }],
    },
  };
}
```

---

## 3. Layouts & Error Scaffolding

### Hierarchy:
- Root layout (`app/layout.tsx`): Persistent navigation, global theme provider, footer, analytics script, global CSS.
- Feature layouts (`app/explore/layout.tsx`): Section-specific navigation bars or sticky docks.
- Custom 404 (`app/not-found.tsx`): Static branded error page.

---

## 4. Verification Checklist

Before completing any App Router changes:
1. `npx tsc --noEmit` to verify type safety.
2. `npm run lint` for React 19 hook compliance.
3. `npm run build` to ensure all static pages (111+) export without errors.
