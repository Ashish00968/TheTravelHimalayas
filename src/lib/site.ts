// src/lib/site.ts
// Single source of truth for brand, domain, contact, and social handles.
// Update values here once the production domain and social accounts are confirmed.

export const SITE = {
  /** Display name used across UI and metadata */
  name: "Discover Himalayan Trails",
  /** Short name for compact placements */
  shortName: "Discover Himalayas",
  /** Production origin, no trailing slash */
  url: "https://discoverhimalayantrails.com",
  /** Default meta description */
  description:
    "The authoritative guide and geospatial atlas for trekking, peak expeditions, and alpine exploration across the Indian Himalayas: Himachal Pradesh, Jammu & Kashmir, Ladakh, and Uttarakhand. Verified trails, interactive 3D terrain maps, and high-altitude safety protocols.",
  /** Author/byline used on guide articles */
  author: "Discover Himalayan Trails Team",
  /** Contact addresses */
  email: {
    hello: "hello@discoverhimalayantrails.com",
    photos: "photos@discoverhimalayantrails.com",
  },
  /** Social profiles. Replace # with real URLs once accounts are created. */
  social: {
    instagram: "#",
    youtube: "#",
    twitter: "#",
  },
  /** Default Open Graph image (1200x630) served from /public */
  ogImage: "/og-default.jpg",
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = ""): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
