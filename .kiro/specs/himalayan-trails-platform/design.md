# Design Document

## Architecture Overview

The Himalayan Trails Platform is a statically generated Next.js 15 App Router application. All content is sourced from TypeScript mock data files at build time. The architecture follows a layered approach:

1. **Data Layer** — TypeScript files exporting typed mock data arrays for each content type
2. **Component Layer** — Reusable UI primitives (Shadcn UI) and domain-specific components
3. **Page Layer** — App Router pages consuming data and composing components
4. **SEO Layer** — Metadata generation and JSON-LD structured data utilities
5. **Animation Layer** — Framer Motion wrappers and scroll-triggered animation hooks

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with Navigation + Footer
│   ├── page.tsx                  # Homepage
│   ├── treks/
│   │   ├── page.tsx              # Trek listing
│   │   └── [slug]/page.tsx       # Trek detail
│   ├── peaks/
│   │   ├── page.tsx              # Peak listing
│   │   └── [slug]/page.tsx       # Peak detail
│   ├── day-hikes/
│   │   ├── page.tsx              # Day hike listing
│   │   └── [slug]/page.tsx       # Day hike detail
│   ├── guides/
│   │   ├── page.tsx              # Guide listing
│   │   └── [slug]/page.tsx       # Guide detail
│   ├── regions/
│   │   ├── page.tsx              # Region listing
│   │   └── [slug]/page.tsx       # Region detail
│   ├── gallery/page.tsx          # Gallery page
│   ├── about/page.tsx            # About page
│   ├── contact/page.tsx          # Contact page
│   └── sitemap.ts                # Dynamic sitemap generation
├── components/
│   ├── ui/                       # Shadcn UI primitives
│   ├── layout/
│   │   ├── Navigation.tsx        # Fixed glassmorphism header
│   │   ├── Footer.tsx            # Site-wide footer
│   │   └── Breadcrumbs.tsx       # Breadcrumb navigation
│   ├── content/
│   │   ├── ContentCard.tsx       # Generic content card
│   │   ├── HeroSection.tsx       # Reusable hero section
│   │   ├── FAQAccordion.tsx      # FAQ accordion component
│   │   ├── RelatedContent.tsx    # Related content section
│   │   ├── QuickFacts.tsx        # Sidebar facts component
│   │   └── ImageGallery.tsx      # Image gallery with lightbox
│   ├── media/
│   │   ├── CloudinaryImage.tsx   # Image component with Cloudinary-ready props
│   │   └── BlurPlaceholder.tsx   # Blur placeholder utility
│   ├── search/
│   │   └── SearchModal.tsx       # Global search overlay
│   ├── monetization/
│   │   ├── AdSlot.tsx            # AdSense placeholder
│   │   ├── AffiliateBox.tsx      # Affiliate product box
│   │   └── NewsletterSignup.tsx  # Newsletter form
│   └── animation/
│       ├── PageTransition.tsx    # Route transition wrapper
│       ├── ScrollReveal.tsx      # Scroll-triggered animation wrapper
│       └── MotionCard.tsx        # Hover-animated card wrapper
├── data/
│   ├── treks.ts                  # Trek mock data
│   ├── peaks.ts                  # Peak mock data
│   ├── day-hikes.ts              # Day hike mock data
│   ├── guides.ts                 # Guide mock data
│   ├── regions.ts                # Region mock data
│   └── types.ts                  # Shared TypeScript interfaces
├── lib/
│   ├── seo.ts                    # Metadata generation utilities
│   ├── json-ld.ts                # JSON-LD schema builders
│   ├── search.ts                 # Client-side search filtering
│   ├── related-content.ts        # Related content filtering logic
│   ├── breadcrumbs.ts            # Breadcrumb path builder
│   └── cloudinary.ts             # Cloudinary URL builder utility
└── styles/
    └── globals.css               # Tailwind base + glassmorphism utilities
```

## Components

### Layout Components

#### Navigation

Fixed-position header with glassmorphism backdrop. Contains logo, desktop link list, search icon trigger, and mobile hamburger toggle.

```typescript
// components/layout/Navigation.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SearchModal } from "@/components/search/SearchModal";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Treks", href: "/treks" },
  { label: "Peaks", href: "/peaks" },
  { label: "Day Hikes", href: "/day-hikes" },
  { label: "Regions", href: "/regions" },
  { label: "Guides", href: "/guides" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full glass-nav">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-foreground">
          TheHimalayanTrails
        </Link>
        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Search + Mobile toggle */}
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSearchOpen(true)} aria-label="Open search" className="p-2 min-w-[44px] min-h-[44px]">
            {/* Search icon */}
          </button>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden p-2 min-w-[44px] min-h-[44px]" aria-label="Toggle menu">
            {/* Hamburger icon */}
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden glass-panel p-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="block py-3 text-foreground" onClick={() => setIsMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </header>
  );
}
```

#### Footer

Site-wide footer with link columns, newsletter signup, and social icons.

```typescript
// components/layout/Footer.tsx
import Link from "next/link";
import { NewsletterSignup } from "@/components/monetization/NewsletterSignup";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-foreground mb-4">Explore</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/treks">Treks</Link>
            <Link href="/peaks">Peaks</Link>
            <Link href="/day-hikes">Day Hikes</Link>
            <Link href="/regions">Regions</Link>
            <Link href="/guides">Guides</Link>
          </nav>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-4">Company</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/gallery">Gallery</Link>
          </nav>
        </div>
        <div className="md:col-span-2">
          <NewsletterSignup />
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
        <p className="text-sm text-foreground/60">© 2024 TheHimalayanTrails. All rights reserved.</p>
        <div className="flex gap-4">{/* Social media icon links */}</div>
      </div>
    </footer>
  );
}
```

#### Breadcrumbs

Generates breadcrumb trail from URL path segments.

```typescript
// lib/breadcrumbs.ts
export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function buildBreadcrumbs(pathname: string, title?: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = isLast && title ? title : segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: currentPath });
  });

  return crumbs;
}
```

### Content Components

#### ContentCard

Generic card component used across listing pages and featured sections.

```typescript
// components/content/ContentCard.tsx
import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { MotionCard } from "@/components/animation/MotionCard";

interface ContentCardProps {
  title: string;
  slug: string;
  basePath: string;
  image: string;
  description: string;
  badges?: string[];
  meta?: { label: string; value: string }[];
}

export function ContentCard({ title, slug, basePath, image, description, badges, meta }: ContentCardProps) {
  return (
    <MotionCard>
      <Link href={`${basePath}/${slug}`} className="block glass-card rounded-xl overflow-hidden group">
        <div className="aspect-[16/10] relative overflow-hidden">
          <CloudinaryImage src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-foreground/70 line-clamp-2">{description}</p>
          {badges && (
            <div className="flex flex-wrap gap-2 mt-3">
              {badges.map((badge) => (
                <span key={badge} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{badge}</span>
              ))}
            </div>
          )}
          {meta && (
            <div className="flex gap-4 mt-3 text-xs text-foreground/60">
              {meta.map((m) => (
                <span key={m.label}>{m.label}: {m.value}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </MotionCard>
  );
}
```

#### RelatedContent

Filters and displays related items based on shared region or difficulty.

```typescript
// lib/related-content.ts
interface ContentItem {
  slug: string;
  region: string;
  difficulty?: string;
}

export function getRelatedContent<T extends ContentItem>(
  current: T,
  allItems: T[],
  limit: number = 3
): T[] {
  return allItems
    .filter(
      (item) =>
        item.slug !== current.slug &&
        (item.region === current.region || item.difficulty === current.difficulty)
    )
    .slice(0, limit);
}
```

### Media Components

#### CloudinaryImage

Wraps Next.js Image with Cloudinary-ready URL transformation props.

```typescript
// lib/cloudinary.ts
export interface CloudinaryTransform {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif";
  crop?: "fill" | "fit" | "scale";
}

export function buildCloudinaryUrl(
  src: string,
  transforms: CloudinaryTransform = {}
): string {
  // In this phase, return the src unchanged (placeholder images).
  // When Cloudinary is integrated, this will construct the transformation URL.
  const { width, height, quality = 80, format = "auto", crop = "fill" } = transforms;
  // Future: return `https://res.cloudinary.com/.../${transformString}/${src}`;
  return src;
}

// components/media/CloudinaryImage.tsx
import Image, { ImageProps } from "next/image";
import { buildCloudinaryUrl, CloudinaryTransform } from "@/lib/cloudinary";

interface CloudinaryImageProps extends Omit<ImageProps, "src"> {
  src: string;
  transforms?: CloudinaryTransform;
}

export function CloudinaryImage({ src, transforms, alt, ...props }: CloudinaryImageProps) {
  const url = buildCloudinaryUrl(src, transforms);

  return (
    <Image
      src={url}
      alt={alt}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
      loading={props.priority ? undefined : "lazy"}
      {...props}
    />
  );
}
```

### Search Components

#### SearchModal

Full-screen overlay with client-side filtering across all content types.

```typescript
// lib/search.ts
import { treks } from "@/data/treks";
import { peaks } from "@/data/peaks";
import { dayHikes } from "@/data/day-hikes";
import { guides } from "@/data/guides";

export interface SearchResult {
  title: string;
  slug: string;
  category: "trek" | "peak" | "day-hike" | "guide";
  basePath: string;
}

export function searchContent(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();

  const results: SearchResult[] = [];

  treks.forEach((t) => {
    if (t.title.toLowerCase().includes(normalizedQuery)) {
      results.push({ title: t.title, slug: t.slug, category: "trek", basePath: "/treks" });
    }
  });

  peaks.forEach((p) => {
    if (p.title.toLowerCase().includes(normalizedQuery)) {
      results.push({ title: p.title, slug: p.slug, category: "peak", basePath: "/peaks" });
    }
  });

  dayHikes.forEach((d) => {
    if (d.title.toLowerCase().includes(normalizedQuery)) {
      results.push({ title: d.title, slug: d.slug, category: "day-hike", basePath: "/day-hikes" });
    }
  });

  guides.forEach((g) => {
    if (g.title.toLowerCase().includes(normalizedQuery)) {
      results.push({ title: g.title, slug: g.slug, category: "guide", basePath: "/guides" });
    }
  });

  return results;
}
```

### Animation Components

#### PageTransition

Wraps page content with Framer Motion enter/exit animations, respecting reduced motion.

```typescript
// components/animation/PageTransition.tsx
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
```

#### ScrollReveal

Scroll-triggered animation wrapper using Intersection Observer + Framer Motion.

```typescript
// components/animation/ScrollReveal.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

#### MotionCard

Hover animation wrapper for cards.

```typescript
// components/animation/MotionCard.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
}

export function MotionCard({ children }: MotionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <>{children}</>;

  return (
    <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}
```

### Monetization Components

#### AffiliateBox

Reusable affiliate product recommendation component.

```typescript
// components/monetization/AffiliateBox.tsx
import { CloudinaryImage } from "@/components/media/CloudinaryImage";

interface AffiliateBoxProps {
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

export function AffiliateBox({ image, title, description, ctaText, ctaUrl }: AffiliateBoxProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex gap-4 items-center">
      <div className="w-20 h-20 relative flex-shrink-0">
        <CloudinaryImage src={image} alt={title} fill className="object-cover rounded-lg" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-foreground/70 mt-1">{description}</p>
        <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-primary hover:underline">
          {ctaText} →
        </a>
      </div>
    </div>
  );
}
```

### SEO Utilities

#### Metadata Generation

```typescript
// lib/seo.ts
import { Metadata } from "next";

interface SeoParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

const BASE_URL = "https://thehimalayantrails.com";

export function generatePageMetadata({ title, description, path, image, type = "website" }: SeoParams): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/og-default.jpg`;

  return {
    title: `${title} | TheHimalayanTrails`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
```

#### JSON-LD Builders

```typescript
// lib/json-ld.ts
import { Trek, Peak, Guide, DayHike } from "@/data/types";
import { BreadcrumbItem } from "@/lib/breadcrumbs";

export function buildTouristTripJsonLd(item: Trek | DayHike) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: item.title,
    description: item.overview,
    touristType: "Adventure",
  };
}

export function buildMountainJsonLd(peak: Peak) {
  return {
    "@context": "https://schema.org",
    "@type": "Mountain",
    name: peak.title,
    description: peak.overview,
    elevation: { "@type": "QuantitativeValue", value: peak.height, unitCode: "MTR" },
  };
}

export function buildArticleJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    author: { "@type": "Person", name: guide.author },
    description: guide.description,
  };
}

export function buildFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://thehimalayantrails.com${item.href}`,
    })),
  };
}
```

## Data Models

### TypeScript Interfaces

```typescript
// data/types.ts

export interface Trek {
  slug: string;
  title: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging";
  duration: string;
  distance: string;
  maxAltitude: string;
  bestSeason: string;
  overview: string;
  routeDescription: string;
  itinerary: { day: number; title: string; description: string }[];
  packingList: string[];
  permits: string;
  faqs: { question: string; answer: string }[];
  images: string[];
  heroImage: string;
  description: string;
}

export interface Peak {
  slug: string;
  title: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging";
  height: number;
  expeditionSeason: string;
  baseCamp: string;
  overview: string;
  climbingRoute: string;
  expeditionDetails: string;
  gearRequirements: string[];
  faqs: { question: string; answer: string }[];
  images: string[];
  heroImage: string;
  description: string;
}

export interface DayHike {
  slug: string;
  title: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
  duration: string;
  distance: string;
  overview: string;
  routeDescription: string;
  faqs: { question: string; answer: string }[];
  images: string[];
  heroImage: string;
  description: string;
}

export interface Guide {
  slug: string;
  title: string;
  category: string;
  author: string;
  description: string;
  content: string;
  featuredImage: string;
  heroImage: string;
  relatedGuides: string[];
}

export interface Region {
  slug: string;
  title: string;
  overview: string;
  travelInfo: string;
  images: string[];
  heroImage: string;
  description: string;
}
```

## Interfaces

### Page Props Pattern

Each dynamic route page receives params from Next.js App Router:

```typescript
// app/treks/[slug]/page.tsx
import { treks } from "@/data/treks";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return treks.map((trek) => ({ slug: trek.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const trek = treks.find((t) => t.slug === params.slug);
  if (!trek) return {};
  return generatePageMetadata({
    title: trek.title,
    description: trek.description,
    path: `/treks/${trek.slug}`,
    image: trek.heroImage,
  });
}

export default function TrekPage({ params }: PageProps) {
  const trek = treks.find((t) => t.slug === params.slug);
  if (!trek) notFound();
  // Render trek detail sections...
}
```

### Listing Page Pattern

Each listing page renders a filterable grid of content cards:

```typescript
// app/treks/page.tsx
import { treks } from "@/data/treks";
import { ContentCard } from "@/components/content/ContentCard";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Himalayan Treks",
  description: "Explore the best trekking routes in the Himalayas",
  path: "/treks",
});

export default function TreksListingPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-foreground mb-8">Himalayan Treks</h1>
      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treks.map((trek) => (
          <ContentCard
            key={trek.slug}
            title={trek.title}
            slug={trek.slug}
            basePath="/treks"
            image={trek.heroImage}
            description={trek.description}
            badges={[trek.difficulty, trek.region]}
            meta={[
              { label: "Duration", value: trek.duration },
              { label: "Altitude", value: trek.maxAltitude },
            ]}
          />
        ))}
      </div>
    </section>
  );
}
```

## Styling Architecture

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#A78BFA",
        background: "#09090B",
        foreground: "#F8FAFC",
        accent: "#C4B5FD",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-plus-jakarta)"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Glassmorphism Utilities

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .glass-nav {
    @apply backdrop-blur-xl bg-background/70 border-b border-white/10;
  }

  .glass-card {
    @apply backdrop-blur-md bg-white/5 border border-white/10;
  }

  .glass-panel {
    @apply backdrop-blur-xl bg-background/80 border border-white/10;
  }
}
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-background text-foreground font-sans">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## Error Handling

### Not Found Handling

Every dynamic route uses `notFound()` from Next.js when a slug does not match any mock data entry:

```typescript
import { notFound } from "next/navigation";

const item = items.find((i) => i.slug === params.slug);
if (!item) notFound();
```

A custom `not-found.tsx` page at the app root provides a branded 404 experience.

### Image Fallbacks

The `CloudinaryImage` component handles missing images gracefully by providing a fallback placeholder:

```typescript
const FALLBACK_IMAGE = "/images/placeholder-mountain.jpg";

export function CloudinaryImage({ src, ...props }: CloudinaryImageProps) {
  const url = src || FALLBACK_IMAGE;
  // ...render with fallback
}
```

### Search Edge Cases

The search utility handles empty queries, whitespace-only input, and special characters:

```typescript
export function searchContent(query: string): SearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  // Filter logic...
}
```

## Performance Strategy

| Technique | Implementation |
|-----------|---------------|
| Static Generation | All content pages use `generateStaticParams()` for full SSG |
| Code Splitting | App Router automatic per-route splitting + dynamic imports for heavy components |
| Image Optimization | Next.js Image with responsive srcSet, lazy loading, blur placeholders, WebP |
| Font Optimization | `next/font` with `display: swap` to prevent FOIT |
| Bundle Minimization | Tree-shaking via ESM, no barrel exports for large modules |
| Animation Performance | Framer Motion `will-change` hints, GPU-accelerated transforms only |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Data-to-Card Rendering Completeness

*For any* set of mock data entries of a given content type (treks, peaks, day hikes, guides, regions), the corresponding listing page and homepage featured section SHALL render exactly one card for each entry in the data set.

**Validates: Requirements 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 6.1, 7.1, 8.1, 9.1**

### Property 2: Slug-to-Page Data Resolution

*For any* valid slug in a mock data collection, the dynamic detail page at `/{content-type}/[slug]` SHALL render content that matches the title, description, and region fields of the corresponding mock data entry.

**Validates: Requirements 5.2, 6.2, 7.2, 8.2, 9.2**

### Property 3: Detail Page Section Completeness

*For any* content entry rendered as a detail page, all required sections defined for that content type (hero, quick facts/info card, overview, gallery, FAQ accordion, and related content) SHALL be present in the rendered output.

**Validates: Requirements 5.3, 6.3, 7.3, 8.3, 9.3**

### Property 4: Related Content Filter Correctness

*For any* content item displayed on a detail page, every item in the Related Content section SHALL share at least one attribute (region or difficulty) with the current item, and the current item SHALL NOT appear in its own related content list.

**Validates: Requirements 5.4, 9.4, 18.1**

### Property 5: SEO Metadata Completeness

*For any* content page generated from mock data, the page metadata SHALL include a non-empty title, meta description, canonical URL matching the page path, Open Graph tags (og:title, og:description, og:image, og:url), and Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image).

**Validates: Requirements 11.1, 11.2, 11.3**

### Property 6: JSON-LD Schema Correctness

*For any* content entry with a defined content type, the embedded JSON-LD SHALL use the correct schema type (TouristTrip for treks/day-hikes, Mountain for peaks, Article for guides) and SHALL include valid BreadcrumbList schema. For any entry with FAQ data, FAQPage schema SHALL also be embedded.

**Validates: Requirements 11.4, 11.5, 11.6, 11.7, 11.8**

### Property 7: Image Component Rendering Behavior

*For any* valid image props passed to the CloudinaryImage component, the rendered output SHALL include `placeholder="blur"` with a blurDataURL, and non-priority images SHALL have `loading="lazy"`.

**Validates: Requirements 10.1, 10.2, 10.3**

### Property 8: Cloudinary URL Transformation

*For any* set of Cloudinary transformation parameters (width, height, quality, format, crop), the `buildCloudinaryUrl` function SHALL accept the parameters and return a string URL without throwing an error.

**Validates: Requirements 10.4**

### Property 9: Search Filter Correctness

*For any* non-empty search query string and the full set of mock data entries, every item in the search results SHALL have a title that contains the query string (case-insensitive), and no mock data entry whose title contains the query string SHALL be absent from the results.

**Validates: Requirements 12.4**

### Property 10: Breadcrumb Path Correctness

*For any* content page with URL path `/a/b/c`, the breadcrumb navigation SHALL produce items starting with "Home" at `/` and including one item for each path segment in order, with the final item matching the current page title.

**Validates: Requirements 18.2**

### Property 11: Cross-Referential Linking

*For any* content item that has a region field, the rendered detail page SHALL contain a link to `/regions/{region-slug}`. For any region page, it SHALL contain links to all treks, peaks, and day hikes that share that region value.

**Validates: Requirements 18.3**

### Property 12: Reduced Motion Respect

*For any* animation component (PageTransition, ScrollReveal, MotionCard), when the `prefers-reduced-motion` preference is active, the component SHALL render its children with no motion variants (identity transform, no opacity animation).

**Validates: Requirements 13.4**

### Property 13: Sitemap Route Completeness

*For any* set of mock data entries across all content types, the generated XML sitemap SHALL contain a `<url>` entry for each dynamic route (`/treks/{slug}`, `/peaks/{slug}`, `/day-hikes/{slug}`, `/guides/{slug}`, `/regions/{slug}`) plus all static routes.

**Validates: Requirements 11.9**

### Property 14: Static Generation for Content Pages

*For any* content type (treks, peaks, day-hikes, guides, regions), the route module SHALL export a `generateStaticParams` function that returns an entry for every slug in the corresponding mock data collection.

**Validates: Requirements 15.2**

### Property 15: Affiliate Box Rendering Completeness

*For any* valid set of AffiliateBox props (image, title, description, ctaText, ctaUrl), the rendered component SHALL display all five fields in the output.

**Validates: Requirements 14.2**
