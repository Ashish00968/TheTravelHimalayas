---
name: himalayan-content-curator
description: >-
  Data curation and alpine verification standards for Discover Himalayan Trails. Use when adding, updating, or auditing treks, mountain peaks, passes, and regional places in src/data/treks.ts, src/data/peaks.ts, or src/data/atlas.ts. Ensures 100% verified photography, accurate coordinates, and O(1) index synchronization.
---

# Himalayan Content Curator

This skill governs data entry, geographic validation, and image curation across the static datasets powering **Discover Himalayan Trails**.

---

## 1. Data Source Files

- **Treks & Itineraries**: [`src/data/treks.ts`](file:///Users/apple/Documents/KiroWebsites/Thehimalayantrails/src/data/treks.ts)
- **Peaks & Expeditions**: [`src/data/peaks.ts`](file:///Users/apple/Documents/KiroWebsites/Thehimalayantrails/src/data/peaks.ts)
- **Geographic Atlas & Indices**: [`src/data/atlas.ts`](file:///Users/apple/Documents/KiroWebsites/Thehimalayantrails/src/data/atlas.ts)
- **Shared Types & Schemas**: [`src/data/types.ts`](file:///Users/apple/Documents/KiroWebsites/Thehimalayantrails/src/data/types.ts)

---

## 2. Rules for Adding a New Trek

1. **Mandatory Schema Fields**:
   - `id`: kebab-case unique slug (e.g. `beas-kund`, `hampta-pass`).
   - `name`: Official title.
   - `territory`: One of `"jammu-kashmir"`, `"himachal-pradesh"`, `"ladakh"`, `"uttarakhand"`.
   - `maxAltitude`: Number in meters (e.g. `3700`).
   - `duration`: e.g. `"3 Days"`.
   - `difficulty`: `"Easy" | "Moderate" | "Difficult" | "Challenging" | "Extreme"`.
   - `bestSeason`: Array of applicable months (e.g. `["May", "June", "September", "October"]`).
   - `itinerary`: Minimum 3 structured days with `day`, `title`, `altitude`, `distance`, `description`.
   - `heroImage`: Verified, working high-resolution HTTPS image URL.
2. **Coordinates & Atlas Sync**:
   - Every trail must have valid `[longitude, latitude]` coordinates added to `placeLocationIndex` in [`src/data/atlas.ts`](file:///Users/apple/Documents/KiroWebsites/Thehimalayantrails/src/data/atlas.ts).
   - Longitudes in the Indian Himalayas range between `74.0°E` and `81.0°E`.
   - Latitudes range between `29.0°N` and `36.0°N`.
   - Never invert latitude and longitude! Mapbox expects `[lng, lat]`.

---

## 3. Image Integrity Protocol

- **Never use placeholders**: Unsplash, Cloudinary, or verified Wikimedia Commons alpine photography only.
- **Aspect Ratio & Quality**: Landscape orientation (`16:9` or `3:2`), minimum 1600px width.
- **Verification**: Run a check to verify image URLs return `HTTP 200 OK`.

---

## 4. Technical Difficulty & Safety Grading

- **Easy**: Under 3,000m, well-marked trail, no technical gear.
- **Moderate**: 3,000m – 4,200m, steep ascents, boulder fields, cold nights.
- **Difficult**: 4,200m – 5,200m, high pass crossing (e.g. Pin Parvati, Rupin Pass), moraine, glacier traverse.
- **Extreme / Technical**: Above 5,200m, crampons, ice axe, crevasse rescue protocols, expedition grade.
