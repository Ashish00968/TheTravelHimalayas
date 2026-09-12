"use client";

import React from "react";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";
import { Peak } from "@/data/types";
import { peaks } from "@/data/peaks";
import { ExpeditionHero } from "./ExpeditionHero";
import { ExpeditionQuickFacts } from "./ExpeditionQuickFacts";
import { ExpeditionProfile } from "./ExpeditionProfile";
import { ExpeditionObjective } from "./ExpeditionObjective";
import { ExpeditionRouteSchematic } from "./ExpeditionRouteSchematic";
import { ExpeditionAltitudeProfile } from "./ExpeditionAltitudeProfile";
import { ExpeditionTechnicalAssessment } from "./ExpeditionTechnicalAssessment";
import { ExpeditionLogistics } from "./ExpeditionLogistics";
import { ExpeditionGear } from "./ExpeditionGear";
import { ExpeditionSafetyRisk } from "./ExpeditionSafetyRisk";
import { ExpeditionMapContext } from "./ExpeditionMapContext";
import { ExpeditionNearby } from "./ExpeditionNearby";
import { ExpeditionFAQ } from "./ExpeditionFAQ";
import { ExpeditionEnding } from "./ExpeditionEnding";
import { ImageGallery } from "@/components/content/ImageGallery";

interface ExpeditionTemplateProps {
  place: HimalayaPlace;
  region: HimalayaRegion;
  subRegion: HimalayaSubRegion;
  state: string;
  division: string;
  breadcrumbItems: { label: string; href: string }[];
}

export function ExpeditionTemplate({
  place,
  region,
  subRegion,
  state,
  division,
  breadcrumbItems,
}: ExpeditionTemplateProps) {
  // Resolve peak data either directly from place.peakData or via peaks registry
  const peak: Peak =
    place.peakData ||
    peaks.find((p) => p.slug === place.id) || {
      slug: place.id,
      title: place.name,
      region: subRegion.name,
      difficulty: (place.difficulty as "Easy" | "Moderate" | "Difficult" | "Challenging") || "Moderate",
      height: parseInt(place.elevation?.replace(/[^\d]/g, "") || "5000", 10),
      expeditionSeason: place.bestSeason || "May to June, September to October",
      baseCamp: `${place.name} Base Camp`,
      overview: place.overview || `${place.name} is a prominent Himalayan summit in ${subRegion.name}.`,
      climbingRoute: place.routeDescription || "Standard alpine route via base camp and high camp ridge.",
      expeditionDetails: "Standard Himalayan alpine staging requiring acclimatization days and high camp establishment.",
      gearRequirements: [
        "Mountaineering boots",
        "Crampons",
        "Ice axe",
        "Climbing harness",
        "CE-certified helmet",
      ],
      faqs: place.faqs || [],
      images: place.images || [],
      description: place.overview || `Expedition profile for ${place.name}.`,
      coords: place.coords,
    };

  const images = peak.images && peak.images.length > 0 ? peak.images : place.images || [];

  return (
    <article className="min-h-screen bg-[#040812] text-white dark dark-photo-card preserve-white-text">
      {/* 1. Cinematic Expedition Hero */}
      <ExpeditionHero
        place={place}
        peak={peak}
        regionName={region.name}
        subRegionName={subRegion.name}
        stateSlug={state}
        breadcrumbItems={breadcrumbItems}
      />

      {/* Main Expedition Dossier Content */}
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-20 space-y-16 sm:space-y-24">
        {/* 2. Expedition Quick Facts Rail */}
        <ExpeditionQuickFacts
          place={place}
          peak={peak}
          region={region}
          subRegion={subRegion}
          stateSlug={state}
        />

        {/* 3. Mountain Profile ("The Mountain") */}
        <ExpeditionProfile
          peak={peak}
          regionName={region.name}
          subRegionName={subRegion.name}
          stateSlug={state}
        />

        {/* 4. Alpine Objective & Staging ("The Objective") */}
        <ExpeditionObjective
          peak={peak}
          stateSlug={state}
        />

        {/* 5. Climbing Route Schematic & Progression */}
        <ExpeditionRouteSchematic
          peak={peak}
          stateSlug={state}
        />

        {/* 6. Altitude Profile & Physiological Milestones */}
        <ExpeditionAltitudeProfile
          peak={peak}
          stateSlug={state}
        />

        {/* 7. Technical Assessment & Objective Hazards */}
        <ExpeditionTechnicalAssessment
          peak={peak}
          stateSlug={state}
        />

        {/* 8. Expedition Logistics & Permits */}
        <ExpeditionLogistics
          peak={peak}
          region={region}
          subRegion={subRegion}
          stateSlug={state}
        />

        {/* 9. Mountaineering Gear & High-Camp Systems */}
        <ExpeditionGear
          peak={peak}
          stateSlug={state}
        />

        {/* 10. Risk Analysis, Hypoxia Protocol & SAR Contacts */}
        <ExpeditionSafetyRisk
          peak={peak}
          stateSlug={state}
        />

        {/* 11. 3D Mountain Map Launcher */}
        <ExpeditionMapContext
          place={place}
          peak={peak}
          stateSlug={state}
        />

        {/* Optional High-Altitude Photography */}
        {images.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-primary">
                Expedition Photography
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight">
              Visual Archive: {peak.title}
            </h2>
            <ImageGallery images={images} alt={peak.title} />
          </section>
        )}

        {/* 12. Expedition Technical FAQ */}
        <ExpeditionFAQ
          peak={peak}
          stateSlug={state}
        />

        {/* 13. Neighboring Massifs & Regional Alpine Network */}
        <ExpeditionNearby
          stateId={state}
          divisionId={division}
          currentPlaceId={place.id}
          subRegionName={subRegion.name}
          stateSlug={state}
        />

        {/* 14. Final Alpine Exploration CTA */}
        <ExpeditionEnding
          place={place}
          peak={peak}
          region={region}
          subRegion={subRegion}
          stateSlug={state}
          divisionSlug={division}
        />
      </div>
    </article>
  );
}
