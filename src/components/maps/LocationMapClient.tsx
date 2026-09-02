"use client";

import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationMapClientProps {
  coords: [number, number]; // [lat, lng] from treks.ts
  pathCoords?: [number, number][]; // optional route path
  title: string;
}

export default function LocationMapClient({ coords, pathCoords, title }: LocationMapClientProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Graceful fallback if no token
  if (!mapboxToken) {
    return (
      <div className="w-full h-[400px] rounded-3xl bg-surface border border-white/10 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <MapPin className="w-10 h-10 text-primary mb-4 opacity-50" />
        <h3 className="text-lg font-display font-semibold text-white mb-2">Location Map (Offline)</h3>
        <p className="text-white/50 text-sm font-light">
          Missing MAPBOX_TOKEN. Add it to .env.local to view the interactive 3D terrain for {title}.
        </p>
      </div>
    );
  }

  const [lat, lng] = coords;

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-xl relative">
      <Map
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 11,
          pitch: 60,
          bearing: 0
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={mapboxToken}
        terrain={{ source: "mapbox-dem", exaggeration: 1.6 }}
        attributionControl={false}
        onError={(e) => {
          // Gracefully suppress aborted requests or transient tile errors
          const msg = e.error?.message || "";
          const status = (e.error as unknown as { status?: number })?.status;
          if (
            msg.includes("Failed to fetch") ||
            msg.includes("abort") ||
            status === 404
          ) {
            return;
          }
        }}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        <NavigationControl position="bottom-right" />
        
        {pathCoords && pathCoords.length > 0 && (
          <Source 
            id={`source-${title}`} 
            type="geojson" 
            data={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: pathCoords.map(coord => [coord[1], coord[0]]) // Mapbox uses [lng, lat]
              }
            }}
          >
            <Layer
              id={`layer-${title}`}
              type="line"
              source={`source-${title}`}
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              paint={{
                "line-color": "#0066cc", // Primary color
                "line-width": 3,
                "line-opacity": 0.8
              }}
            />
          </Source>
        )}

        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg mb-1 whitespace-nowrap">
              {title}
            </div>
            <div className="w-3 h-3 bg-primary transform rotate-45 -mt-2 shadow-lg" />
            <div className="w-4 h-4 bg-primary/30 rounded-full mt-1 flex items-center justify-center animate-ping">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
          </div>
        </Marker>
      </Map>
    </div>
  );
}
