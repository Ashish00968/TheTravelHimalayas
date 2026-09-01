// src/data/destinations.ts

export interface Destination {
  /** Display name, e.g. "Kullu" */
  name: string;
  /** Short label under the name, e.g. "Himachal Pradesh" */
  location: string;
  /** One-line pitch shown on the card */
  tagline: string;
  /** Longer supporting description */
  description: string;
  /** Hero/cover image URL (optional) */
  image?: string;
  /** Where "Explore" links to */
  href: string;
  /** false → renders as a non-clickable "Coming soon" card */
  available: boolean;
}

export const destinations: Destination[] = [
  {
    name: "Kullu",
    location: "Himachal Pradesh",
    tagline: "The adventure capital of the Indian Himalayas.",
    description:
      "World-class treks, towering peaks, and scenic valleys along the Beas River — from Solang and Sethan to the high passes above Manali.",
    image: "",
    href: "/explore/himachal-pradesh/kullu",
    available: true,
  },
];
