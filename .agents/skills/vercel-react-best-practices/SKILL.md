---
name: vercel-react-best-practices
description: >-
  Official Vercel React and Next.js performance optimization guidelines. Use when writing, refactoring, or reviewing React 19 components, optimizing page load times, preventing re-renders, reducing bundle sizes, and eliminating network waterfalls in Next.js App Router applications.
---

# Vercel React & Next.js Best Practices

This skill encodes production-proven performance guidelines from Vercel Labs for building lightning-fast React 19 and Next.js 15 applications.

---

## 1. Eliminate Client-Server Waterfalls

### Rule 1.1: Hoist Data Dependencies
- Never trigger secondary data fetches inside `useEffect` on the client when data can be statically baked at build time (SSG) or fetched in parallel.
- In Next.js App Router, prefer Server Components (RSC) to resolve static data at build time.

### Rule 1.2: Parallelize Independent Promises
- If multiple data sets are required, fetch in parallel using `Promise.all` instead of sequential `await`:
```tsx
// GOOD
const [trails, peaks] = await Promise.all([getTreks(), getPeaks()]);

// BAD (Sequential Waterfall)
const trails = await getTreks();
const peaks = await getPeaks();
```

---

## 2. Server vs Client Component Boundaries

### Rule 2.1: Push Client Boundaries to the Leaves
- Keep layout scaffolding, headers, text content, and static media in Server Components.
- Use `"use client"` **only** at leaf nodes that require:
  - Browser APIs (`window`, `localStorage`, `IntersectionObserver`)
  - React State & Effects (`useState`, `useReducer`, `useEffect`, `useRef`)
  - Event Handlers (`onClick`, `onChange`, `onSubmit`)
  - Interactive Libraries (`framer-motion`, `mapbox-gl`)

### Rule 2.2: Pass Server Components as Children
- When a Client Component needs to wrap static content, pass the content as `children`:
```tsx
// Client Component wrapper
"use client";
export function GlassCard({ children }: { children: React.ReactNode }) {
  return <div className="backdrop-blur-md bg-white/5">{children}</div>;
}

// Server Component page
export default function Page() {
  return (
    <GlassCard>
      <StaticTrekSummary data={staticData} />
    </GlassCard>
  );
}
```

---

## 3. Bundle Size & Import Optimization

### Rule 3.1: Direct Icon & Utility Imports
- Avoid barrel-file imports that drag in hundreds of unused modules:
```tsx
// GOOD: Direct or tree-shakeable import
import { ArrowRight, MapPin, Compass } from "lucide-react";

// BAD: Re-exporting huge libraries through global barrels
import * as Icons from "lucide-react";
```

### Rule 3.2: Dynamic Loading for Heavy Third-Party Libraries
- Lazy-load client-only heavyweights (e.g. Mapbox GL, Chart libraries, 3D canvases) using `next/dynamic`:
```tsx
import dynamic from "next/dynamic";

const MapboxViewer = dynamic(
  () => import("@/components/maps/GlobalMapClient"),
  { ssr: false, loading: () => <MapSkeleton /> }
);
```

---

## 4. Re-render Prevention & React 19 Primitives

### Rule 4.1: Synchronize External Stores with `useSyncExternalStore`
- For browser globals (`localStorage`, `window.matchMedia`, custom event buses), use `useSyncExternalStore` instead of `useState + useEffect` to eliminate hydration flicker and cascading re-renders.

### Rule 4.2: Stable Callback References
- Pass callbacks that do not recreate on every render or use inline functions judiciously when passing to heavy animated subtrees.

### Rule 4.3: Avoid Deriving State in Effects
- If a value can be computed from existing props or state, compute it during render:
```tsx
// GOOD: Calculated during render
const filteredTrails = useMemo(() => trails.filter(t => t.difficulty === filter), [trails, filter]);

// BAD: Cascading setState in useEffect
useEffect(() => {
  setFilteredTrails(trails.filter(t => t.difficulty === filter));
}, [filter, trails]);
```

---

## 5. Image & Asset Delivery Optimization

### Rule 5.1: Next.js `<Image />` Best Practices
- Always specify `sizes` when using `fill` on responsive layouts:
  `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Use `priority` only for LCP (Largest Contentful Paint) hero images above the fold (maximum 1 per page).
- Ensure image formats are modern (AVIF, WebP) with caching headers.
