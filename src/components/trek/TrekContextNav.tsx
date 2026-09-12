"use client";

import React, { useState, useEffect } from "react";
import { Compass } from "lucide-react";

interface TrekContextNavProps {
  stateSlug: string;
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "trail", label: "The Trail" },
  { id: "route", label: "Route" },
  { id: "elevation", label: "Elevation" },
  { id: "itinerary", label: "Itinerary" },
  { id: "information", label: "Information" },
  { id: "faqs", label: "FAQ" },
];

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekContextNav({ stateSlug }: TrekContextNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("snapshot");

  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 600px
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 500);

      // Track active section
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-5 sm:bottom-6 inset-x-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <nav 
        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/95 dark:bg-[#080e1a]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)] overflow-x-auto max-w-[calc(100vw-1.5rem)] sm:max-w-full scrollbar-none touch-pan-x"
        aria-label="Expedition Navigation"
      >
        <div className="hidden sm:flex items-center pl-3 pr-2 text-slate-500 dark:text-foreground/40 font-mono text-[10px] uppercase tracking-widest shrink-0">
          <Compass className="w-3 h-3 mr-1.5" style={{ color: style.accent }} />
          <span>Guide</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`px-3 py-1.5 min-h-[36px] flex items-center rounded-full text-xs font-mono tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-foreground/60 hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100/60 dark:hover:bg-white/[0.05]"
              }`}
              style={isActive ? { color: style.accent, borderColor: `${style.accent}40` } : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
