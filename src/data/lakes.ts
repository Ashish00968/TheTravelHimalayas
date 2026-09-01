import { Lake } from "./types";

export const lakes: Lake[] = [
  {
    id: "lake-beas-kund",
    slug: "beas-kund",
    name: "Beas Kund",
    region: "Kullu-Manali",
    coordinates: [77.1380, 32.3580], // GeoJSON format: [longitude, latitude]
    elevation: 3700,
    bestTime: "May to October",
    nearbyTreks: ["beas-kund"],
    nearbyPeaks: ["friendship-peak", "shitidhar", "ladakhi"],
    summary: "The sacred glacial source of the River Beas, nestled in a high-alpine meadow surrounded by towering peaks."
  }
];
