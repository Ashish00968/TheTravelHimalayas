---
name: mapbox-geospatial-visualizer
description: >-
  Mapbox GL JS 3D topography and geospatial trail visualization guidelines for Discover Himalayan Trails. Use when working on the interactive 3D map (/map), drawing GeoJSON trail paths, rendering elevation meshes, configuring camera fly-tos, or optimizing Mapbox token consumption.
---

# Mapbox Geospatial Trail Visualizer

This skill governs all 3D geospatial mapping, satellite topography, and route visualization on **Discover Himalayan Trails**.

---

## 1. Strict Token Conservation Architecture

Mapbox GL consumes billable map loads per session. To maintain free-tier viability and sub-second page performance:

### Rules:
1. **Never auto-load Mapbox on landing pages or detail pages**:
   - Individual trek and place pages must display lightweight, static 3D elevation preview cards that link to `/map?focus=[id]`.
2. **On-Demand Map Launcher on `/map`**:
   - `/map` must render an initial lightweight briefing card (`MapLauncher`) and only initialize `mapbox-gl` upon explicit user interaction ("Launch Interactive 3D Atlas").
3. **No Unbounded Map Instances**:
   - Only 1 active `mapboxgl.Map` instance may exist in the DOM at any time. Always call `map.remove()` in `useEffect` cleanup.

---

## 2. 3D Terrain & Satellite Configuration

When initializing the 3D globe / terrain:

```ts
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

  // Atmospheric skybox
  map.setFog({
    color: "rgb(4, 8, 18)", // Midnight Indigo horizon
    "high-color": "rgb(20, 35, 65)",
    "horizon-blend": 0.3,
    "space-color": "rgb(2, 4, 10)",
    "star-intensity": 0.6,
  });
});
```

---

## 3. GeoJSON Trail Paths & Waypoint Overlays

### Adding Route GeoJSON:
```ts
map.addSource("trail-route", {
  type: "geojson",
  data: trailGeoJson,
});

map.addLayer({
  id: "trail-path-glow",
  type: "line",
  source: "trail-route",
  paint: {
    "line-color": "#3B82F6",
    "line-width": 8,
    "line-opacity": 0.4,
    "line-blur": 4,
  },
});

map.addLayer({
  id: "trail-path",
  type: "line",
  source: "trail-route",
  paint: {
    "line-color": "#93C5FD",
    "line-width": 3,
  },
});
```

---

## 4. O(1) Geospatial Resolution

Never scan arrays linearly to find coordinates. Always use `placeLocationIndex` in `src/data/atlas.ts`:

```ts
import { placeLocationIndex } from "@/data/atlas";

const coords = placeLocationIndex.get(placeId);
if (coords) {
  map.flyTo({
    center: [coords.lng, coords.lat],
    zoom: 13.5,
    pitch: 65,
    bearing: 45,
    essential: true,
  });
}
```
