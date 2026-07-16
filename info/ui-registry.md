# UI Component Registry

This registry tracks the visual patterns extracted from the codebase to ensure consistency in all future UI components.

## Core Patterns

### 1. The "Interactive Card" Pattern (`ContentCard.tsx`)
- **Aspect Ratio**: `aspect-[4/5] sm:aspect-[3/4]`
- **Border Radius**: `rounded-2xl`
- **Overflow**: `overflow-hidden`
- **Image Hover Effect**: `group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`
- **Gradient Overlay**: `absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300`
- **Typography (Card Title)**: `font-heading text-2xl font-medium text-white mb-2 group-hover:text-primary transition-colors leading-tight`
- **Typography (Description)**: `text-sm text-white/60 line-clamp-2 leading-relaxed`

### 2. Badges & Tags
- **Pill Badge**: `text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white font-medium backdrop-blur-md`
- **Meta Info Divider**: `w-1 h-1 rounded-full bg-white/20`

### 3. The "Interactive Button" & Navigation (`Navigation.tsx`)
- **Nav Links (Desktop)**: `text-sm tracking-wide transition-all duration-200` (active state uses primary color and bottom indicator)
- **Active Indicator**: `absolute -bottom-1.5 left-0 w-full h-[1px] bg-primary rounded-full`
- **Primary CTA Button**: `py-4 rounded-full bg-primary text-primary-foreground font-medium text-base hover:bg-primary/90`
- **Icon Buttons**: `p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors`

### 4. Glassmorphism & Overlays
- **Header (Scrolled state)**: `bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-[0_2px_24px_rgba(0,0,0,0.4)]`
- **Full Screen Overlay**: `bg-background/95 backdrop-blur-3xl`
- **Glass Card (New)**: `glass-card p-4 rounded-2xl transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 border-white/10 group`
- **Glass Floating Action**: `w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors`

### 5. Animations & Easing
- **Custom Easing**: `ease-[cubic-bezier(0.23,1,0.32,1)]` is used extensively for smooth, premium motion. This is exported as `TRANSITION_EASE` in components.
- **Slide-In Indicator (ArrowRight)**: `opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]`
- **Staggered Entrances**: `framer-motion` `staggerChildren: 0.1` used on list containers (e.g. `ImageGallery`, `RelatedContent`, `ContactForm`) to cascade animations.
- **Item Entrance**: Items fade in and slide up (`y: 20 -> 0`) or slide right (`x: -10 -> 0`) using the signature cubic-bezier ease.

### 6. Forms (Stitch AI / Alpine Obsidian)
- **Inputs**: Minimalist dark inputs with a single bottom border.
- **Input Style**: `bg-white/5 border-0 border-b border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-primary`
- **Labels**: `text-xs font-semibold uppercase tracking-wider text-white/70`

### 7. Layouts & Containers
- **Horizontal Scrolling List**: `flex gap-6 overflow-x-auto px-6 pb-12 snap-x scroll-smooth no-scrollbar max-w-7xl mx-auto` with `snap-start shrink-0` on children.
