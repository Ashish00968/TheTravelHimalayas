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
  itinerary: { day: number; title: string; description: string }[];
  packingList: string[];
  permits: string;
  faqs: { question: string; answer: string }[];
  images: string[];
  heroImage: string;
  description: string;
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
