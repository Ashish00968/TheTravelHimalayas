import { Trek, Peak } from "../types";

export type PlaceType = 
  | "trek" 
  | "peak" 
  | "day-hike" 
  | "spiritual" 
  | "scenic" 
  | "road" 
  | "lake" 
  | "adventure";

export interface HimalayaPlace {
  id: string;
  name: string;
  type: PlaceType;
  emoji: string;
  image?: string;
  heroImage?: string;
  coords?: [number, number];
  pathCoords?: [number, number][];
  elevation?: string;
  bestSeason?: string;
  difficulty?: string;
  duration?: string;
  distance?: string;
  overview?: string;
  routeDescription?: string;
  experience?: string;
  tips?: string[];
  itinerary?: { day: number; title: string; description: string; elevationMeters?: number; distanceKm?: number }[];
  packingList?: string[];
  faqs?: { question: string; answer: string }[];
  images?: string[];
  trekData?: Trek;
  peakData?: Peak;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface HimalayaSubRegion {
  id: string;
  name: string;
  tagline?: string;
  division?: "Garhwal" | "Kumaon";
  places: HimalayaPlace[];
}

export interface HimalayaRegion {
  id: string;
  name: string;
  emoji: string;
  cardDesc: string;
  image?: string;
  subregions: HimalayaSubRegion[];
}

export interface PlaceLocation {
  name: string;
  regionId: string;
  regionName: string;
  subRegionId: string;
  subRegionName: string;
  href: string; // `/explore/${regionId}/${subRegionId}/${placeId}`
}
