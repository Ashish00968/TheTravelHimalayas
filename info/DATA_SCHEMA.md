# Data Schema Guide — The Himalayan Trails

All platform data is strictly typed, statically validated at build time, and defined across `src/data/types.ts`, `src/data/atlas.ts`, `src/data/treks.ts`, `src/data/peaks.ts`, `src/data/mountain-safety.ts`, and `src/data/guides.ts`.

---

## 1. Geographic Atlas Hierarchy (`src/data/atlas.ts`)

The site uses a strict three-tier geographic hierarchy mapped directly to SEO-friendly routes (`/explore/[state]/[division]/[place]`):

```
State / Territory (HimalayaRegion)
 └── Division / Valley (HimalayaSubRegion)
      └── Destination / Trail / Peak (HimalayaPlace)
```

### `HimalayaRegion` (Territory Level)
- `id`: Territory slug (`"himachal-pradesh"` | `"jammu-kashmir"` | `"ladakh"` | `"uttarakhand"`).
- `name`: Display name (e.g., `"Himachal Pradesh"`).
- `emoji`: Regional emoji badge (e.g., `"🏔️"`).
- `cardDesc`: High-level summary of the territory's mountain geography.
- `subregions`: Array of `HimalayaSubRegion` objects.

### `HimalayaSubRegion` (Division / Valley Level)
- `id`: Division slug (e.g., `"kullu"`, `"lahaul-spiti"`, `"zanskar"`, `"garhwal"`).
- `name`: Display title (e.g., `"Kullu Valley"`).
- `tagline`: Editorial overview for the valley.
- `places`: Array of `HimalayaPlace` objects.

### `HimalayaPlace` (Destination / Trail / Peak Level)
- `id`: Place slug (e.g., `"beas-kund"`, `"pin-parvati-pass"`, `"friendship-peak"`).
- `name`: Display title.
- `type`: Category (`"trek"` | `"day-hike"` | `"peak"` | `"spiritual"` | `"scenic"` | `"road"` | `"lake"` | `"adventure"`).
- `emoji`: Visual identifier.
- `elevation`: Max altitude string (e.g., `"3,700 m"`, `"5,289 m"`).
- `difficulty`: Route grading (`"Easy"` | `"Moderate"` | `"Challenging"` | `"Difficult"`).
- `duration`: Time required (e.g., `"4-5 Days"`, `"1 Day"`).
- `bestSeason`: Optimal trekking months (e.g., `"May – October"`).
- `coords`: Standard GeoJSON array `[latitude, longitude]` (e.g., `[32.3619, 77.0858]`).
- `heroImage`: Showcase photograph URL.
- `images`: Optional array of gallery image URLs.
- `overview`: Narrative background and trail overview.
- `routeDescription`: Step-by-step route or climbing guide.
- `itinerary`: Array of `{ day: number; title: string; description: string }`.
- `packingList`: Essential gear checklist items.
- `tips`: Local insider tips and logistical warnings.
- `faqs`: Array of `{ question: string; answer: string }`.
- `trekData`: Optional linked `Trek` object.
- `peakData`: Optional linked `Peak` object.

### O(1) Fast Index: `PlaceLocation` & `placeLocationIndex`
To eliminate linear array scans during runtime lookups, `src/data/atlas.ts` exports a pre-computed lookup Map:

```typescript
export interface PlaceLocation {
  regionId: string;
  regionName: string;
  subRegionId: string;
  subRegionName: string;
  placeId: string;
  placeName: string;
  href: string; // e.g. "/explore/himachal-pradesh/kullu/beas-kund"
}

export const placeLocationIndex = new Map<string, PlaceLocation>();
```

---

## 2. Specialized Domain Models

### Trek Schema (`src/data/types.ts` & `src/data/treks.ts`)
```typescript
export interface TrekItineraryDay {
  day: number;
  title: string;
  altitudeMeters?: number;
  campName?: string;
  description: string;
  distanceKm?: number;
}

export interface Trek {
  id: string;
  slug: string;
  title: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Challenging" | "Strenuous";
  durationDays: number;
  maxAltitudeMeters: number;
  bestSeasons: string[];
  distanceKm: number;
  trailhead: string;
  coordinates: [number, number]; // [lat, lng]
  pathCoords?: [number, number][]; // LineString coordinates for 3D route rendering
  itinerary: TrekItineraryDay[];
  highlights: string[];
  faqs: { question: string; answer: string }[];
  gallery?: string[];
  heroImage?: string;
  estimatedCostInr?: number;
  permitRequired?: boolean;
}
```

### Peak Profile Schema (`src/data/types.ts` & `src/data/peaks.ts`)
```typescript
export interface Peak {
  id: string;
  slug: string;
  name: string;
  range: string;
  elevationMeters: number;
  firstAscent?: string;
  routeDifficulty: "Alpine PD" | "Alpine AD" | "Alpine D" | "Alpine TD";
  technicalGear: string[];
  coordinates: [number, number]; // [lat, lng]
  summary: string;
  baseCampLocation?: string;
  bestSeasons?: string[];
  heroImage?: string;
}
```

### Mountain Safety & Medical Protocols (`src/data/mountain-safety.ts`)
- **`GlossaryTerm`**: Mountain terminology definitions (`term`, `localTerm`, `category`, `definition`, `significance`).
- **`MountaineeringCourse`**: Certified courses (`code: BMC | AMC | MOI | S&R`, `name`, `duration`, `eligibility`, `curriculum`, `overview`, `significance`).
- **`AltitudeLevel`**: Physiological atmosphere stats from High Altitude (1,500m) to Extreme Altitude / Death Zone (>8,000m).
- **`AltitudeIllness`**: Diagnostic criteria, symptoms, medication protocols (Diamox, Dexamethasone, Nifedipine), and descent rules for AMS, HAPE, and HACE.
- **`SafetyProtocol`**: Hypothermia management, frostbite thaw rules, water purification protocols, and the 5 Golden Rules of Acclimatization.

### Field Guides Schema (`src/data/guides.ts`)
- **`Guide`**: Long-form editorial guides (`id`, `slug`, `title`, `category`, `readTimeMinutes`, `publishedDate`, `lastModified`, `author`, `content`, `tags`, `relatedGuides`).

---

## 3. Data Integrity & Validation Rules

1. **Exact GeoJSON Coordinates**: All coordinates must follow `[latitude, longitude]` decimal format with genuine topographical precision.
2. **Deterministic Slugs**: Slugs are lowercase kebab-case and immutable to preserve SEO equity.
3. **Structured Image Fallbacks**: Components safely fall back to ambient territory-themed dark glassmorphism gradients if external imagery is omitted.
