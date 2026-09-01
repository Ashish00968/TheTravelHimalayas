"use client";

import dynamic from "next/dynamic";

export const GlobalMap = dynamic(() => import("./GlobalMapClient"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] lg:min-h-[800px] rounded-3xl bg-surface border border-white/10 flex items-center justify-center animate-pulse">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
});

export const LocationMap = dynamic(() => import("./LocationMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-3xl bg-surface border border-white/10 flex items-center justify-center animate-pulse">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
});
