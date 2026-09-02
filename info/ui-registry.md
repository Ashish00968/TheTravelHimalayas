# UI Component Registry — Himalayan Design System

This registry documents the active design tokens, visual patterns, and component rules across **The Himalayan Trails**.

---

## 1. Core Design Tokens

### Background Palette (Midnight-Indigo High-Altitude Scale)
- `--bg-base`: `#040812` (Deep midnight-indigo — cold high-altitude night sky)
- `--bg-surface`: `#080e1a` (Dark alpine rock surface)
- `--bg-card`: `#0d1422` (Shadow side of a peak / primary card surface)
- `--bg-muted`: `#141e30` (Elevated interactive surface)
- `--bg-input`: `rgba(255, 255, 255, 0.04)`

### Typography Colors
- `--text-high`: `#F1F5F9` (Snow white — crisp mountain air, 100%)
- `--text-mid`: `#94A3B8` (Glacial mist — secondary text, 70%)
- `--text-low`: `#475569` (Deep rock shadow — muted labels, 40%)

### Brand Primary Accent
- `primary`: `#3B82F6` (Glacier Blue)
- `primary-light`: `#60A5FA`
- `primary-dark`: `#1D4ED8`
- `primary-glow`: `rgba(59, 130, 246, 0.35)`

### Territory Signature Palettes
- **Jammu & Kashmir**: Glacier Blue (`#3B82F6`, glow `rgba(59, 130, 246, 0.20)`)
- **Himachal Pradesh**: Alpenglow Amber (`#F59E0B`, glow `rgba(245, 158, 11, 0.20)`)
- **Ladakh**: Twilight Violet (`#7C3AED`, glow `rgba(124, 58, 237, 0.20)`)
- **Uttarakhand**: Alpine Teal (`#0D9488`, glow `rgba(13, 148, 136, 0.20)`)

### Borders & Dividing Lines
- `border-dim`: `rgba(255, 255, 255, 0.06)`
- `border-base`: `rgba(255, 255, 255, 0.10)`
- `border-bright`: `rgba(255, 255, 255, 0.18)`

---

## 2. Component Utility Classes (`src/app/globals.css`)

### Navigation Glass (`.nav-glass`)
```css
.nav-glass {
  background: rgba(4, 8, 18, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-dim);
}
```

### Cards & Surfaces
- **`.card-base`**: Midnight-indigo background (`#0d1422`), subtle 1px border, smooth hover lift (`translateY(-2px)`) and glow shadow.
- **`.glass-card`**: Translucent glass (`rgba(255, 255, 255, 0.03)` with `backdrop-blur(16px)`).
- **`.territory-card`**: Card featuring top accent border matching the territory's signature color, plus an ambient radial top glow pseudo-element.

### Buttons
- **`.btn-primary`**: Rounded pill, Glacier Blue background with radiant shadow (`rgba(59, 130, 246, 0.3)`), snow white text, hover lift.
- **`.btn-ghost`**: Rounded pill with subtle white border (`rgba(255, 255, 255, 0.1)`), translucent hover fill.
- **`.btn-icon`**: 44px round tap target for icons.

### Badges & Status Pills
- **`.glass-pill`**: Translucent capsule with monospace tracking (`text-[11px] uppercase tracking-widest`).
- **`.badge-altitude`**: Glacier blue tinted capsule (`rgba(59, 130, 246, 0.08)`).
- **`.badge-difficulty-easy`**: Emerald `#34D399`
- **`.badge-difficulty-moderate`**: Glacier Blue `#60A5FA`
- **`.badge-difficulty-challenging`**: Alpenglow Amber `#F59E0B`
- **`.badge-difficulty-difficult`**: Alpine Rose `#F87171`

### Gradient Text
- **`.text-gradient-hero`**: White to glacial ice (`#ffffff` -> `#e2e8f0` -> `#BAE6FD`).
- **`.text-gradient-blue`**: High-altitude sky blue gradient (`#60A5FA` -> `#3B82F6` -> `#2563EB`).
- **`.text-gradient-gold`**: Alpenglow amber gradient (`#FCD34D` -> `#F59E0B` -> `#D97706`).

---

## 3. Map Component Patterns (`GlobalMapClient.tsx`)

1. **Progressive Disclosure:**
   - Level 0 (Territory overview): 4 glowing territory action pills at the bottom.
   - Level 1 (Valley focus): Valley selection buttons with territory accent borders.
   - Level 2 (Place focus): All other floating UI elements fade away, bringing up the single central **Expedition Briefing Card**.
2. **Safe Markers:** Marker DOM trees are created via explicit `document.createElement()` nodes with isolated hover tooltips and dynamic glowing accent rings.
3. **Curated Camera:** User manual zoom/pan is disabled to maintain cinematic vantage angles and avoid disorientation.
