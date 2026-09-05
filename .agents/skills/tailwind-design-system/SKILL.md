---
name: tailwind-design-system
description: >-
  Design tokens, color psychology, and UI component standards for Discover Himalayan Trails. Use when styling components, building responsive layouts, implementing glassmorphism, styling territory badges, or ensuring dual-theme (Light & Dark) accessibility.
---

# Himalayan Tailwind Design System

This skill defines the visual language, design tokens, and aesthetic principles for **Discover Himalayan Trails**.

---

## 1. Palette & Territory Color Science

### Base Midnight-Indigo Palette:
- **Midnight Deep (Base)**: `#040812` (Background in dark mode)
- **Alpine Rock (Surface)**: `#080e1a` (Elevated containers)
- **Mountain Shadow (Card)**: `#0d1422` (Interactive cards)
- **Glacier Blue (Primary)**: `#3B82F6` (Action buttons, brand primary)
- **Snow White (Text Primary)**: `#FFFFFF` / `text-white`
- **Glacier Ice (Text Secondary)**: `#93C5FD` / `text-blue-200`

### Territory Accents:
Each Himalayan territory possesses a verified design accent used for borders, jewel pips, and glowing aura:
- **Jammu & Kashmir**: `#3B82F6` (Glacier Blue)
- **Himachal Pradesh**: `#F59E0B` (Alpenglow Gold)
- **Ladakh**: `#7C3AED` (Twilight Violet)
- **Uttarakhand**: `#0D9488` (Alpine Teal)

---

## 2. Dual-Theme Semantic Tokens

Never hardcode raw `#040812` or `bg-black` onto generic UI containers. Always use semantic CSS variables mapped in `tailwind.config.ts` and `globals.css`:

```tsx
// GOOD: Theme-adaptive classes
<div className="bg-card text-card-foreground border border-border">
  <h3 className="text-foreground">Hampta Pass</h3>
  <p className="text-muted-foreground">Panoramic crossover trek</p>
</div>

// BAD: Hardcoded dark-only colors
<div className="bg-[#040812] text-white border border-white/10">
  ...
</div>
```

---

## 3. Frosted Glassmorphism Patterns

### Standard Glass Museum Card:
```tsx
<div className="glass-museum-card p-6 rounded-2xl border border-white/15 dark:border-white/10 bg-white/[0.04] dark:bg-[#0A1122]/60 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.01] hover:border-white/25">
  {children}
</div>
```

### Capsule Action Pill:
```tsx
<button className="glass-capsule px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border border-white/15 hover:bg-white/10 active:scale-95 transition-all">
  {label}
</button>
```

---

## 4. Typography Hierarchy

- **Brand & Headings**: `'Playfair Display', serif` (`font-serif`) with italic accenting for editorial elegance.
- **Display & Interface**: `'Plus Jakarta Sans', sans-serif` (`font-display`).
- **Telemetry & Technical Specs**: `'JetBrains Mono', monospace` (`font-mono`) for altitudes, durations, coordinates, and pass grades.

---

## 5. Responsive & Touch Guidelines

- **Mobile First**: Design down to 320px screens. Test at 375px (iPhone SE), 768px (iPad), and 1440px (Desktop).
- **Minimum Tap Target**: All interactive controls must be at least 44px × 44px (`min-h-[44px]`).
- **Print Optimization**: Ensure cards use `break-inside: avoid` for `@media print` exports.
