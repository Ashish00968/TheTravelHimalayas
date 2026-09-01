"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface TrekMapProps {
  coords: [number, number]; // [latitude, longitude]
  title: string;
  startPoint?: string;
}

export default function TrekMap({ coords, title, startPoint }: TrekMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("[TrekMap] NEXT_PUBLIC_MAPBOX_TOKEN is not set.");
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [coords[1], coords[0]], // mapbox expects [lng, lat]
      zoom: 12,
      pitch: 60,    // 3D tilt
      bearing: -20, // slight rotation for cinematic effect
      antialias: true,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add 3D Terrain source
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.8 });

      // Add atmospheric sky layer
      map.current.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });

      // Custom trailhead marker
      const el = document.createElement("div");
      el.className = "trailhead-marker";
      el.style.cssText = `
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f97316;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(249, 115, 22, 0.6);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="m14 6-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z"/></svg>`;

      new mapboxgl.Marker({ element: el })
        .setLngLat([coords[1], coords[0]])
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            className: "trek-popup",
          }).setHTML(`
            <div style="padding:8px 4px;background:transparent">
              <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#f97316;font-weight:600">Trailhead</p>
              <p style="margin:0;font-weight:700;font-size:14px;color:#fff">${title}</p>
              ${startPoint ? `<p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.6)">${startPoint}</p>` : ""}
            </div>
          `)
        )
        .addTo(map.current);

      // Add nav controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [coords, title, startPoint]);

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ height: "420px" }}
    />
  );
}
