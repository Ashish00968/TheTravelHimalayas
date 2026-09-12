"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, Droplets, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface TrekTrailStoryProps {
  title: string;
  images: string[];
  subRegionName: string;
  stateSlug: string;
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.25)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.25)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.25)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.25)" },
};

// Detailed field notes and captions for the 12 authentic Patalsu plates
interface PlateMeta {
  stage: string;
  title: string;
  altitude: string;
  caption: string;
  personalNote?: string;
}

const PHOTO_STORY_DATA: Record<string, PlateMeta> = {
  "2clearviewofPatalsu": {
    stage: "Stage 01 • The Valley Floor",
    title: "Looking at Patalsu Peak from Burwa Village",
    altitude: "2,480m",
    caption: "A clear morning view looking up at the 4,261m pyramid of Patalsu Peak from Burwa Village before heading toward the Solang trailhead.",
    personalNote: "Standing at Burwa Village looking up at the mountain, you realize the scale of the +1,781 vertical meters ahead. There are no shortcuts.",
  },
  "4GoingtoSolangVillage": {
    stage: "Stage 01 • The Valley Floor",
    title: "Solang Village Visible from Solang Valley",
    altitude: "2,480m",
    caption: "Looking across from Solang Valley toward Solang Village nestled on the mountainside as you cross the stream on the way to the trail start.",
    personalNote: "Going to Solang Village — crossing the valley bridge as the traditional stone settlement comes into view.",
  },
  "6SolangVillage": {
    stage: "Stage 01 • The Valley Floor",
    title: "Traditional Timber & Stone Hamlet",
    altitude: "2,500m",
    caption: "Ancient Solang Village with its characteristic timber-framed stone homes, slate roofs, and apple orchards where the trail begins.",
    personalNote: "The village is peaceful and quiet in early morning. Locals are heading out with their livestock as you take the trail upward.",
  },
  "7trekStart": {
    stage: "Stage 02 • Into the Ancient Woods",
    title: "Entering the Cedar Forest",
    altitude: "2,550m",
    caption: "Stepping off the stone village lanes onto the dirt trail that plunges into dense deodar, pine, and birch woodland.",
  },
  "8intotheforestsectionCattleGrazing": {
    stage: "Stage 02 • Into the Ancient Woods",
    title: "Pastoral Forest Glades",
    altitude: "2,850m",
    caption: "Tall cedars give way to sun-dappled glades where mountain cattle graze quietly in the morning light.",
    personalNote: "The forest climb is steady and cool under the canopy, but the gradient never really lets up.",
  },
  "9_1doghiking": {
    stage: "Stage 02 • Into the Ancient Woods",
    title: "The Mountain Companion",
    altitude: "3,100m",
    caption: "A friendly local Himalayan sheepdog who joined our climb from the village and faithfully navigated the entire route with us.",
    personalNote: "He appeared near the edge of the forest and stayed with us through the high meadow and onto the ridge. A true mountain spirit.",
  },
  "10abovetheTreelineViewOfDhauladharRanges": {
    stage: "Stage 03 • Breaking the Timberline",
    title: "Breaking Above the Treeline",
    altitude: "3,250m",
    caption: "Emerging into the high alpine meadow of Shagadugh. The forest abruptly ends, revealing the vast, sweeping panorama of the Dhauladhar ranges.",
    personalNote: "This is the moment the whole climb changes. The trees fall away, the wind picks up, and you see the mountain spine ahead.",
  },
  "11IntoRidgeline": {
    stage: "Stage 03 • Breaking the Timberline",
    title: "Ascending the Open Arête",
    altitude: "3,650m",
    caption: "The trail steepens dramatically across golden autumn grass slopes, transitioning steadily into rocky switchbacks along the mountain spine.",
  },
  "13ViewOfHanumanTibba": {
    stage: "Stage 04 • The Colossus & The Scree",
    title: "Facing Hanuman Tibba (5,982m)",
    altitude: "3,850m",
    caption: "Directly across the western abyss of Solang, the immense glaciated pyramid of Hanuman Tibba reveals its colossal sheer walls and hanging seracs.",
    personalNote: "You are climbing Patalsu, but your eyes keep getting pulled to Hanuman Tibba. It feels so close you could almost touch the ice.",
  },
  "12FinalRidge": {
    stage: "Stage 04 • The Colossus & The Scree",
    title: "The Relentless Scree Ridge",
    altitude: "4,050m",
    caption: "The final 200m vertical push is an exposed knife-edge of loose shale and wind-scoured scree where deliberate, disciplined footing is mandatory.",
    personalNote: "This was the most exhausting section. Two steps forward, half a step sliding back in the loose scree with cold autumn wind howling.",
  },
  "14SummitSelfie": {
    stage: "Stage 05 • The Summit & Golden Hour",
    title: "The 4,261m Summit Pinnacle",
    altitude: "4,261m",
    caption: "Standing on the pinnacle of Patalsu Peak with prayer flags fluttering in the freezing wind, rewarded with an unobstructed 360° Himalayan amphitheater.",
    personalNote: "Reaching the summit cairn after hours of non-stop climbing was pure euphoria. The silence up here, looking over Pir Panjal and Lahaul, is absolute.",
  },
  "15SunsetHanumanTibba": {
    stage: "Stage 05 • The Summit & Golden Hour",
    title: "Alpenglow on Hanuman Tibba",
    altitude: "3,400m",
    caption: "On the long descent back down the mountain, the setting October sun set the west face of Hanuman Tibba ablaze in deep golden and crimson alpenglow.",
    personalNote: "After 12 continuous hours on the mountain, watching this sunset while descending toward the valley made every single grueling step worth it.",
  },
};

export function TrekTrailStory({
  title,
  images,
  subRegionName,
  stateSlug,
  isPatalsu = false,
}: TrekTrailStoryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.25)",
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") {
        setActivePhotoIndex(null);
      } else if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      }
    },
    [activePhotoIndex, images.length]
  );

  useEffect(() => {
    if (activePhotoIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhotoIndex, handleKeyDown]);

  if (!images || images.length === 0) return null;

  const getMeta = (src: string, idx: number): PlateMeta => {
    let meta: PlateMeta = {
      stage: `Stage 0${Math.min(5, Math.floor(idx / 2.5) + 1)}`,
      title: `Plate 0${idx + 1} • Trail Observation`,
      altitude: "Alpine Zone",
      caption: `Field observation on the ${title} route through ${subRegionName}.`,
    };
    if (isPatalsu) {
      for (const [key, val] of Object.entries(PHOTO_STORY_DATA)) {
        if (src.includes(key)) {
          meta = val;
          break;
        }
      }
    }
    return meta;
  };

  return (
    <section 
      id="trail" 
      className="container mx-auto px-4 sm:px-6 max-w-6xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-label="The Trail Experience and Photographic Chronicle"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Hiker&apos;s Field Dispatch
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      {/* Main Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-slate-900 dark:text-foreground tracking-tight mb-3">
            The Trail
          </h2>
          <p className="text-slate-600 dark:text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            {isPatalsu
              ? "A first-hand visual chronicle and field observations from Solang Village to the 4,261m crest."
              : `Photographic plates and visual observations along the ${title} route in ${subRegionName}.`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-foreground/50 shrink-0">
          <Camera className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>{images.length} Authentic Trail Plates &bull; Click to Expand</span>
        </div>
      </div>

      {/* Author Byline & Expedition Profile Card (Strictly Patalsu) */}
      {isPatalsu && (
        <>
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 sm:mb-12 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#080e1a]/90 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-lg text-white shadow-lg shrink-0"
                style={{ backgroundColor: style.accent }}
              >
                A
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-foreground">
                    Story &amp; Photographs by Ashish
                  </span>
                  <Link
                    href="https://instagram.com/ashish_0968"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/10 min-h-[36px] transition-colors"
                  >
                    <InstagramIcon className="w-3 h-3 text-pink-500" />
                    <span>@ashish_0968</span>
                  </Link>
                </div>
                <p className="text-xs text-slate-500 dark:text-foreground/60 font-mono">
                  October Autumn Ascent &bull; 1-Day Alpine Speed-Hike (12–13 Hours Continuous)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-slate-700 dark:text-foreground/75 border-t sm:border-t-0 sm:border-l border-slate-200/80 dark:border-foreground/[0.08] pt-4 sm:pt-0 sm:pl-6">
              <div>
                <span className="block text-[10px] uppercase text-slate-400 dark:text-foreground/40 font-bold">Elevation Gain</span>
                <strong className="text-slate-900 dark:text-foreground text-sm">+1,781 m</strong>
              </div>
              <div className="w-px h-8 bg-slate-200/80 dark:bg-foreground/[0.08]" />
              <div>
                <span className="block text-[10px] uppercase text-slate-400 dark:text-foreground/40 font-bold">Total Time</span>
                <strong className="text-slate-900 dark:text-foreground text-sm">12–13 Hours</strong>
              </div>
              <div className="w-px h-8 bg-slate-200/80 dark:bg-foreground/[0.08]" />
              <div>
                <span className="block text-[10px] uppercase text-slate-400 dark:text-foreground/40 font-bold">Trail Season</span>
                <strong className="text-slate-900 dark:text-foreground text-sm">October</strong>
              </div>
            </div>
          </motion.div>

          {/* Author's Real Expedition Reflection */}
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 border-l-4 relative overflow-hidden shadow-sm dark:shadow-none"
            style={{ borderLeftColor: style.accent }}
          >
            <span 
              className="font-mono text-xs font-bold uppercase tracking-widest block mb-2"
              style={{ color: style.accent }}
            >
              From the Hiker
            </span>
            <blockquote className="font-serif italic text-base sm:text-lg text-slate-800 dark:text-foreground/90 leading-relaxed mb-4">
              &ldquo;I did Patalsu as a continuous 12 to 13-hour single-day speed-hike in October with only minimal breaks. Conquering the +1,781m vertical gain in one push is an incredible test of mountain endurance, but for most trekkers, I strongly recommend doing this as a 2 to 3-day trek. Camping at Shagadugh gives your body time to acclimatize and lets you truly experience the peaceful forest before tackling the relentless loose scree on the summit ridge.&rdquo;
            </blockquote>
            <span className="text-xs font-mono text-slate-500 dark:text-foreground/50">
              — Ashish, October Mountain Climb
            </span>
          </motion.div>

          {/* Critical Water Warning Callout */}
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-14 sm:mb-16 p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 flex items-start gap-4 text-amber-950 dark:text-amber-200 shadow-sm dark:shadow-md"
          >
            <Droplets className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-base text-amber-900 dark:text-amber-300 mb-1">
                Crucial Water Warning: Carry 2 to 4 Liters
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200/90 font-light leading-relaxed">
                Natural running water ends very early on this route, roughly <strong>500 meters above Solang Village</strong>. The upper cedar forest, the autumn meadow at Shagadugh, and the entire summit ridge are dry. You must carry at least <strong>2 to 4 Liters of water per person</strong> from the valley.
              </p>
            </div>
          </motion.div>
        </>
      )}

      {/* Chronological 12-Plate Photo Journey */}
      <div className="space-y-16 sm:space-y-24">
        {images.map((src, idx) => {
          const meta = getMeta(src, idx);
          const isEven = idx % 2 === 0;

          return (
            <motion.div 
              key={idx}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Photo Frame with Click-to-Enlarge Trigger */}
              <div 
                onClick={() => setActivePhotoIndex(idx)}
                className={`lg:col-span-8 relative aspect-[16/10] sm:aspect-[21/11] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer ${
                  !isEven ? "lg:order-2" : ""
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Enlarge photo: ${meta.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActivePhotoIndex(idx);
                  }
                }}
              >
                <Image
                  src={src}
                  alt={`${title} - ${meta.title}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-opacity group-hover:opacity-80" />
                
                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                    Plate {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <span 
                    className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border"
                    style={{ 
                      backgroundColor: `${style.accent}20`,
                      color: style.accent,
                      borderColor: `${style.accent}40`
                    }}
                  >
                    {meta.altitude}
                  </span>
                </div>

                {/* Enlarge Hint on Hover */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </div>
              </div>

              {/* Story & Field Note Description */}
              <div className={`lg:col-span-4 space-y-3.5 ${!isEven ? "lg:order-1" : ""}`}>
                <span 
                  className="font-mono text-[11px] uppercase tracking-widest font-bold block"
                  style={{ color: style.accent }}
                >
                  {meta.stage}
                </span>
                
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-foreground tracking-tight leading-tight">
                  {meta.title}
                </h3>
                
                <p className="text-slate-600 dark:text-foreground/75 font-light text-sm sm:text-base leading-relaxed">
                  {meta.caption}
                </p>

                {meta.personalNote && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-foreground/[0.08]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-foreground/40 block mb-1">
                      Field Note
                    </span>
                    <p className="text-xs sm:text-sm font-serif italic text-slate-800 dark:text-foreground/85 leading-relaxed">
                      &ldquo;{meta.personalNote}&rdquo;
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-foreground/45">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{subRegionName} Trail &bull; {meta.altitude}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Photo Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 bg-black/90 backdrop-blur-2xl"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Modal Content Container */}
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[95vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-[#080e1a] border border-white/15 shadow-2xl dark-photo-card preserve-white-text"
            >
              {/* Top Controls */}
              <div className="flex items-center justify-between p-3 sm:p-5 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white">
                    Plate {activePhotoIndex + 1} of {images.length}
                  </span>
                  <span 
                    className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${style.accent}20`,
                      color: style.accent,
                    }}
                  >
                    {getMeta(images[activePhotoIndex], activePhotoIndex).altitude}
                  </span>
                </div>

                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image Frame */}
              <div className="relative aspect-[16/10] sm:aspect-[21/11] w-full max-h-[60vh] sm:max-h-[65vh] overflow-hidden bg-black">
                <Image
                  src={images[activePhotoIndex]}
                  alt={getMeta(images[activePhotoIndex], activePhotoIndex).title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />

                {/* Left / Right Chevrons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-white transition-all border border-white/20"
                      aria-label="Previous Image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-white transition-all border border-white/20"
                      aria-label="Next Image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Caption & Field Note */}
              <div className="p-4 sm:p-6 border-t border-white/10 bg-[#080e1a] space-y-1.5 sm:space-y-2 max-h-[25vh] overflow-y-auto">
                <h4 className="font-display font-bold text-base sm:text-xl text-white">
                  {getMeta(images[activePhotoIndex], activePhotoIndex).title}
                </h4>
                <p className="text-white/75 font-light text-xs sm:text-sm leading-relaxed">
                  {getMeta(images[activePhotoIndex], activePhotoIndex).caption}
                </p>
                {getMeta(images[activePhotoIndex], activePhotoIndex).personalNote && (
                  <p className="text-xs font-serif italic text-white/90 pt-1">
                    &ldquo;{getMeta(images[activePhotoIndex], activePhotoIndex).personalNote}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
