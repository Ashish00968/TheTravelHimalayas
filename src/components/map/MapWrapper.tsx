"use client";

import dynamic from "next/dynamic";

// Dynamically import TrekMap with SSR completely disabled.
// Mapbox GL JS uses browser globals (window, document) and cannot run server-side.
const TrekMap = dynamic(() => import("./TrekMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center animate-pulse"
      style={{ height: "420px" }}
    >
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white/40 text-sm font-mono tracking-wider uppercase text-xs">
          Loading trail map...
        </p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  coords: [number, number];
  title: string;
  startPoint?: string;
}

export function MapWrapper({ coords, title, startPoint }: MapWrapperProps) {
  return <TrekMap coords={coords} title={title} startPoint={startPoint} />;
}
