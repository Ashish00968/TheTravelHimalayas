---
name: mapbox-geospatial-visualizer
description: >-
  Mapbox GL JS 3D topography and geospatial trail visualization guidelines for Discover Himalayan Trails. Use when working on the interactive 3D map (/map), drawing GeoJSON trail paths, rendering elevation meshes, configuring camera fly-tos, or optimizing Mapbox token consumption.
---

# Mapbox Geospatial Trail Visualizer

This skill governs all 3D geospatial mapping, satellite topography, camera choreography, and route visualization on **Discover Himalayan Trails**.

---

## 1. Strict Token Conservation & Lifecycle Architecture

Mapbox GL consumes billable map loads per session. To maintain free-tier sustainability and sub-second page performance:

### Rules:
1. **Never auto-load Mapbox on landing pages or detail pages**:
   - Individual trek and place pages must display lightweight, static elevation preview cards that link to `/map?focus=[id]`.
2. **On-Demand Map Launcher on `/map`**:
   - `/map` renders an initial lightweight briefing card (`MapLauncher.tsx`) and only initializes `mapbox-gl` upon explicit user interaction ("Launch Interactive 3D Atlas") or when deep-linked with `?focus=[id]`.
3. **No Unbounded Map Instances**:
   - Only 1 active `mapboxgl.Map` instance may exist in the DOM at any time.
   - Always call `map.remove()` in `useEffect` cleanup.
4. **Scroll Hijacking Protection**:
   - Initialize map with `scrollZoom: false` to prevent accidental page scroll trapping. Map zoom must be operated via UI controls, double-click, pinch gestures, or while in fullscreen.

---

## 2. 3D Terrain, DEM & Atmospheric Skybox Configuration

When initializing the 3D globe / terrain in `GlobalMapClient.tsx` or route viewers:

```ts
const map = new mapboxgl.Map({
  container: containerRef.current,
  style: "mapbox://styles/mapbox/satellite-v9",
  center: [77.2, 31.8],
  zoom: 6.8,
  pitch: 68,
  bearing: 12,
  maxPitch: 85,
  pitchWithRotate: true,
  projection: "globe",
  scrollZoom: false,
  attributionControl: false,
  antialias: true,
});

map.on("load", () => {
  // Add Mapbox DEM for 3D mountain terrain
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
  });

  // Set 3D terrain exaggeration
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.35 });

  // Midnight Indigo atmospheric horizon
  map.setFog({
    color: "rgb(4, 8, 18)",         // Deep midnight indigo horizon
    "high-color": "rgb(20, 35, 65)", // Twilight alpine blue upper atmosphere
    "horizon-blend": 0.3,
    "space-color": "rgb(2, 4, 10)",
    "star-intensity": 0.6,
  });
});
```

---

## 3. South-Offset Northward Camera Choreography

All Himalayan camera perspectives must position the viewpoint **South of the mountain ranges looking Northward** (`bearing: 350°–15°`) with steep `68°–75°` pitch. This causes the colossal snow massifs of the Pir Panjal, Great Himalaya, and Karakoram to tower upward in the viewport.

### Standard Presets:
- **Himalayan Ridge Overview**: `[lat: 31.8, lng: 77.2, zoom: 6.8, pitch: 68, bearing: 12]`
- **Jammu & Kashmir**: `[lat: 32.30, lng: 74.80, zoom: 8.0, pitch: 75, bearing: 10]`
- **Himachal Pradesh**: `[lat: 30.90, lng: 77.10, zoom: 8.2, pitch: 75, bearing: 5]`
- **Ladakh**: `[lat: 32.80, lng: 77.50, zoom: 7.8, pitch: 75, bearing: 355]`
- **Uttarakhand**: `[lat: 29.40, lng: 79.00, zoom: 8.0, pitch: 75, bearing: 5]`
- **Place Focus (Level 3)**: Center on waypoint with `zoom: 13.5–14.2`, `pitch: 68`, `bearing: 25`, and duration `2200ms`.

---

## 4. 3D Marker Anchoring & Parallax Drift Prevention

**CRITICAL RULE: Never override `marker._pos` or use `map.on("render")` with `map.project()`.**
In Mapbox GL JS v3 with 3D DEM enabled, `map.project()` computes flat 2D sea-level projections, causing severe parallax drift and pin detachment on mountain summits.

### Best Practices:
1. **Native Terrain Projection**: Let Mapbox GL JS handle 3D elevation transforms natively for all HTML markers.
2. **Unified Marker Element**: Build marker elements as a single integrated DOM container containing both the frosted label badge and the SVG pin pointer.
3. **Bottom Anchor**: Always set `anchor: "bottom"`. This guarantees the tip of the pin point touches the exact physical ground coordinate on the 3D elevation mesh regardless of camera tilt or rotation.
4. **Collision Relaxation**: When rendering multiple valley markers, apply a screen-space label relaxation pass to resolve overlapping text pills without moving the base coordinate pins.

---

## 5. 4-Stop Altitude-Graded GeoJSON Trail Polylines

Trails must convey elevation change rather than render as flat single-color lines.

### Polyline Architecture:
1. **Dry Polyline Source**: Import verified GPS coordinates from `src/data/paths/index.ts`.
2. **Line Metrics**: Always set `lineMetrics: true` on the GeoJSON source.
3. **4-Stop Elevation Gradient**:
   - `0.0` (Valley / Trailhead): `#06B6D4` (Cyan)
   - `0.35` (Alpine Meadows): `#3B82F6` (Glacier Blue)
   - `0.75` (High Pass / Moraine): `#F59E0B` (Amber Ridge)
   - `1.0` (Glaciated Summit Crest): `#FDE047` (Gold/Yellow)

```ts
map.addSource("trail-source", {
  type: "geojson",
  lineMetrics: true,
  data: trailGeoJson,
});

// Ambient ground glow
map.addLayer({
  id: "trail-glow",
  type: "line",
  source: "trail-source",
  paint: {
    "line-color": "#3B82F6",
    "line-width": 10,
    "line-opacity": 0.45,
    "line-blur": 6,
  },
});

// Altitude-graded core trail line
map.addLayer({
  id: "trail-line",
  type: "line",
  source: "trail-source",
  paint: {
    "line-width": 3.5,
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0.0,  "#06B6D4",
      0.35, "#3B82F6",
      0.75, "#F59E0B",
      1.0,  "#FDE047",
    ],
  },
});
```

---

## 6. O(1) Geospatial Resolution

Never iterate through arrays to find coordinates. Always use `placeLocationIndex` in `src/data/atlas.ts`:

```ts
import { placeLocationIndex } from "@/data/atlas";

const coords = placeLocationIndex.get(placeId);
if (coords) {
  flyTo(coords.lat, coords.lng, 13.5, 68, 25, 2000, {
    name: coords.name,
    category: coords.type.toUpperCase(),
  });
}
```

---

## 7. Keyboard Navigation & Accessibility

Ensure every map client binds the global shortcuts:
- `F`: Toggle full-screen mode.
- `Escape`: Step back chronologically (Level 3 Place &rarr; Level 2 Valley &rarr; Level 1 Territory &rarr; Level 0 Atlas) or exit fullscreen.
- Screen readers: Include hidden `aria-live` status announcements when camera targets change.
