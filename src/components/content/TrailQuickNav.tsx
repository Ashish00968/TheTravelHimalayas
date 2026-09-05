"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bookmark, 
  Share2, 
  Printer, 
  Map, 
  Check, 
  Compass, 
  Calendar, 
  Mountain, 
  Package, 
  HelpCircle,
  CloudSun
} from "lucide-react";
import { useSavedExpeditions } from "@/lib/saved-expeditions";


interface TrailQuickNavProps {
  place: {
    id: string;
    name: string;
    type: string;
    regionId: string;
    regionName: string;
    divisionId: string;
    divisionName?: string;
    elevation?: string;
    duration?: string;
    difficulty?: string;
    image?: string;
    url: string;
  };
  hasWeather?: boolean;
  hasElevation?: boolean;
  hasItinerary?: boolean;
  hasPacking?: boolean;
  hasFaqs?: boolean;
}

export function TrailQuickNav({
  place,
  hasWeather = true,
  hasElevation = true,
  hasItinerary = true,
  hasPacking = true,
  hasFaqs = true,
}: TrailQuickNavProps) {
  const { isSaved, toggle } = useSavedExpeditions();
  const saved = isSaved(place.id);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Handle Share
  const handleShare = async () => {
    const shareData = {
      title: `${place.name} Guide | Discover Himalayan Trails`,
      text: `Check out the complete trail breakdown, altitude profile, and route itinerary for ${place.name}:`,
      url: typeof window !== "undefined" ? window.location.href : place.url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard if cancelled or unsupported
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Clipboard error fallback
      }
    }
  };

  // Handle Print
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Scrollspy observer
  useEffect(() => {
    const sections = ["overview", "weather", "elevation", "itinerary", "gear", "faqs"];
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "overview", label: "Overview", icon: Compass, show: true },
    { id: "weather", label: "Weather", icon: CloudSun, show: hasWeather },
    { id: "elevation", label: "Elevation", icon: Mountain, show: hasElevation },
    { id: "itinerary", label: "Itinerary", icon: Calendar, show: hasItinerary },
    { id: "gear", label: "Gear & Packing", icon: Package, show: hasPacking },
    { id: "faqs", label: "FAQs", icon: HelpCircle, show: hasFaqs },
  ].filter((item) => item.show);

  return (
    <div className="sticky top-[68px] sm:top-[76px] z-30 my-8 py-2.5 px-3 sm:px-5 rounded-2xl bg-background/85 backdrop-blur-xl border border-foreground/10 shadow-sm no-print">
      <div className="flex items-center justify-between gap-4">
        {/* Scrollspy Navigation Links */}
        <nav 
          aria-label="Trail sections"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 font-bold"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Toolset: Save, Share, Print, 3D Map */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-foreground/10">
          {/* Bookmark / Save Trail Button */}
          <button
            onClick={() => toggle(place)}
            className={`p-2 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              saved
                ? "bg-primary text-white shadow-sm"
                : "bg-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground/70 hover:text-foreground border border-foreground/10"
            }`}
            title={saved ? "Remove from saved expeditions" : "Save this expedition"}
            aria-label={saved ? "Saved" : "Save expedition"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-white" : ""}`} />
            <span className="hidden md:inline">{saved ? "Saved" : "Save"}</span>
          </button>

          {/* Native Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-foreground/[0.04] hover:bg-foreground/[0.08] border border-foreground/10 text-foreground/70 hover:text-foreground text-xs font-mono font-medium flex items-center gap-1.5 transition-all relative"
            title="Share trail guide"
            aria-label="Share trail guide"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold hidden md:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Share</span>
              </>
            )}
          </button>

          {/* Offline Print Guide Button */}
          <button
            onClick={handlePrint}
            className="hidden lg:flex p-2 rounded-xl bg-foreground/[0.04] hover:bg-foreground/[0.08] border border-foreground/10 text-foreground/70 hover:text-foreground text-xs font-mono font-medium items-center gap-1.5 transition-all"
            title="Print offline paper itinerary"
            aria-label="Print offline paper itinerary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* 3D Map Direct Launch */}
          <Link
            href="/map"
            className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            title="View trail in interactive 3D terrain"
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Topo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
