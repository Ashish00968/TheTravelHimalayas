// src/lib/site.ts
// Single source of truth for brand, domain, contact, and social handles.
// Update values here once the production domain and social accounts are confirmed.

export const SITE = {
  /** Display name used across UI and metadata */
  name: "The Himalayan Trails",
  /** Short name for compact placements */
  shortName: "Travel Himalayas",
  /** Production origin, no trailing slash */
  url: "https://thehimalayantrails.com",
  /** Default meta description */
  description:
    "The definitive guide to trekking the Indian Himalayas. Expert route guides, peak climbs, regional travel info, and planning resources for Kullu, Manali, and beyond.",
  /** Author/byline used on guide articles */
  author: "The Himalayan Trails Team",
  /** Contact addresses */
  email: {
    hello: "hello@thehimalayantrails.com",
    photos: "photos@thehimalayantrails.com",
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
