"use client";

import React from "react";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";
import { PlaceHero } from "./PlaceHero";
import { PlaceQuickFacts } from "./PlaceQuickFacts";
import { PlaceOverview } from "./PlaceOverview";
import { PlaceHighlights } from "./PlaceHighlights";
import { PlaceAccess } from "./PlaceAccess";
import { PlaceMapContext } from "./PlaceMapContext";
import { PlaceSeason } from "./PlaceSeason";
import { PlaceNearby } from "./PlaceNearby";
import { PlaceFAQ } from "./PlaceFAQ";
import { PlaceEnding } from "./PlaceEnding";
import { ImageGallery } from "@/components/content/ImageGallery";

interface PlaceTemplateProps {
  place: HimalayaPlace;
  region: HimalayaRegion;
  subRegion: HimalayaSubRegion;
  state: string;
  division: string;
  breadcrumbItems: { label: string; href: string }[];
}

export function PlaceTemplate({
  place,
  region,
  subRegion,
  state,
  division,
  breadcrumbItems,
}: PlaceTemplateProps) {
  // Only use authentic hero image if provided; strictly no repeating territory fallback
  const heroImage =
    place.heroImage ||
    place.image ||
    (place.images && place.images.length > 0 ? place.images[0] : undefined);

  const images = place.images || [];

  return (
    <article className="min-h-screen bg-[#F8FAFC] dark:bg-[#040812] text-slate-900 dark:text-white transition-colors duration-300">
      {/* 1. Cinematic Place Hero */}
      <PlaceHero
        title={place.name}
        regionName={region.name}
        subRegionName={subRegion.name}
        stateSlug={state}
        divisionSlug={division}
        placeType={place.type}
        elevation={place.elevation}
        heroImage={heroImage}
        description={place.overview}
        placeId={place.id}
        breadcrumbItems={breadcrumbItems}
      />

      {/* Main Editorial Body */}
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-20 space-y-16 sm:space-y-24">
        {/* 2. Quick Facts Panel */}
        <PlaceQuickFacts
          place={place}
          region={region}
          subRegion={subRegion}
          stateSlug={state}
        />

        {/* 3. Field Guide Overview */}
        <PlaceOverview
          place={place}
          subRegionName={subRegion.name}
          regionName={region.name}
          stateSlug={state}
        />

        {/* 4. Highlights & Field Notes */}
        <PlaceHighlights
          place={place}
          stateSlug={state}
        />

        {/* 5. Access & Live Mountain Weather */}
        <PlaceAccess
          place={place}
          region={region}
          subRegion={subRegion}
          stateSlug={state}
        />

        {/* 6. Seasonal Character & Atmospheric Cycles */}
        <PlaceSeason
          place={place}
          stateSlug={state}
        />

        {/* 7. 3D Map Context Launcher */}
        <PlaceMapContext
          place={place}
          stateSlug={state}
        />

        {/* Optional Image Gallery */}
        {images.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-primary">
                Visual Documentation
              </span>
              <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Photography of {place.name}
            </h2>
            <ImageGallery images={images} alt={place.name} />
          </section>
        )}

        {/* 7. Frequently Asked Questions */}
        <PlaceFAQ
          place={place}
          stateSlug={state}
        />

        {/* 8. Regional Field Network & Nearby */}
        <PlaceNearby
          stateId={state}
          divisionId={division}
          currentPlaceId={place.id}
          subRegionName={subRegion.name}
          stateSlug={state}
        />

        {/* 9. Final Explore CTA */}
        <PlaceEnding
          place={place}
          region={region}
          subRegion={subRegion}
          stateSlug={state}
          divisionSlug={division}
        />
      </div>
    </article>
  );
}
