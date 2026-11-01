"use client";

import React, { useState } from "react";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";
import { getRouteData } from "@/data/routes";
import { TrekHero } from "./TrekHero";
import { TrekOverview } from "./TrekOverview";
import { TrekContextNav } from "./TrekContextNav";
import { TrekAbout } from "./TrekAbout";
import { TrekTrailStory } from "./TrekTrailStory";
import { TrekRouteMap } from "./TrekRouteMap";
import { TrekElevation } from "./TrekElevation";
import { TrekItinerary } from "./TrekItinerary";
import { TrekLogistics } from "./TrekLogistics";
import { TrekInformation } from "./TrekInformation";
import { TrekFAQ } from "./TrekFAQ";
import { TrekEnding } from "./TrekEnding";
import { AlpineFieldDossierModal } from "./AlpineFieldDossierModal";
import { generateTrekFaqs } from "@/lib/faq-generator";

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
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const trek = place.trekData;
  const isPatalsu = place.id === "patalsu-peak";
  const isJogni = place.id === "jogni-falls";
  const isBeasKund = place.id === "beas-kund";
  const routeData = getRouteData(place.id);
  const isRouteVerified = Boolean(routeData?.verified);

  // Best available authentic photography (strictly no repeating territory fallback)
  const heroImage = isPatalsu
    ? "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/10abovetheTreelineViewOfDhauladharRanges.jpg"
    : isJogni
    ? "https://res.cloudinary.com/dehriwm1o/image/upload/v1791356859/7MajesticViewofJogniFalls.jpg"
    : (place.heroImage || trek?.heroImage || (place.images && place.images.length > 0 ? place.images[0] : undefined));

  const endingImage = isPatalsu
    ? "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/15SunsetHanumanTibba.jpg"
    : isJogni
    ? "https://res.cloudinary.com/dehriwm1o/image/upload/v1791356859/13ViewOfSnowCappedMountains.jpg"
    : (place.images && place.images.length > 1 ? place.images[1] : undefined);

  const maxAltitudeVal = place.elevation || trek?.maxAltitude || (isPatalsu ? "4,261 m" : isJogni ? "2,280 m" : "Alpine Zone");
  const durationVal = place.duration || trek?.duration || (isPatalsu ? "2–3 Days or 1-Day Push" : isJogni ? "Half Day (2–3 Hours)" : "Multi-Day");
  const distanceVal = place.distance || trek?.distance || (isPatalsu ? "16 km Loop" : isJogni ? "3.2 km round-trip" : "Mountain Trail");
  const difficultyVal = place.difficulty || trek?.difficulty || (isJogni ? "Easy" : "Moderate");
  const startPointVal = place.trailhead || trek?.trailhead || trek?.startPoint || (isPatalsu ? "Solang Village (2,480m)" : isJogni ? "Vashisht Village (2,050m)" : undefined);
  const endPointVal = place.itinerary && place.itinerary.length > 0 ? place.itinerary[place.itinerary.length - 1].title : (place.elevation ? `${place.name} (${place.elevation})` : place.name);
  const bestSeasonVal = place.bestSeason || trek?.bestSeason || (isJogni ? "March to November" : "May to October");
  const itinerary = trek?.itinerary || place.itinerary || [];
  const faqs = generateTrekFaqs(place, subRegion.name, region.name);
  const packingList = trek?.packingList || place.packingList || [];
  const images = place.images || trek?.images || [];
  const coords = place.coords || trek?.coords;
  const pathCoords = trek?.pathCoords;

  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300">
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
        placeId={place.id}
        elevation={maxAltitudeVal}
        distance={distanceVal}
        duration={durationVal}
        difficulty={difficultyVal}
        startPoint={startPointVal || (subRegion.name ? `${subRegion.name} Gateway` : "Regional Trailhead")}
        bestSeason={bestSeasonVal}
        stateSlug={state}
        subRegionName={subRegion.name}
        regionName={region.name}
        isPatalsu={isPatalsu}
        isRouteVerified={isRouteVerified}
        fieldVerified={Boolean(place.fieldVerified || trek?.fieldVerified)}
        lastVerified={place.lastVerified || trek?.lastVerified}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* 3. LIGHTWEIGHT CONTEXTUAL NAVIGATION DOCK */}
      <TrekContextNav
        stateSlug={state}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* 4. ABOUT THE TREK (Editorial Narrative) */}
      <TrekAbout
        title={place.name}
        overview={place.overview || trek?.overview || trek?.description || ""}
        routeDescription={place.routeDescription || trek?.routeDescription}
        startPoint={startPointVal || "Regional Trailhead"}
        stateSlug={state}
        subRegionName={subRegion.name}
        isPatalsu={isPatalsu}
        isJogni={isJogni}
        isBeasKund={isBeasKund}
        isRouteVerified={isRouteVerified}
        aboutCards={place.aboutCards}
        breadcrumbItems={breadcrumbItems}
      />

      {/* 5. THE TRAIL: HIKER'S DISPATCH & CHRONOLOGICAL PHOTO STORY */}
      <TrekTrailStory
        title={place.name}
        images={images}
        subRegionName={subRegion.name}
        stateSlug={state}
        isPatalsu={isPatalsu}
        isJogni={isJogni}
      />

      {/* 6. ROUTE & GEOSPATIAL TRAILHEAD */}
      <TrekRouteMap
        title={place.name}
        slug={place.id}
        coords={coords}
        pathCoords={pathCoords}
        startPoint={startPointVal || "Trailhead Entry"}
        maxAltitude={maxAltitudeVal}
        distance={distanceVal}
        regionName={region.name}
        subRegionName={subRegion.name}
        stateSlug={state}
        isPatalsu={isPatalsu}
        isJogni={isJogni}
        bestSeason={bestSeasonVal}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* 7. ELEVATION & ALTITUDE PROFILE */}
      <TrekElevation
        title={place.name}
        slug={place.id}
        itinerary={itinerary}
        maxAltitude={maxAltitudeVal}
        startPoint={startPointVal || "Regional Gateway"}
        stateSlug={state}
        isPatalsu={isPatalsu}
      />

      {/* 8. DAY-BY-DAY ITINERARY */}
      <TrekItinerary
        title={place.name}
        itinerary={itinerary}
        stateSlug={state}
        isPatalsu={isPatalsu}
        startPoint={startPointVal}
        endPoint={endPointVal}
      />

      {/* 8.5 OPTIONAL FIELD LOGISTICS & APPROACH (Zero-box Gated) */}
      <TrekLogistics
        place={place}
        stateSlug={state}
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

      {/* 12. 1-CLICK PRINTABLE ALPINE FIELD DOSSIER MODAL & PRINT PORTAL */}
      <AlpineFieldDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        title={place.name}
        slug={place.id}
        coords={coords}
        startPoint={startPointVal}
        maxAltitude={maxAltitudeVal}
        distance={distanceVal}
        duration={durationVal}
        difficulty={difficultyVal}
        stateSlug={state}
        regionName={region.name}
        subRegionName={subRegion.name}
        bestSeason={bestSeasonVal}
        itinerary={itinerary}
        packingList={packingList}
        isPatalsu={isPatalsu}
      />
    </article>
  );
}
