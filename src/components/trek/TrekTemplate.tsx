"use client";

import React from "react";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";
import { TrekHero } from "./TrekHero";
import { TrekOverview } from "./TrekOverview";
import { TrekContextNav } from "./TrekContextNav";
import { TrekAbout } from "./TrekAbout";
import { TrekTrailStory } from "./TrekTrailStory";
import { TrekRouteMap } from "./TrekRouteMap";
import { TrekElevation } from "./TrekElevation";
import { TrekItinerary } from "./TrekItinerary";
import { TrekInformation } from "./TrekInformation";
import { TrekFAQ } from "./TrekFAQ";
import { TrekEnding } from "./TrekEnding";

interface TrekTemplateProps {
  place: HimalayaPlace;
  region: HimalayaRegion;
  subRegion: HimalayaSubRegion;
  state: string;
  division: string;
  breadcrumbItems: { label: string; href: string }[];
}

export function TrekTemplate({
  place,
  region,
  subRegion,
  state,
  division,
  breadcrumbItems,
}: TrekTemplateProps) {
  const trek = place.trekData;
  const isPatalsu = place.id === "patalsu-peak";

  // Best available authentic photography (strictly no repeating territory fallback)
  const heroImage = isPatalsu
    ? "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/10abovetheTreelineViewOfDhauladharRanges.jpg"
    : (place.heroImage || trek?.heroImage || (place.images && place.images.length > 0 ? place.images[0] : undefined));

  const endingImage = isPatalsu
    ? "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/15SunsetHanumanTibba.jpg"
    : (place.images && place.images.length > 1 ? place.images[1] : undefined);

  const maxAltitudeVal = place.elevation || trek?.maxAltitude || (isPatalsu ? "4,261 m" : "Alpine Zone");
  const durationVal = place.duration || trek?.duration || (isPatalsu ? "2–3 Days or 1-Day Push" : "Multi-Day");
  const distanceVal = place.distance || trek?.distance || (isPatalsu ? "16 km Loop" : "Mountain Trail");
  const difficultyVal = place.difficulty || trek?.difficulty || "Moderate";
  const startPointVal = trek?.startPoint || (isPatalsu ? "Solang Village (2,480m)" : "Base Trailhead");
  const bestSeasonVal = place.bestSeason || trek?.bestSeason || "May to October";
  const itinerary = trek?.itinerary || place.itinerary || [];
  const faqs = trek?.faqs || place.faqs || [];
  const packingList = trek?.packingList || place.packingList || [];
  const images = place.images || trek?.images || [];
  const coords = place.coords || trek?.coords;
  const pathCoords = trek?.pathCoords;

  return (
    <article className="min-h-screen bg-[#F8FAFC] dark:bg-[#040812] text-slate-900 dark:text-slate-100 selection:bg-primary/30 transition-colors duration-300">
      {/* 1. CINEMATIC FULL-VIEWPORT HERO */}
      <TrekHero
        title={place.name}
        regionName={region.name}
        subRegionName={subRegion.name}
        stateSlug={state}
        divisionSlug={division}
        elevation={maxAltitudeVal}
        distance={distanceVal}
        duration={durationVal}
        difficulty={difficultyVal}
        heroImage={heroImage}
        isPatalsu={isPatalsu}
        breadcrumbItems={breadcrumbItems}
      />

      {/* 2. TREK OVERVIEW (Horizontal Field Instrument Bar) */}
      <TrekOverview
        elevation={maxAltitudeVal}
        distance={distanceVal}
        duration={durationVal}
        difficulty={difficultyVal}
        startPoint={startPointVal}
        bestSeason={bestSeasonVal}
        stateSlug={state}
        subRegionName={subRegion.name}
        regionName={region.name}
        isPatalsu={isPatalsu}
      />

      {/* 3. LIGHTWEIGHT CONTEXTUAL NAVIGATION DOCK */}
      <TrekContextNav stateSlug={state} />

      {/* 4. ABOUT THE TREK (Editorial Narrative) */}
      <TrekAbout
        title={place.name}
        overview={place.overview || trek?.overview || trek?.description || ""}
        routeDescription={place.routeDescription || trek?.routeDescription}
        startPoint={startPointVal}
        stateSlug={state}
        subRegionName={subRegion.name}
        isPatalsu={isPatalsu}
      />

      {/* 5. THE TRAIL: HIKER'S DISPATCH & CHRONOLOGICAL PHOTO STORY */}
      <TrekTrailStory
        title={place.name}
        images={images}
        subRegionName={subRegion.name}
        stateSlug={state}
        isPatalsu={isPatalsu}
      />

      {/* 6. ROUTE & GEOSPATIAL TRAILHEAD */}
      <TrekRouteMap
        title={place.name}
        slug={place.id}
        coords={coords}
        pathCoords={pathCoords}
        startPoint={startPointVal}
        maxAltitude={maxAltitudeVal}
        distance={distanceVal}
        regionName={region.name}
        subRegionName={subRegion.name}
        stateSlug={state}
        isPatalsu={isPatalsu}
      />

      {/* 7. ELEVATION & ALTITUDE PROFILE */}
      <TrekElevation
        title={place.name}
        itinerary={itinerary}
        maxAltitude={maxAltitudeVal}
        startPoint={startPointVal}
        stateSlug={state}
        isPatalsu={isPatalsu}
      />

      {/* 8. DAY-BY-DAY ITINERARY */}
      <TrekItinerary
        title={place.name}
        itinerary={itinerary}
        stateSlug={state}
        isPatalsu={isPatalsu}
      />

      {/* 9. UNIFIED TRAIL INFORMATION & LOGISTICS (Weather, Tips, Safety, Packing) */}
      <TrekInformation
        title={place.name}
        bestSeason={bestSeasonVal}
        coords={coords}
        subRegionName={subRegion.name}
        regionName={region.name}
        stateSlug={state}
        tips={place.tips}
        permits={trek?.permits}
        maxAltitude={maxAltitudeVal}
        packingList={packingList}
        isPatalsu={isPatalsu}
      />

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <TrekFAQ
        title={place.name}
        faqs={faqs}
        stateSlug={state}
      />

      {/* 11. EXPLORE MORE & EMOTIONAL CLOSING CALL */}
      <TrekEnding
        state={state}
        division={division}
        currentPlaceId={place.id}
        subRegionName={subRegion.name}
        stateSlug={state}
        endingImage={endingImage}
      />
    </article>
  );
}
