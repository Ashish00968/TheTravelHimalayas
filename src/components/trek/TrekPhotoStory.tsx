"use client";

import React from "react";
import Image from "next/image";
import { Camera, MapPin } from "lucide-react";

interface TrekPhotoStoryProps {
  title: string;
  images: string[];
  subRegionName: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

// Curated photo captions for Patalsu's authentic expedition series
const PHOTO_CAPTIONS: Record<string, { title: string; caption: string }> = {
  "2clearviewofPatalsu": {
    title: "The Distant Summit Pyramid",
    caption: "Looking up from Solang Valley toward the 4,261m crown of Patalsu Peak before setting out."
  },
  "4GoingtoSolangVillage": {
    title: "The Approach to Solang",
    caption: "Crossing the mountain stream and winding upward toward the ancient trailhead village."
  },
  "6SolangVillage": {
    title: "Historic Solang Architecture",
    caption: "Traditional deodar wood and stone mountain homes with slate roofs marking the trailhead entry."
  },
  "7trekStart": {
    title: "Trailhead Departure",
    caption: "Stepping off the stone paved paths into the lower cedar and oak woodland."
  },
  "8intotheforestsectionCattleGrazing": {
    title: "Shaded Forest Clearings",
    caption: "Ancient oak and silver birch groves where local mountain cattle graze peacefully in quiet glades."
  },
  "9_1doghiking": {
    title: "The Trail Companion",
    caption: "A friendly local Himalayan sheepdog guiding the switchbacks through the upper pine forest."
  },
  "10abovetheTreelineViewOfDhauladharRanges": {
    title: "Breaking the Timberline",
    caption: "Emerging into the wide alpine meadow of Shagadugh (3,250m) with the Dhauladhar crest sweeping the horizon."
  },
  "11IntoRidgeline": {
    title: "Ascending the Exposed Arête",
    caption: "Steep scree switchbacks leading onto the narrow, wind-swept northern ridge."
  },
  "13ViewOfHanumanTibba": {
    title: "Monument of Rock and Ice",
    caption: "Hanuman Tibba (5,982m) rising in colossal scale directly west across the valley."
  },
  "12FinalRidge": {
    title: "The Summit Arête",
    caption: "Navigating loose shale and fractured rock bands on the final 200m vertical summit push."
  },
  "14SummitSelfie": {
    title: "The 4,261m Summit Crest",
    caption: "Standing on the pinnacle of Patalsu Peak with unrestricted 360-degree Himalayan vistas."
  },
  "15SunsetHanumanTibba": {
    title: "Alpenglow on Hanuman Tibba",
    caption: "Golden hour sunlight setting the snow-clad western summits ablaze as dusk settles over Kullu."
  },
};

export function TrekPhotoStory({
  title,
  images,
  subRegionName,
  stateSlug,
}: TrekPhotoStoryProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  if (!images || images.length === 0) return null;

  return (
    <section 
      id="gallery" 
      className="container mx-auto px-6 max-w-6xl py-16 sm:py-24 scroll-mt-24 border-t border-foreground/[0.08]"
      aria-labelledby="gallery-heading"
    >
      {/* Chapter Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-[11px] font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Chapter 10 &bull; Photo Essay
        </span>
        <div className="h-px flex-1 bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 
            id="gallery-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-foreground tracking-tight mb-3"
          >
            From the Trail
          </h2>
          <p className="text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            A visual chronicle documenting the terrain transformation, high camp, and summit crest of the {title}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-foreground/50">
          <Camera className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>{images.length} Authentic Trail Plates</span>
        </div>
      </div>

      {/* Editorial Photo Essay Layout */}
      <div className="space-y-12 sm:space-y-16">
        {images.map((src, idx) => {
          // Identify caption from filename
          let meta = {
            title: `Plate 0${idx + 1} &bull; Expedition Vista`,
            caption: `Field observation on the ${title} route through ${subRegionName}.`
          };

          for (const [key, val] of Object.entries(PHOTO_CAPTIONS)) {
            if (src.includes(key)) {
              meta = val;
              break;
            }
          }

          const isEven = idx % 2 === 0;

          return (
            <div 
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
            >
              {/* Photo Frame (Alternating Order for Editorial Balance) */}
              <div 
                className={`lg:col-span-8 relative aspect-[16/10] sm:aspect-[21/11] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group ${
                  !isEven ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} - ${meta.title}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <span className="absolute bottom-4 left-4 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                  Plate 0{idx + 1}
                </span>
              </div>

              {/* Photo Narrative Description */}
              <div className={`lg:col-span-4 space-y-3 ${!isEven ? "lg:order-1" : ""}`}>
                <span 
                  className="font-mono text-[10px] uppercase tracking-widest font-bold block"
                  style={{ color: style.accent }}
                >
                  Expedition Journal
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground tracking-tight">
                  {meta.title}
                </h3>
                <p className="text-foreground/75 font-light text-sm sm:text-base leading-relaxed">
                  {meta.caption}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-foreground/45">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{subRegionName} Trailhead</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
