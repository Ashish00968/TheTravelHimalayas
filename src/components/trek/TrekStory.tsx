"use client";

import React from "react";
import { Quote } from "lucide-react";

interface TrekStoryProps {
  title: string;
  overview: string;
  experience?: string;
  routeDescription?: string;
  startPoint?: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

export function TrekStory({
  title,
  overview,
  experience,
  routeDescription,
  startPoint = "Solang Valley",
  stateSlug,
}: TrekStoryProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.2)",
  };

  // Determine an editorial chapter title
  const baseName = startPoint.split("/")[0].split("(")[0].trim();
  const chapterTitle = baseName ? `The Climb Above ${baseName}` : "The Expedition Story";

  // Split overview into paragraphs for editorial spacing
  const paragraphs = overview.split("\n\n").filter(Boolean);
  const firstParagraph = paragraphs[0] || overview;
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <section 
      id="story" 
      className="container mx-auto px-6 max-w-5xl py-20 sm:py-28 scroll-mt-24"
      aria-label={`Expedition Story of ${title}`}
      aria-labelledby="story-heading"
    >
      {/* Chapter Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-[11px] font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Chapter 01 &bull; Expedition Narrative
        </span>
        <div className="h-px flex-1 bg-foreground/[0.08]" />
      </div>

      {/* Main Chapter Heading */}
      <h2 
        id="story-heading"
        className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-foreground tracking-tight leading-[1.08] mb-10"
      >
        {chapterTitle}
      </h2>

      {/* Large Editorial Lead Paragraph */}
      <div className="mb-10 text-foreground/90 font-light text-xl sm:text-2xl md:text-[26px] leading-relaxed">
        <p>
          <span 
            className="float-left text-5xl sm:text-6xl font-display font-bold mr-3 mt-1 leading-none"
            style={{ color: style.accent }}
          >
            {firstParagraph.charAt(0)}
          </span>
          {firstParagraph.slice(1)}
        </p>
      </div>

      {/* Editorial Pull Quote (Field Experience) */}
      {experience && (
        <div className="my-14 py-8 sm:py-10 px-6 sm:px-10 rounded-3xl bg-foreground/[0.02] border-l-4 relative overflow-hidden"
             style={{ borderLeftColor: style.accent }}>
          <Quote 
            className="w-16 h-16 absolute -top-2 right-4 text-foreground/[0.04] pointer-events-none" 
            aria-hidden="true" 
          />
          <span 
            className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] block mb-3"
            style={{ color: style.accent }}
          >
            Field Notes from the Ridge
          </span>
          <blockquote className="font-serif italic text-lg sm:text-2xl text-foreground/90 leading-relaxed">
            &ldquo;{experience}&rdquo;
          </blockquote>
        </div>
      )}

      {/* Narrative Continuation */}
      {remainingParagraphs.length > 0 && (
        <div className="space-y-6 text-foreground/80 font-light text-base sm:text-lg leading-relaxed max-w-3xl">
          {remainingParagraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      )}

      {/* Terrain & Route Character Transition */}
      {routeDescription && (
        <div className="mt-14 pt-10 border-t border-foreground/[0.08] grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4">
            <span 
              className="text-xs font-mono font-bold uppercase tracking-widest block mb-2"
              style={{ color: style.accent }}
            >
              Terrain Transformation
            </span>
            <h3 className="font-display font-bold text-xl text-foreground">
              From Cedar Forests to Wind-Scoured Scree
            </h3>
          </div>
          <div className="md:col-span-8 text-foreground/75 font-light text-sm sm:text-base leading-relaxed space-y-4">
            <p className="whitespace-pre-line">
              {routeDescription}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
