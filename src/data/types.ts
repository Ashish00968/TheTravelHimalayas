// src/data/types.ts

export interface Trek {
  slug: string;
  title: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging";
  duration: string;
  distance: string;
  maxAltitude: string;
  bestSeason: string;
  overview: string;
  routeDescription: string;
  itinerary: { day: number; title: string; description: string; elevationMeters?: number; distanceKm?: number }[];
  packingList: string[];
  permits: string;
  faqs: { question: string; answer: string }[];
  images: string[];
  heroImage: string;
  description: string;
  // Map & pricing extensions (optional — no breaking changes to existing entries)
  coords?: [number, number]; // [latitude, longitude] of the trailhead
  pathCoords?: [number, number][]; // Array of [latitude, longitude] for route path
  startPoint?: string;       // Human-readable trailhead name
  guideRatePerDay?: number;  // INR per day for a local guide
}

export interface Peak {
  slug: string;
  title: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging";
  height: number;
  expeditionSeason: string;
  baseCamp: string;
  overview: string;
  climbingRoute: string;
  expeditionDetails: string;
  gearRequirements: string[];
  faqs: { question: string; answer: string }[];
  images: string[];
  heroImage: string;
  description: string;
  // Map extension (optional)
  coords?: [number, number]; // [latitude, longitude] of the base camp
}

export interface DayHike {
  slug: string;
  title: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
  duration: string;
  distance: string;
  overview: string;
  routeDescription: string;
  faqs: { question: string; answer: string }[];
  images: string[];
  heroImage: string;
  description: string;
}

export interface Guide {
  slug: string;
  title: string;
  category: string;
  author: string;
  description: string;
  content: string;
  featuredImage: string;
  heroImage: string;
  relatedGuides: string[];
}

export interface Region {
  slug: string;
  title: string;
  overview: string;
  travelInfo: string;
  images: string[];
  heroImage: string;
  description: string;
}

// ---------------------------------------------------------
// PHASE 1 DATA EXPANSION ENTITIES
// ---------------------------------------------------------

export interface Lake {
  id: string;
  slug: string;
  name: string;
  region: string;
  coordinates?: [number, number]; // [longitude, latitude]
  elevation?: number;
  bestTime?: string;
  nearbyTreks?: string[];
  nearbyPeaks?: string[];
  summary: string;
}

export interface Pass {
  id: string;
  slug: string;
  name: string;
  region: string;
  coordinates?: [number, number]; // [longitude, latitude]
  elevation?: number;
  bestTime?: string;
  nearbyRoutes?: string[];
  nearbyPeaks?: string[];
  summary: string;
}

export interface Village {
  id: string;
  slug: string;
  name: string;
  region: string;
  coordinates?: [number, number]; // [longitude, latitude]
  elevation?: number;
  bestTime?: string;
  nearbyAttractions?: string[];
  nearbyTreks?: string[];
  summary: string;
}

export interface Monastery {
  id: string;
  slug: string;
  name: string;
  region: string;
  coordinates?: [number, number]; // [longitude, latitude]
  elevation?: number;
  visitingInformation?: string;
  nearbyAttractions?: string[];
  summary: string;
}

export interface CampingLocation {
  id: string;
  slug: string;
  name: string;
  region: string;
  coordinates?: [number, number]; // [longitude, latitude]
  elevation?: number;
  campingType?: string;
  legalStatus?: string;
  waterAvailability?: string;
  toiletAvailability?: string;
  vehicleAccessibility?: boolean;
  winterSuitability?: boolean;
  safetyNotes?: string;
  sourceVerification?: string;
}
