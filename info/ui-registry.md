# UI Component Registry (Deep Black Obsidian Aesthetic)

This registry documents the design tokens and visual patterns used across The Himalayan Trails to maintain visual excellence, consistency, and performance.

## Core Design Tokens

### Color Palette
- **Deep Black Background:** `#000000` (Pure Obsidian Black)
- **Card Surfaces:** `#0c0c0e` (Primary Card Surface), `#121216` (Card Hover Surface), `#18181b` (Elevated Layers)
- **Borders & Dividers:** `border-white/10` (`rgba(255, 255, 255, 0.1)`), `#1a1a1a`
- **Primary Accent:** Action Blue `#0066cc`, Focus State `#0071e3`, Subtle Glow `rgba(0, 102, 204, 0.15)`
- **Typography Colors:**
  - Headings: `#ffffff` (Pure White, 100%)
  - Subheadings/Body: `text-white/80` to `text-white/65`
  - Metadata & Labels: `text-white/50` to `text-white/40`
  - Badges & Accents: `text-primary` with `bg-primary/10` and `border-primary/20`

### Typography System
- **Display Headings:** `font-display tracking-tight font-semibold` (for page titles, hero headers, region names)
- **Body & Editorial:** `font-sans font-light leading-relaxed`
- **Monospace Metadata:** `font-mono text-xs uppercase tracking-widest` (for difficulty badges, elevation markers, dates, author bylines)

### Border Radii
- **Cards & Banners:** `rounded-2xl` (16px) to `rounded-3xl` (24px)
- **Pill Buttons & Badges:** `rounded-full`
- **Inputs & Smaller Containers:** `rounded-xl` (12px)

---

## Component Patterns

### 1. The Obsidian Card Pattern (`ContentCard.tsx`, Division Cards, Region Cards)
- **Container:** `bg-[#0c0c0e] hover:bg-[#121216] border border-white/10 hover:border-primary/40 rounded-3xl p-7 transition-all duration-300 shadow-xl flex flex-col justify-between`
- **Top Row:** Emoji icon or category badge (`bg-primary/10 text-primary border border-primary/20 rounded-full font-mono text-[11px] px-3 py-1`)
- **Title:** `font-display font-semibold text-xl sm:text-2xl text-white group-hover:text-primary transition-colors`
- **Description:** `text-white/65 text-sm line-clamp-2 leading-relaxed font-light`
- **Bottom Metadata Bar:** `border-t border-white/5 pt-4 flex items-center justify-between`

### 2. Category Filter Pill Bar (`DivisionClient.tsx`, `SafetyClient.tsx`)
- **Container:** `flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0c0c0e] border border-white/10 w-fit`
- **Active Tab:** `bg-primary text-white font-semibold shadow-md shadow-primary/30 rounded-xl font-mono text-xs uppercase tracking-wider`
- **Inactive Tab:** `text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-mono text-xs uppercase tracking-wider`
- **Count Badge:** `text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white` (Active) / `bg-white/5 text-white/40` (Inactive)

### 3. Featured Photo Showcase Banner (`PlacePage`)
- **Aspect Ratio:** `aspect-[16/9] md:aspect-[21/9] max-h-[500px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl group`
- **Image:** Full-color `next/image` with `fill`, `object-cover`, and `group-hover:scale-105 transition-transform duration-700`
- **Overlays:** Gradient vignette from `black/80` to transparent, floating expedition badge, and elevation marker.

### 4. Ambient Hero Section (`HeroSection.tsx`, `ParallaxHero`)
- **Ambient Glow:** Radial glow mesh using `bg-primary/10 rounded-full blur-[140px]`
- **Subtle Texture:** Dot matrix overlay `bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]`
- **Hierarchy:** Monospace pill badge -> Display title (gradient text) -> Supporting lead -> Pill CTA buttons

### 5. Floating Sticky Navigation (`Navigation.tsx`)
- **Nav Header:** `frosted-glass-dark` with `backdrop-blur-[20px] bg-black/80 border-b border-white/10`
- **Active Link Indicator:** Animated `layoutId="activeNav"` underline with `bg-primary shadow-[0_0_8px_rgba(0,102,204,0.6)]`

### 6. Detail & Accordion Elements (`QuickFacts.tsx`, `FAQAccordion.tsx`)
- **Quick Facts Grid:** Key-value pairs in glowing dark containers with primary accent values
- **Itinerary Timeline:** Numbered circular badge with vertical gradient border connector
