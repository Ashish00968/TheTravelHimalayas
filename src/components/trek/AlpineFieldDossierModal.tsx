"use client";

import React, { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  Printer,
  Check,
  X,
  ShieldAlert,
  Compass,
  Radio,
  User,
  HeartPulse,
  Droplet,
  CheckSquare,
  Square,
  Share2,
} from "lucide-react";
import { EMERGENCY_SAR_CONTACTS } from "@/data/mountain-safety";
import { getRouteData } from "@/data/routes";
import { parseAndComputeHadi } from "@/lib/hadi";
import { getTrailSeasonCondition } from "@/lib/season-conditions";

interface AlpineFieldDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  coords?: [number, number];
  startPoint?: string;
  maxAltitude: string;
  distance: string;
  duration: string;
  difficulty: string;
  stateSlug: string;
  regionName: string;
  subRegionName: string;
  bestSeason?: string;
  itinerary?: {
    day?: number;
    title: string;
    description?: string;
    elevationMeters?: number;
    altitude?: string;
    distanceKm?: number;
    distance?: string;
  }[];
  packingList?: string[];
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; name: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", name: "Jammu & Kashmir" },
  "himachal-pradesh": { accent: "#F59E0B", name: "Himachal Pradesh" },
  ladakh:             { accent: "#7C3AED", name: "Ladakh (UT)" },
  uttarakhand:        { accent: "#0D9488", name: "Uttarakhand" },
};

// Barometric effective oxygen formula relative to sea-level (1013.25 hPa)
function getEffectiveOxygenPct(altitudeM: number): number {
  if (altitudeM <= 0) return 100;
  const ratio = Math.pow(1 - 2.25577e-5 * altitudeM, 5.25588);
  return Math.max(40, Math.min(100, Math.round(ratio * 100)));
}

// Extract numeric altitude
function parseAltitudeNum(altStr: string): number {
  const match = altStr.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 3200;
}

const DEFAULT_ESSENTIAL_GEAR = [
  { id: "diamox", label: "Acetazolamide (Diamox 125/250mg) • AMS prophylaxis", cat: "medical" },
  { id: "oximeter", label: "Pulse Oximeter & SpO2 Tracker • Twice daily checks", cat: "medical" },
  { id: "pain-fever", label: "Paracetamol 650mg / Ibuprofen 400mg + Blister tape", cat: "medical" },
  { id: "water-filter", label: "0.1 Micron Hollow-Fiber Water Filter or Chlorine Dioxide", cat: "medical" },
  { id: "headlamp", label: "Headlamp (150+ lumens) + Spare lithium cold-rated batteries", cat: "hardware" },
  { id: "poles", label: "Trekking Poles with carbide tips (moraine balance)", cat: "hardware" },
  { id: "glacier-shades", label: "UV400 Cat 3/4 Glacier Sunglasses (snow blindness protection)", cat: "hardware" },
  { id: "spikes", label: "Microspikes or Crampons (high pass / hardpack snow)", cat: "hardware" },
  { id: "whistle", label: "Emergency Whistle (Alpine standard 6-blast frequency)", cat: "hardware" },
  { id: "insulation-flask", label: "Insulated 1L Thermal Flask (prevents freezing at night)", cat: "hardware" },
  { id: "base-layer", label: "Merino Wool or Synthetic Thermal Base Layer", cat: "clothing" },
  { id: "down-jacket", label: "High-Loft Down Jacket (rated to -10°C / sub-zero)", cat: "clothing" },
  { id: "hardshell", label: "Waterproof / Windproof 3-Layer Hard-Shell Jacket", cat: "clothing" },
  { id: "thermal-gloves", label: "Windproof Thermal Gloves + Fleece Balaclava", cat: "clothing" },
  { id: "dossier-paper", label: "Physical Printed Copy of this DHT Alpine Dossier", cat: "navigation" },
  { id: "compass-gpx", label: "Magnetic Sighting Compass + Handheld Offline GPX track", cat: "navigation" },
];

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function AlpineFieldDossierModal({
  isOpen,
  onClose,
  title,
  slug,
  coords,
  startPoint = "Base Trailhead",
  maxAltitude,
  distance,
  duration,
  difficulty,
  stateSlug,
  regionName,
  subRegionName,
  bestSeason = "May to October",
  itinerary = [],
  packingList = [],
  isPatalsu = false,
}: AlpineFieldDossierModalProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const [copiedSos, setCopiedSos] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hikerName, setHikerName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [iceContact, setIceContact] = useState("");
  const [guideName, setGuideName] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [checkedGear, setCheckedGear] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    DEFAULT_ESSENTIAL_GEAR.forEach((g) => {
      initial[g.id] = true; // default all checked for expedition readiness
    });
    return initial;
  });

  const territory = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6", name: "Himalayas" };
  const routeData = getRouteData(slug);
  const maxAltNum = parseAltitudeNum(maxAltitude);
  const effectiveO2 = getEffectiveOxygenPct(maxAltNum);
  const hadi = parseAndComputeHadi(distance, maxAltitude, difficulty, isPatalsu);
  const seasonCondition = getTrailSeasonCondition(bestSeason, maxAltitude, stateSlug);

  // Dynamic gear checklist incorporating route-specific packing items
  const activeGearList = useMemo(() => {
    if (packingList && packingList.length > 0) {
      const customItems = packingList.slice(0, 12).map((item, idx) => ({
        id: `pack-${idx}`,
        label: item,
        cat: "custom",
      }));
      const coreSafety = [
        DEFAULT_ESSENTIAL_GEAR[0], // Diamox
        DEFAULT_ESSENTIAL_GEAR[1], // Oximeter
        DEFAULT_ESSENTIAL_GEAR[8], // Whistle
        DEFAULT_ESSENTIAL_GEAR[14], // Physical Dossier
      ];
      return [...coreSafety, ...customItems];
    }
    return DEFAULT_ESSENTIAL_GEAR;
  }, [packingList]);

  // Territory SAR contact resolution
  const localSar = useMemo(() => {
    return (
      EMERGENCY_SAR_CONTACTS.find((c) => {
        if (stateSlug === "himachal-pradesh") return c.region.includes("Himachal");
        if (stateSlug === "uttarakhand") return c.region.includes("Uttarakhand");
        if (stateSlug === "ladakh") return c.region.includes("Ladakh");
        if (stateSlug === "jammu-kashmir") return c.region.includes("Jammu & Kashmir");
        return false;
      }) || EMERGENCY_SAR_CONTACTS[2]
    );
  }, [stateSlug]);

  const nationalSar = EMERGENCY_SAR_CONTACTS[0];
  const imfApex = EMERGENCY_SAR_CONTACTS[5];

  // Synthesize or extract milestones
  const milestones = useMemo(() => {
    if (routeData && routeData.waypoints && routeData.waypoints.length > 0) {
      return routeData.waypoints.map((wp, idx) => ({
        name: wp.name,
        distanceKm: Math.round((idx / Math.max(1, routeData.waypoints.length - 1)) * routeData.stats.distanceKm * 10) / 10,
        elevationM: wp.eleM || 0,
        type: wp.type || "waypoint",
        waterStatus: wp.type === "water" ? "Potable Stream" : wp.cautionNotice ? "Dry / Water Caution" : "Check at camp",
        caution: wp.cautionNotice || wp.note || "Maintain trail pace",
      }));
    }

    // Synthesize milestones from itinerary
    const list = [
      {
        name: startPoint,
        distanceKm: 0,
        elevationM: isPatalsu ? 2480 : Math.max(1800, maxAltNum - 1200),
        type: "trailhead",
        waterStatus: "Local roadhead / village supply",
        caution: "Fill 2.0L hydration bladders before trail departure",
      },
    ];

    itinerary.forEach((item, idx) => {
      const ele = item.elevationMeters || parseAltitudeNum(item.altitude || `${maxAltNum - 300}`);
      const dist = item.distanceKm || (idx + 1) * 4;
      list.push({
        name: item.title.split(" to ")[0] || item.title,
        distanceKm: dist,
        elevationM: ele,
        type: idx === itinerary.length - 1 ? "summit" : "camp",
        waterStatus: ele > 3500 ? "Glacial melt (Boil / Filter 100%)" : "Running mountain stream",
        caution: ele > 3000 ? "AMS threshold active • Monitor resting SpO2" : "Well-defined trail corridor",
      });
    });

    list.push({
      name: `${title} Apex`,
      distanceKm: routeData ? routeData.stats.distanceKm : 12,
      elevationM: maxAltNum,
      type: "summit",
      waterStatus: "Sub-surface / snow melt only",
      caution: "Summit turnaround cutoff: 13:00 hrs latest",
    });

    return list;
  }, [routeData, startPoint, isPatalsu, maxAltNum, itinerary, title]);

  // Dynamic dossier reference ID
  const dossierId = `DHT-${stateSlug.slice(0, 2).toUpperCase()}-${slug.slice(0, 10).toUpperCase()}-2026`;
  const formattedCoords = coords
    ? `${coords[0].toFixed(4)}° N, ${coords[1].toFixed(4)}° E (WGS 84)`
    : "32.3662° N, 77.0856° E (WGS 84)";

  // Keyboard shortcut (ESC), body scroll lock & print mode toggle
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("dossier-print-mode");
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("dossier-print-mode");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Clean print handler
  const handlePrint = useCallback(() => {
    document.body.classList.add("dossier-print-mode");
    window.print();
  }, []);

  // Copy Satellite SOS Text template
  const handleCopySos = () => {
    const text = `[EMERGENCY SOS - DHT ALPINE RESCUE]
TRAIL: ${title} (${territory.name})
APEX: ${maxAltitude} | DATUM: ${formattedCoords}
LOCAL SAR: ${localSar.agency} (${localSar.numbers.join(" / ")})
NATIONAL SAR: 112 | IMF HELIVAC: +91-11-24111224
HIKER: ${hikerName || "[NAME]"} | BLOOD: ${bloodGroup || "[BLOOD]"}
ICE CONTACT: ${iceContact || "[ICE PHONE]"}
GUIDE: ${guideName || "[LOCAL GUIDE]"}
STATUS: Urgent alpine assistance required. Send rescue unit to coordinates above.
REF: ${dossierId}`;

    navigator.clipboard.writeText(text);
    setCopiedSos(true);
    setTimeout(() => setCopiedSos(false), 2500);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const toggleGearItem = (id: string) => {
    setCheckedGear((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllGear = (selectAll: boolean) => {
    const next: Record<string, boolean> = {};
    activeGearList.forEach((g) => {
      next[g.id] = selectAll;
    });
    setCheckedGear(next);
  };

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          1. ON-SCREEN INTERACTIVE MODAL DIALOG (Authentic Paper Preview Mode)
          ════════════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200 no-print"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-4xl max-h-[94vh] flex flex-col bg-slate-100 text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-300 shadow-2xl overflow-hidden">
          
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: territory.accent }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                    Alpine Field Dossier • Print Preview
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                    {dossierId}
                  </span>
                </div>
                <h3 id="dossier-title" className="font-display font-bold text-sm sm:text-base text-slate-900 truncate max-w-[280px] sm:max-w-md">
                  {title} • 2-Page A4 Field Guide
                </h3>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySos}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-mono font-semibold transition-all"
                title="Copy Satellite SOS Template"
              >
                {copiedSos ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Radio className="w-3.5 h-3.5" />}
                <span>{copiedSos ? "Copied SOS!" : "Satellite SOS"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden xs:inline">Print / Save PDF (A4)</span>
                <span className="xs:hidden">Print PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dossier"
                className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Canvas (Drafting Board) */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-200/70 scrollbar-thin scrollbar-thumb-slate-400">
            
            {/* The Physical Paper Sheet Card */}
            <div className="bg-white text-slate-900 rounded-xl border border-slate-300 shadow-xl p-5 sm:p-8 space-y-6 max-w-3xl mx-auto">
              
              {/* Paper Sheet Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">
                      DISCOVER HIMALAYAN TRAILS • OFFICIAL EXPEDITION DOSSIER
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950 tracking-tight">
                      {title} ({maxAltitude})
                    </h2>
                    <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                      {subRegionName}, {regionName} • {territory.name} • Indian Himalayas
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end gap-1.5 shrink-0 text-left sm:text-right font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded border border-slate-900 text-slate-900 font-bold bg-slate-50">
                      {dossierId}
                    </span>
                    <span className="text-slate-500">
                      Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="font-bold text-slate-700">
                      Status: {seasonCondition.badgeText.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-dashed border-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-700 bg-slate-50 p-2.5 rounded-lg">
                  <span><strong>WGS 84 Apex:</strong> {formattedCoords}</span>
                  <span className="text-slate-300">•</span>
                  <span><strong>Trailhead:</strong> {startPoint}</span>
                  <span className="text-slate-300">•</span>
                  <span><strong>Effective O₂:</strong> {effectiveO2}% at summit</span>
                </div>
              </div>

              {/* Bento Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Summit Apex</span>
                  <span className="font-display font-bold text-base text-slate-950 block">{maxAltitude}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">({Math.round(maxAltNum * 3.28084).toLocaleString()} ft)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Trail Distance</span>
                  <span className="font-display font-bold text-base text-slate-950 block">{distance}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Round-Trip Path</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">HADI Grade</span>
                  <span className="font-display font-bold text-xs text-amber-700 block truncate font-mono">{hadi.grade}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Score: {hadi.score}/100</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Effective O₂</span>
                  <span className="font-display font-bold text-base text-blue-700 block">{effectiveO2}%</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Sea-level ratio</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Estimated Time</span>
                  <span className="font-display font-bold text-xs text-slate-950 block truncate">{duration}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Alpine Pace</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Live Season</span>
                  <span className="font-display font-bold text-xs block truncate" style={{ color: seasonCondition.badgeColor }}>
                    {seasonCondition.badgeText}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block truncate">{bestSeason}</span>
                </div>
              </div>

              {/* Vector Elevation & Trajectory Profile */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-200 px-3.5 py-2 flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                  <span>TOPOGRAPHIC ELEVATION PROFILE &amp; TRAJECTORY</span>
                  <span className="text-[10px] font-normal text-slate-500">DATUM: WGS 84</span>
                </div>
                <div className="p-3 sm:p-4 bg-white">
                  <svg viewBox="0 0 700 130" className="w-full h-auto" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="screenDossierFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    <line x1="40" y1="20" x2="680" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x="35" y="24" fontSize="8" textAnchor="end" fill="#64748b" fontFamily="monospace">
                      {maxAltitude}
                    </text>

                    <line x1="40" y1="65" x2="680" y2="65" stroke="#fca5a5" strokeDasharray="4 2" />
                    <text x="35" y="69" fontSize="8" textAnchor="end" fill="#dc2626" fontFamily="monospace">
                      3000m (AMS)
                    </text>

                    <line x1="40" y1="105" x2="680" y2="105" stroke="#e2e8f0" />
                    <text x="35" y="109" fontSize="8" textAnchor="end" fill="#64748b" fontFamily="monospace">
                      {Math.max(1800, maxAltNum - 1200)}m
                    </text>

                    <path
                      d="M 50 105 Q 180 85 300 70 T 520 40 T 660 25 L 660 115 L 50 115 Z"
                      fill="url(#screenDossierFill)"
                    />
                    <path
                      d="M 50 105 Q 180 85 300 70 T 520 40 T 660 25"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                    />

                    <circle cx="50" cy="105" r="4" fill="#0f172a" />
                    <text x="50" y="123" fontSize="8" fill="#0f172a" fontWeight="bold" fontFamily="monospace">
                      Trailhead
                    </text>

                    <circle cx="360" cy="58" r="3.5" fill="#0f172a" />
                    <text x="360" y="50" fontSize="8" textAnchor="middle" fill="#0f172a" fontFamily="monospace">
                      High Camp (3,300m)
                    </text>

                    <circle cx="660" cy="25" r="4.5" fill="#dc2626" />
                    <text x="655" y="15" fontSize="8" textAnchor="end" fill="#dc2626" fontWeight="bold" fontFamily="monospace">
                      ▲ Summit ({maxAltitude})
                    </text>
                  </svg>
                </div>
              </div>

              {/* Emergency SAR Dispatch Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-rose-50/70 border-2 border-rose-500/80">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-rose-900">
                    Territory Emergency Search &amp; Rescue (SAR) Dispatch
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-rose-200 shadow-xs">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">State / UT Mountain SAR</div>
                    <div className="font-bold text-slate-900 mb-0.5">{localSar.agency}</div>
                    <div className="font-mono text-rose-700 font-bold text-sm">{localSar.numbers.join(" • ")}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">National Emergency (ERSS)</div>
                    <div className="font-bold text-slate-900 mb-0.5">Unified Emergency Control</div>
                    <div className="font-mono text-blue-700 font-bold text-sm">{nationalSar.numbers.join(" • ")}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">IMF Apex Helivac Dispatch</div>
                    <div className="font-bold text-slate-900 mb-0.5">Indian Mountaineering Foundation</div>
                    <div className="font-mono text-amber-700 font-bold text-sm">{imfApex.numbers[0]}</div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] font-mono text-rose-950">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-rose-700" />
                    <span><strong>Alpine Distress Code:</strong> 6 whistle blasts / torch flashes per minute • 1 min silence • repeat.</span>
                  </div>
                  <span className="text-slate-600">Response code: 3 blasts / min</span>
                </div>
              </div>

              {/* Interactive Personal Emergency Slate (Field-Fillable) */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                      Hiker Field Emergency Identity Card
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Type details to print directly onto your sheet
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Hiker Full Name</label>
                    <input
                      type="text"
                      value={hikerName}
                      onChange={(e) => setHikerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Blood Group</label>
                    <input
                      type="text"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder="e.g. O+ / B+ / A-"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Emergency ICE Contact</label>
                    <input
                      type="text"
                      value={iceContact}
                      onChange={(e) => setIceContact(e.target.value)}
                      placeholder="e.g. Contact Name (+91-9876543210)"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Trek Leader / Agency</label>
                    <input
                      type="text"
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      placeholder="e.g. Self-Guided / Certified Local Guide"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Medical Allergies / Insurance Policy</label>
                    <input
                      type="text"
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      placeholder="e.g. Sulfa allergy, Asthma inhaler carried • Policy #123456"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Waypoints & Water Choke-Points Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-100 border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>ALPINE WAYPOINT MILESTONES &amp; WATER CUTOFF MATRIX</span>
                  </div>
                  <span className="text-[10px] font-normal text-slate-500">
                    {milestones.length} Field Waypoints
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase bg-slate-50">
                        <th className="py-2 px-3 font-semibold">Dist (km)</th>
                        <th className="py-2 px-3 font-semibold">Alt (m)</th>
                        <th className="py-2 px-3 font-semibold">Milestone / Waypoint</th>
                        <th className="py-2 px-3 font-semibold">Water Status</th>
                        <th className="py-2 px-3 font-semibold">Field Advisory</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {milestones.map((ms, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-blue-700 font-bold">{ms.distanceKm} km</td>
                          <td className="py-2.5 px-3 text-slate-900 font-bold">{ms.elevationM > 0 ? `${ms.elevationM}m` : "—"}</td>
                          <td className="py-2.5 px-3 text-slate-900 font-medium">{ms.name}</td>
                          <td className="py-2.5 px-3 text-emerald-700 flex items-center gap-1 font-medium">
                            <Droplet className="w-3 h-3 text-cyan-600 inline shrink-0" />
                            <span>{ms.waterStatus}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px] font-sans">{ms.caution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive Gear Checklist */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                      Expedition Packing &amp; High-Altitude First Aid Checklist
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => toggleAllGear(true)}
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      Check All
                    </button>
                    <span className="text-slate-400">•</span>
                    <button
                      type="button"
                      onClick={() => toggleAllGear(false)}
                      className="text-slate-600 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeGearList.map((item) => {
                    const isChecked = Boolean(checkedGear[item.id]);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleGearItem(item.id)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-colors border ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-medium shadow-2xs"
                            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs leading-snug">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Altitude Rules Banner */}
              {maxAltNum >= 3000 && (
                <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border-2 border-amber-500/80">
                  <div className="flex items-center gap-2 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <HeartPulse className="w-4 h-4 text-amber-700" />
                    <span>The Three Golden Rules of Altitude Safety (Active &gt; 3,000m)</span>
                  </div>
                  <ol className="text-xs text-slate-800 space-y-1.5 list-decimal pl-4 leading-relaxed font-sans">
                    <li><strong>Rule 1:</strong> Any sickness or headache at altitude is Acute Mountain Sickness (AMS) until proven otherwise.</li>
                    <li><strong>Rule 2:</strong> Never ascend with symptoms of altitude sickness. Rest at camp until symptoms completely resolve.</li>
                    <li><strong>Rule 3:</strong> If symptoms worsen, or if ataxia / confusion appears, descend immediately (minimum 500m) without hesitation.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Modal Bottom Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-white shrink-0 shadow-xs">
            <div className="flex items-center gap-3 text-xs text-slate-600 font-mono">
              <span>WGS 84 Datum: {formattedCoords}</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied" : "Share Guide"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/25 transition-all hover:scale-105 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          2. DEDICATED PRINT PORTAL (Formatted exclusively for 2-Page A4 Paper)
          ════════════════════════════════════════════════════════════════════════ */}
      <div id="alpine-field-dossier-print-container">
        
        {/* ── PAGE 1: CARTOGRAPHY, TELEMETRY & WAYPOINTS ── */}
        <section className="dossier-sheet dossier-page-break">
          {/* Official Tactical Header */}
          <div className="dossier-header-box">
            <div className="dossier-row-between">
              <div>
                <div className="dossier-masthead">DISCOVER HIMALAYAN TRAILS • ALPINE FIELD DOSSIER</div>
                <h1 className="dossier-title">{title} ({maxAltitude})</h1>
                <div className="dossier-subtitle">
                  {subRegionName}, {regionName} • {territory.name} • Indian Himalayas
                </div>
              </div>
              <div className="dossier-header-badge-col">
                <div className="dossier-ref-tag">{dossierId}</div>
                <div className="dossier-date-tag">Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                <div className="dossier-status-tag">Status: {seasonCondition.badgeText.toUpperCase()}</div>
              </div>
            </div>

            <div className="dossier-meta-strip">
              <span><strong>WGS 84 Apex:</strong> {formattedCoords}</span>
              <span>•</span>
              <span><strong>Trailhead:</strong> {startPoint}</span>
              <span>•</span>
              <span><strong>Effective O₂:</strong> {effectiveO2}% of sea-level</span>
            </div>
          </div>

          {/* Telemetry Bento Grid */}
          <div className="dossier-bento-grid">
            <div className="dossier-bento-cell">
              <div className="dossier-cell-label">TOTAL DISTANCE</div>
              <div className="dossier-cell-val">{distance}</div>
              <div className="dossier-cell-sub">Round-Trip Distance</div>
            </div>
            <div className="dossier-bento-cell">
              <div className="dossier-cell-label">SUMMIT APEX</div>
              <div className="dossier-cell-val">{maxAltitude}</div>
              <div className="dossier-cell-sub">{Math.round(maxAltNum * 3.28084).toLocaleString()} ft elevation</div>
            </div>
            <div className="dossier-bento-cell">
              <div className="dossier-cell-label">HADI GRADE</div>
              <div className="dossier-cell-val">{hadi.grade}</div>
              <div className="dossier-cell-sub">Difficulty Score: {hadi.score}</div>
            </div>
            <div className="dossier-bento-cell">
              <div className="dossier-cell-label">ESTIMATED TIME</div>
              <div className="dossier-cell-val">{duration}</div>
              <div className="dossier-cell-sub">Alpine Travel Window</div>
            </div>
            <div className="dossier-bento-cell">
              <div className="dossier-cell-label">SEASON WINDOW</div>
              <div className="dossier-cell-val">{bestSeason}</div>
              <div className="dossier-cell-sub">{seasonCondition.badgeText}</div>
            </div>
            <div className="dossier-bento-cell">
              <div className="dossier-cell-label">ALTITUDE STATUS</div>
              <div className="dossier-cell-val">{maxAltNum >= 3000 ? "AMS Active" : "Sub-Alpine"}</div>
              <div className="dossier-cell-sub">{maxAltNum >= 3000 ? "> 3,000m Threshold" : "Low Hypoxia Risk"}</div>
            </div>
          </div>

          {/* Topographic & Elevation Vector Profile Frame */}
          <div className="dossier-section-box">
            <div className="dossier-section-heading">
              <span>TOPOGRAPHIC TRAIL TRAJECTORY &amp; ELEVATION CROSS-SECTION</span>
              <span className="dossier-coord-mark">DATUM: WGS 84</span>
            </div>
            
            {/* Crisp Vector Elevation Profile SVG */}
            <div className="dossier-svg-wrapper">
              <svg viewBox="0 0 700 130" className="w-full h-auto" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="dossierFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f3f4f6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Guidelines */}
                <line x1="40" y1="20" x2="680" y2="20" stroke="#e5e7eb" strokeDasharray="3 3" />
                <text x="35" y="24" fontSize="8" textAnchor="end" fill="#6b7280" fontFamily="monospace">
                  {maxAltitude}
                </text>

                <line x1="40" y1="65" x2="680" y2="65" stroke="#fca5a5" strokeDasharray="4 2" />
                <text x="35" y="69" fontSize="8" textAnchor="end" fill="#b91c1c" fontFamily="monospace">
                  3000m (AMS)
                </text>

                <line x1="40" y1="105" x2="680" y2="105" stroke="#e5e7eb" />
                <text x="35" y="109" fontSize="8" textAnchor="end" fill="#6b7280" fontFamily="monospace">
                  {Math.max(1800, maxAltNum - 1200)}m
                </text>

                {/* Trail Trajectory Path */}
                <path
                  d="M 50 105 Q 180 85 300 70 T 520 40 T 660 25 L 660 115 L 50 115 Z"
                  fill="url(#dossierFill)"
                />
                <path
                  d="M 50 105 Q 180 85 300 70 T 520 40 T 660 25"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2.5"
                />

                {/* Milestones Markers */}
                <circle cx="50" cy="105" r="4" fill="#111827" />
                <text x="50" y="125" fontSize="8" fill="#111827" fontWeight="bold" fontFamily="monospace">
                  Trailhead
                </text>

                <circle cx="360" cy="58" r="3.5" fill="#111827" />
                <text x="360" y="50" fontSize="8" textAnchor="middle" fill="#111827" fontFamily="monospace">
                  High Camp (3,300m)
                </text>

                <circle cx="660" cy="25" r="4.5" fill="#b91c1c" />
                <text x="655" y="15" fontSize="8" textAnchor="end" fill="#b91c1c" fontWeight="bold" fontFamily="monospace">
                  ▲ Summit ({maxAltitude})
                </text>
              </svg>
            </div>
          </div>

          {/* Alpine Waypoints & Water Choke-Points Table */}
          <div className="dossier-section-box">
            <div className="dossier-section-heading">
              <span>FIELD WAYPOINTS, WATER AVAILABILITY &amp; PASSAGE CHOKE-POINTS</span>
              <span className="dossier-coord-mark">SURVEY STANDARD</span>
            </div>
            <table className="dossier-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>DIST (KM)</th>
                  <th style={{ width: "12%" }}>ELEV (M)</th>
                  <th style={{ width: "26%" }}>MILESTONE / POINT</th>
                  <th style={{ width: "22%" }}>WATER STATUS</th>
                  <th style={{ width: "28%" }}>TACTICAL FIELD ADVISORY</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((ms, idx) => (
                  <tr key={idx}>
                    <td className="dossier-bold">{ms.distanceKm} km</td>
                    <td className="dossier-bold">{ms.elevationM > 0 ? `${ms.elevationM}m` : "—"}</td>
                    <td><strong>{ms.name}</strong></td>
                    <td>{ms.waterStatus}</td>
                    <td className="dossier-note">{ms.caution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Territory Emergency Search & Rescue (SAR) Box */}
          <div className="dossier-sar-box">
            <div className="dossier-sar-title">
              🚨 TERRITORY SEARCH &amp; RESCUE (SAR) EMERGENCY DISPATCH
            </div>
            <div className="dossier-sar-grid">
              <div className="dossier-sar-card">
                <div className="dossier-sar-card-label">PRIMARY STATE / UT SAR</div>
                <div className="dossier-sar-card-agency">{localSar.agency}</div>
                <div className="dossier-sar-card-nums">{localSar.numbers.join(" • ")}</div>
              </div>
              <div className="dossier-sar-card">
                <div className="dossier-sar-card-label">NATIONAL POLICE &amp; MEDICAL</div>
                <div className="dossier-sar-card-agency">ERSS Unified Dispatch</div>
                <div className="dossier-sar-card-nums">112 (Toll Free)</div>
              </div>
              <div className="dossier-sar-card">
                <div className="dossier-sar-card-label">IMF HELIVAC DESK (APEX)</div>
                <div className="dossier-sar-card-agency">Indian Mountaineering Foundation</div>
                <div className="dossier-sar-card-nums">{imfApex.numbers[0]}</div>
              </div>
            </div>
            <div className="dossier-distress-rule">
              <strong>HIMALAYAN ALPINE DISTRESS SIGNAL:</strong> 6 whistle blasts or torch flashes per minute, followed by 1 minute silence. Repeat continuously. Response code: 3 blasts per minute.
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="dossier-footer">
            <span>Discover Himalayan Trails • Official Field Dossier • discoverhimalayantrails.com</span>
            <span>Page 1 of 2</span>
          </div>
        </section>

        {/* ── PAGE 2: ALTITUDE MEDICAL PROTOCOLS, ITINERARY, CHECKLIST & HIKER ID ── */}
        <section className="dossier-sheet">
          
          {/* Page 2 Top Marker */}
          <div className="dossier-header-mini">
            <span>{title} • EXPEDITION FIELD DOSSIER ({dossierId})</span>
            <span>HIGH-ALTITUDE SAFETY PROTOCOL &amp; CHECKLIST</span>
          </div>

          {/* High Altitude Medical Protocols (Golden Rules) */}
          {maxAltNum >= 3000 && (
            <div className="dossier-medical-box">
              <div className="dossier-medical-title">
                ⚠️ HIGH-ALTITUDE CLINICAL DIRECTIVE &amp; THE THREE GOLDEN RULES
              </div>
              <div className="dossier-medical-body">
                <p><strong>RULE 1:</strong> Any sickness or headache at altitude (&gt; 2,500m) is Acute Mountain Sickness (AMS) until proven otherwise.</p>
                <p><strong>RULE 2:</strong> NEVER ascend with symptoms of altitude sickness. Remain at camp until 100% symptom-free.</p>
                <p><strong>RULE 3:</strong> If symptoms worsen, or if ataxia (loss of physical balance) or breathlessness at rest appears (HAPE/HACE), descend immediately (minimum 500m–1,000m) without waiting. Delay can be fatal.</p>
              </div>
              <div className="dossier-medical-sub">
                <strong>Lake Louise AMS Self-Assessment Score:</strong> Headache (0–3) + Nausea/Anorexia (0–3) + Fatigue/Weakness (0–3) + Dizziness (0–3). If Score ≥ 3: Halt ascent immediately. Administer Diamox (Acetazolamide) and hydration.
              </div>
            </div>
          )}

          {/* Stage-by-Stage Itinerary Breakdown */}
          {itinerary.length > 0 && (
            <div className="dossier-section-box">
              <div className="dossier-section-heading">
                <span>STAGE-BY-STAGE EXPEDITION ITINERARY &amp; SLEEP ALTITUDE DELTA</span>
                <span className="dossier-coord-mark">ACCLIMATIZATION SCHEDULE</span>
              </div>
              <table className="dossier-table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>DAY</th>
                    <th style={{ width: "38%" }}>STAGE / ROUTE SEGMENT</th>
                    <th style={{ width: "14%" }}>DIST</th>
                    <th style={{ width: "14%" }}>CAMP ELEV</th>
                    <th style={{ width: "24%" }}>ACCLIMATIZATION ADVISORY</th>
                  </tr>
                </thead>
                <tbody>
                  {itinerary.map((it, idx) => (
                    <tr key={idx}>
                      <td className="dossier-bold">Day {it.day || idx + 1}</td>
                      <td><strong>{it.title}</strong></td>
                      <td>{it.distanceKm ? `${it.distanceKm} km` : "—"}</td>
                      <td className="dossier-bold">{it.elevationMeters ? `${it.elevationMeters}m` : it.altitude || "—"}</td>
                      <td className="dossier-note">
                        {(it.elevationMeters && it.elevationMeters > 3500) ? "Hydrate 4L • Monitor SpO2" : "Gradual pacing"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Essential Equipment & First Aid Checklist */}
          <div className="dossier-section-box">
            <div className="dossier-section-heading">
              <span>MANDATORY ALPINE EQUIPMENT &amp; FIRST-AID CHECKLIST</span>
              <span className="dossier-coord-mark">LEAVE NO TRACE</span>
            </div>
            <div className="dossier-checklist-grid">
              {activeGearList.map((item) => {
                const isChecked = Boolean(checkedGear[item.id]);
                return (
                  <div key={item.id} className="dossier-check-item">
                    <span className="dossier-checkbox">{isChecked ? "☑" : "☐"}</span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hiker Emergency Identity Slate (Field-Fillable) */}
          <div className="dossier-id-box">
            <div className="dossier-id-title">
              HIKER EMERGENCY IDENTITY &amp; MEDICAL PROFILE (FIELD SLATE)
            </div>
            <div className="dossier-id-grid">
              <div className="dossier-id-field">
                <span className="dossier-id-label">HIKER NAME:</span>
                <span className="dossier-id-value">{hikerName || "_________________________________________"}</span>
              </div>
              <div className="dossier-id-field">
                <span className="dossier-id-label">BLOOD GROUP:</span>
                <span className="dossier-id-value">{bloodGroup || "__________"}</span>
              </div>
              <div className="dossier-id-field">
                <span className="dossier-id-label">EMERGENCY (ICE) CONTACT:</span>
                <span className="dossier-id-value">{iceContact || "_________________________________________"}</span>
              </div>
              <div className="dossier-id-field">
                <span className="dossier-id-label">TREK LEADER / AGENCY:</span>
                <span className="dossier-id-value">{guideName || "_________________________________________"}</span>
              </div>
              <div className="dossier-id-field dossier-id-full">
                <span className="dossier-id-label">ALLERGIES / MEDICAL NOTES / POLICY:</span>
                <span className="dossier-id-value">{medicalNotes || "__________________________________________________________________________________"}</span>
              </div>
            </div>
          </div>

          {/* Environmental & Safety Code */}
          <div className="dossier-code-box">
            <strong>HIMALAYAN ALPINE ETHICS:</strong> Pack out 100% of non-biodegradable waste. Never camp within 50m of glacial water sources. Keep all plastic wrappers off high moraines. Protect sacred Himalayan tarns and shrines.
          </div>

          {/* Page 2 Footer */}
          <div className="dossier-footer">
            <span>Discover Himalayan Trails • Public Mountain Safety Standard • discoverhimalayantrails.com</span>
            <span>Page 2 of 2</span>
          </div>
        </section>
      </div>
    </>,
    document.body
  );
}
