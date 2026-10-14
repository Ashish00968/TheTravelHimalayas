---
name: mapbox-geospatial-visualizer
description: >-
  Mapbox GL JS 3D topography and geospatial trail visualization guidelines for Discover Himalayan Trails. Use when working on the interactive 3D map (/map), drawing GeoJSON trail paths, rendering elevation meshes, configuring camera fly-tos, camera physics, trail animations, or optimizing Mapbox token consumption.
---

# Mapbox Geospatial Trail Visualizer

This skill governs all 3D geospatial mapping, satellite topography, camera choreography, route animations, and telemetry visualizers on **Discover Himalayan Trails**.

---

## 1. Strict Token Conservation & Lifecycle Architecture

Mapbox GL consumes billable map loads per session. To maintain free-tier sustainability and sub-second page performance:

### Rules:
1. **Never auto-load Mapbox on general landing or list pages**:
   - Place and guide cards must display lightweight, static preview cards linking to `/map?focus=[id]`.
2. **On-Demand Map Launcher on `/map`**:
   - `/map` renders an initial lightweight briefing card (`MapLauncher.tsx`) and only initializes `mapbox-gl` upon explicit user interaction ("Launch Interactive 3D Atlas") or when deep-linked with `?focus=[id]`.
3. **Strict Single-Instance Lifecycle**:
   - Exactly ONE active `mapboxgl.Map` instance may exist in the DOM at any time.
   - Always call `map.remove()` in `useEffect` cleanup to release WebGL contexts and memory.
4. **Scroll Hijacking Protection**:
   - Always initialize maps with `scrollZoom: false` to prevent accidental page scroll trapping. Map zoom must be operated via UI controls, double-click, pinch gestures, or while in fullscreen.

---

## 2. 3D Terrain, Calibrated DEM & Atmospheric Skybox

Himalayan peaks rise 2,000m+ in under 3 km. High DEM exaggeration (>1.3x) causes Mapbox's collision system to clamp the camera violently against knife-edge ridges, causing vertical jitter ("camera shaking").

### Calibrated Exaggeration:
- **`RouteMap3D.tsx`**: Strictly **`1.15x`** (prevents cliff clipping and camera shudder during steep ascents).
- **`GlobalMapClient.tsx`**: **`1.25x`** (optimal relief across broad regional valleys).
- **`TopoMiniMap.tsx`**: **`1.20x`** (crisp relief on small preview cards).

```ts
map.addSource("mapbox-dem", {
  type: "raster-dem",
  url: "mapbox://mapbox.mapbox-terrain-dem-v1",
  tileSize: 512,
  maxzoom: 14,
});

map.setTerrain({ source: "mapbox-dem", exaggeration: 1.15 });

// Midnight Indigo atmospheric horizon
map.setFog({
  color: "rgb(4, 8, 18)",         // Deep midnight indigo horizon
  "high-color": "rgb(20, 35, 65)", // Twilight alpine blue upper atmosphere
  "horizon-blend": 0.3,
  "space-color": "rgb(2, 4, 10)",
  "star-intensity": 0.6,
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

## 4. Camera Physics & Anti-Jitter Math Engine (`src/lib/camera-math.ts`)

Never animate camera properties naively. Use the battle-tested math utilities in `src/lib/camera-math.ts`:

1. **Rate-Limited Bearing Smoothing (`rateLimitedBearingLerp`)**:
   - Limits rotational velocity to maximum **`0.65°/frame`** (~39°/sec).
   - Resolves through shortest angular arc ($[-180°, 180°]$ via `shortestAngleDiff`).
   - Prevents snappy rotational shaking and 360° reverse barrel spins on alpine switchbacks.
2. **Macro Valley Corridor Lookahead (`computeMacroBearing`)**:
   - Uses a **550m** forward lookahead vector instead of immediate next trackpoints.
   - When approaching a summit, caps lookahead to the apex distance to avoid looking downhill past the peak.
3. **Slope-Adaptive Pitch Damper (`computeAdaptivePitch`)**:
   - Base pitch: `48°` (zoom `12.5`).
   - Steep ascent (>+8% gradient): dampens pitch down to **`38°–42°`**, elevating the camera eye so mountain peaks and open sky remain visible without near-plane wall penetration.
   - Steep descent (<-12% gradient): dampens pitch down to **`40°–42°`**, preventing canyon plunge.
4. **Monotonic Line Gradient Stops (`computeSafeGradientStops`)**:
   - Enforces strict ascending order ($s_0 < s_1$) with $\ge 0.004$ separation.
   - Strictly prevents WebGL shader crashes caused by colliding stops in `["line-progress"]`.

---

## 5. Out-and-Back Trail Apex Slicing (`displayCoordinates`)

Out-and-back GPX recordings contain both ascent and descent paths. Because hikers walk slightly different paths on the return, raw GPS lines render duplicate parallel lines along the same mountain ridge.

### Rule:
Always detect the summit apex (`apexIdx`) and slice out-and-back trails to `displayCoordinates`:
```ts
const displayCoordinates = useMemo(() => {
  if (isRoundTrip && apexInfo.apexIdx > 10 && apexInfo.apexIdx < coordinates.length - 10) {
    return coordinates.slice(0, apexInfo.apexIdx + 1);
  }
  return coordinates;
}, [coordinates, isRoundTrip, apexInfo.apexIdx]);
```
- Mapbox sources (`trail-route`), bounding boxes, and elevation stops must bind to `displayCoordinates`.
- Flyovers progress from 0% (trailhead) to 100% (summit apex) and transition directly into the 360° summit orbit.

---

## 6. Dynamic Waypoint Proximity Culling

Mapbox GL HTML DOM markers do not depth-test against 3D terrain. Looking along a valley projects all markers onto the same screen coordinates, creating an unreadable stacked pill pile.

### Rule:
Compute real-time distance from the camera focus to each waypoint during flight and scrub:
- `< 1.0 km`: 100% opacity, scale 1.02.
- `1.0–2.5 km`: 45% opacity, scale 0.95.
- `> 2.5 km`: 8% opacity, scale 0.88 (softly faded out).

---

## 7. Zero-DOM GPU Pulsing Radar Beacon (`src/lib/mapbox-canvas-beacon.ts`)

Never render animated HTML/CSS pulsing dots over WebGL maps (triggers continuous browser DOM reflows). Use `registerPulsingBeacon`:
- Registers an animated HTML5 Canvas `StyleImage` directly into Mapbox GL's WebGL texture atlas.
- Renders glowing radar rings and solid core puck at 60fps with zero DOM overhead.

---

## 8. Left Vertical Cockpit Altimeter with Pointer Capture

Trail elevation progress must be visualized on the left vertical rail, leaving the 3D mountain landscape open and unobstructed:
- **Direct Pointer Capture**:
  - Bind `onPointerDown`, `onPointerMove`, `onPointerUp`, and `onPointerCancel` with `setPointerCapture(e.pointerId)`.
  - Apply `touch-none` (`touch-action: none`) to prevent browser page scrolling during scrubbing.
- **Unified Telemetry Callout**:
  - Live altitude readout, progress %, slope %, and distance traveled (`km / km`).
  - Zero-lag 60fps direct DOM updates using `useRef` (`altimeterValRef`, `altimeterFillRef`, `altimeterThumbRef`). Never dispatch `useState` on every frame.
- **AMS Safety Line**:
  - Always render the 3,000m altitude threshold tick (`altimeterStats.amsPct`) on routes climbing above 3,000m.

---

## 9. 3D Marker Anchoring & Parallax Drift Prevention

**CRITICAL RULE: Never override `marker._pos` or use `map.on("render")` with `map.project()`.**
`map.project()` computes flat 2D sea-level projections, causing severe parallax drift and detached floating pins on mountain summits.

### Best Practices:
1. **Native Terrain Projection**: Let Mapbox GL JS v3 handle 3D elevation transforms natively for all HTML markers.
2. **Unified Marker Element**: Build marker elements as a single integrated DOM container containing both the frosted label badge and the SVG pin pointer.
3. **Bottom Anchor**: Always set `anchor: "bottom"`. This guarantees the tip of the pin point touches the exact physical ground coordinate on the 3D elevation mesh regardless of camera tilt or rotation.

---

## 10. O(1) Geospatial Resolution

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

## 11. Reference Documentation

For deep technical context, refer to:
- [`info/map/ARCHITECTURE.md`](file:///Users/apple/Documents/Discover%20H%20T/Thehimalayantrails/info/map/ARCHITECTURE.md) — Complete system architecture, layer stacks, and component specs.
- [`info/map/ANIMATIONS_AND_PHYSICS.md`](file:///Users/apple/Documents/Discover%20H%20T/Thehimalayantrails/info/map/ANIMATIONS_AND_PHYSICS.md) — Reverse-engineering chronicle, camera math, and anti-clipping formulas.
- [`info/map/OPERATIONS.md`](file:///Users/apple/Documents/Discover%20H%20T/Thehimalayantrails/info/map/OPERATIONS.md) — Route ingestion, developer workflows, mobile standards, and troubleshooting.
