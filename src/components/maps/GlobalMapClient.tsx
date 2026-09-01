"use client";

import { useState } from "react";
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer } from "react-map-gl/mapbox";
import Link from "next/link";
import { Mountain, MapPin, Navigation } from "lucide-react";
import { Trek } from "@/data/types";
import "mapbox-gl/dist/mapbox-gl.css";

interface GlobalMapClientProps {
  treks: Trek[];
}

export default function GlobalMapClient({ treks }: GlobalMapClientProps) {
  const [popupInfo, setPopupInfo] = useState<Trek | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Graceful fallback if no token
  if (!mapboxToken) {
    return (
      <div className="w-full h-full min-h-[600px] rounded-3xl bg-surface border border-white/10 flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <MapPin className="w-16 h-16 text-primary mb-6 animate-bounce" />
        <h2 className="text-3xl font-display font-semibold text-white mb-3">Interactive Map Offline</h2>
        <p className="text-white/60 max-w-md font-light">
          The Mapbox GL token is missing from your environment variables. 
          To enable the interactive 3D terrain map, please add <code className="bg-white/10 px-2 py-1 rounded text-primary">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[600px] lg:min-h-[800px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
      <Map
        initialViewState={{
          longitude: 77.1680, // Kullu Valley center
          latitude: 32.2620,
          zoom: 9,
          pitch: 45,
          bearing: -17.6
        }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={mapboxToken}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
      >
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="bottom-right" />

        {treks.map((trek) => {
          if (!trek.coords || trek.coords.length !== 2) return null;
          // Note: treks.ts uses [lat, lng]. Mapbox expects [lng, lat].
          const [lat, lng] = trek.coords;

          return (
            <div key={`container-${trek.slug}`}>
              {trek.pathCoords && trek.pathCoords.length > 0 && (
                <Source 
                  id={`source-${trek.slug}`} 
                  type="geojson" 
                  data={{
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "LineString",
                      coordinates: trek.pathCoords.map(coord => [coord[1], coord[0]]) // Mapbox uses [lng, lat]
                    }
                  }}
                >
                  <Layer
                    id={`layer-${trek.slug}`}
                    type="line"
                    source={`source-${trek.slug}`}
                    layout={{
                      "line-join": "round",
                      "line-cap": "round"
                    }}
                    paint={{
                      "line-color": "#0066cc", // Primary color (from globals.css)
                      "line-width": 3,
                      "line-opacity": 0.8
                    }}
                  />
                </Source>
              )}
              <Marker
                key={`marker-${trek.slug}`}
                longitude={lng}
                latitude={lat}
                anchor="bottom"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={(e: any) => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(trek);
                }}
              >
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-pulse-slow cursor-pointer">
                  <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(0,102,204,1)] border-2 border-white" />
                </div>
              </Marker>
            </div>
          );
        })}

        {popupInfo && popupInfo.coords && (
          <Popup
            anchor="top"
            longitude={popupInfo.coords[1]} // lng
            latitude={popupInfo.coords[0]} // lat
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="himalaya-popup"
            maxWidth="320px"
          >
            <div className="bg-[#121216] border border-white/10 rounded-2xl p-4 shadow-2xl text-white">
              <h3 className="text-lg font-display font-semibold mb-1 text-primary">{popupInfo.title}</h3>
              <div className="flex items-center gap-4 text-xs font-mono text-white/60 mb-3">
                <span className="flex items-center gap-1"><Mountain className="w-3 h-3" /> {popupInfo.maxAltitude}</span>
                <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {popupInfo.distance}</span>
              </div>
              <p className="text-sm text-white/80 font-light line-clamp-2 mb-4">
                {popupInfo.overview}
              </p>
              <Link 
                href={`/explore/himachal-pradesh/kullu/${popupInfo.slug}`}
                className="block w-full text-center py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
              >
                View Expedition Guide
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
