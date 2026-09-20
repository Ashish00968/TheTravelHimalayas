import { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";
import { HOMEPAGE_FAQS } from "@/data/homepage-faqs";
import { treks } from "@/data/treks";
import { himalayaAtlas, placeLocationIndex } from "@/data/atlas";
import {
  buildFAQJsonLd,
  buildTouristTripJsonLd,
  serializeJsonLd,
} from "@/lib/json-ld";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Discover Himalayan Trails | High-Altitude Trekking & Expedition Guides",
  description:
    "Definitive guide to 59+ verified Himalayan treks, technical peak profiles, interactive 3D terrain maps, AMS medical safety protocols, and expedition planning across Himachal Pradesh, Uttarakhand, Ladakh, and Jammu & Kashmir.",
  keywords: [
    "Himalayan treks",
    "Himalayan trekking guides",
    "Indiahikes alternative",
    "Trek The Himalayas guide",
    "best Himalayan treks",
    "Kashmir Great Lakes trek",
    "Hampta Pass trek route",
    "Beas Kund trek Manali",
    "Pin Parvati pass expedition",
    "high altitude mountain safety",
    "AMS symptoms and acclimatisation",
    "Himalayan trek packing checklist",
    "best season for Himalayan trekking",
    "Uttarakhand trekking trails",
    "Himachal Pradesh high passes",
    "Ladakh trans-Himalayan treks",
    "interactive 3D mountain map",
    "Himalayan weather radar",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Discover Himalayan Trails | High-Altitude Trekking & Expedition Guides",
    description:
      "Definitive authority platform for trekking and alpine exploration in the Indian Himalayas. 59+ mapped trails, interactive 3D terrain, real-time safety telemetry, and expedition planning instruments.",
    url: absoluteUrl("/"),
    siteName: SITE.name,
    images: [
      {
        url: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1200/v1777213099/Wallpaper.jpg",
        width: 1200,
        height: 630,
        alt: "Discover Himalayan Trails Panorama",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Himalayan Trails | High-Altitude Trekking & Expedition Guides",
    description:
      "Definitive authority platform for trekking and alpine exploration in the Indian Himalayas. 59+ mapped trails, 3D terrain, and comprehensive safety protocols.",
    images: ["https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1200/v1777213099/Wallpaper.jpg"],
  },
};

export default function HomePage() {
  // Flagship treks for TouristTrip schema markup
  const featuredTreks = treks.slice(0, 4);

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildFAQJsonLd(
        HOMEPAGE_FAQS.map((faq) => ({
          question: faq.question,
          answer: `${faq.shortAnswer} ${faq.detailedAnswer}`,
        }))
      ),
      ...featuredTreks.map((t) => buildTouristTripJsonLd(t)),
    ],
  };

  // Pre-calculate lightweight serialized territory data on server (SSG)
  // Strips 4,600+ lines of raw atlas details from the client JS bundle
  const territoriesData = himalayaAtlas.map((r) => ({
    id: r.id,
    name: r.name,
    totalPlaces: r.subregions.reduce((acc, s) => acc + s.places.length, 0),
    subregions: r.subregions.map((s) => ({
      id: s.id,
      name: s.name,
      count: s.places.length,
    })),
  }));

  // Pre-calculate lightweight trek carousel items with resolved hrefs
  const featuredTreksData = treks.map((t) => ({
    slug: t.slug,
    title: t.title,
    duration: t.duration,
    maxAltitude: t.maxAltitude,
    difficulty: t.difficulty,
    overview: t.overview,
    heroImage: t.heroImage,
    region: t.region,
    href: placeLocationIndex.get(t.slug)?.href || `/explore/himachal-pradesh/kullu/${t.slug}`,
  }));

  return (
    <>
      {/* Search Engine Machine-Readable Schema Graph (Google Rich Results & AI Overviews) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd) }}
      />
      <HomeClient
        territories={territoriesData}
        featuredTreks={featuredTreksData}
      />
    </>
  );
}

