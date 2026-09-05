import { Trek, Peak, Guide, DayHike } from "@/data/types";
import { BreadcrumbItem } from "@/lib/breadcrumbs";
import { SITE, absoluteUrl } from "@/lib/site";

/**
 * Serializes a JSON-LD object to a safe string.
 * Replaces < > & with unicode escapes to prevent script breakout XSS.
 */
export function serializeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/** Site-wide Organization entity. Helps Google build a brand knowledge panel. */
export function buildOrganizationJsonLd() {
  const sameAs = Object.values(SITE.social).filter((url) => url && url !== "#");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: absoluteUrl("/mountain-logo.png"),
    email: SITE.email.hello,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Site-wide WebSite entity. Enables the sitelinks search box in Google. */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export interface TouristTripOptions {
  url?: string;
  image?: string;
  coords?: [number, number];
  subRegionName?: string;
  regionName?: string;
}

/** Rich TouristTrip Schema: day-by-day itineraries, geo coordinates, provider, and difficulty */
export function buildTouristTripJsonLd(item: Trek | DayHike, options?: TouristTripOptions) {
  const isTrek = "itinerary" in item && Array.isArray(item.itinerary);
  const trek = isTrek ? (item as Trek) : null;
  const canonicalUrl = options?.url ? absoluteUrl(options.url) : `${SITE.url}/explore`;
  const heroImage = options?.image || item.heroImage || absoluteUrl(SITE.ogImage);
  const coords = options?.coords || trek?.coords;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: item.title,
    description: item.overview || item.description,
    url: canonicalUrl,
    image: heroImage,
    touristType: ["High-Altitude Trekker", "Alpine Mountaineer", "Backpacker"],
    provider: { "@id": `${SITE.url}/#organization` },
  };

  if (coords && coords.length === 2) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: coords[0],
      longitude: coords[1],
    };
  }

  if (options?.subRegionName || options?.regionName) {
    schema.spatialCoverage = [options.subRegionName, options.regionName].filter(Boolean).join(", ");
  }

  if (trek?.itinerary && trek.itinerary.length > 0) {
    schema.itinerary = {
      "@type": "ItemList",
      numberOfItems: trek.itinerary.length,
      itemListElement: trek.itinerary.map((day, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "TouristAttraction",
          name: `Day ${day.day}: ${day.title}`,
          description: day.description,
          ...(day.elevationMeters ? { elevation: `${day.elevationMeters}m` } : {}),
        },
      })),
    };
  }

  if (trek?.guideRatePerDay) {
    schema.offers = {
      "@type": "Offer",
      price: trek.guideRatePerDay,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      category: "Local Guide Service",
    };
  }

  return schema;
}

export interface MountainOptions {
  url?: string;
  image?: string;
  coords?: [number, number];
  subRegionName?: string;
  regionName?: string;
}

/** Mountain Schema for Himalayan peaks */
export function buildMountainJsonLd(peak: Peak, options?: MountainOptions) {
  const canonicalUrl = options?.url ? absoluteUrl(options.url) : `${SITE.url}/explore`;
  const heroImage = options?.image || peak.heroImage || absoluteUrl(SITE.ogImage);
  const coords = options?.coords || peak.coords;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Mountain",
    name: peak.title,
    description: peak.overview || peak.description,
    url: canonicalUrl,
    image: heroImage,
    elevation: {
      "@type": "QuantitativeValue",
      value: peak.height,
      unitCode: "MTR",
      unitText: "meters",
    },
  };

  if (coords && coords.length === 2) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: coords[0],
      longitude: coords[1],
    };
  }

  if (options?.regionName) {
    schema.containedInPlace = {
      "@type": "AdministrativeArea",
      name: options.regionName,
    };
  }

  return schema;
}

export interface PlaceAttractionOptions {
  url?: string;
  image?: string;
  coords?: [number, number];
  elevation?: string;
  subRegionName?: string;
  regionName?: string;
}

/** Schema.org TouristAttraction for non-trek/non-peak Himalayan destinations, lakes, viewpoints & passes */
export function buildPlaceAttractionJsonLd(
  place: { name: string; overview?: string; experience?: string; elevation?: string; coords?: [number, number] },
  options?: PlaceAttractionOptions
) {
  const canonicalUrl = options?.url ? absoluteUrl(options.url) : `${SITE.url}/explore`;
  const heroImage = options?.image || absoluteUrl(SITE.ogImage);
  const coords = options?.coords || place.coords;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    description: place.overview || place.experience || `${place.name} in the Indian Himalayas.`,
    url: canonicalUrl,
    image: heroImage,
    touristType: ["High-Altitude Trekker", "Himalayan Explorer", "Alpine Backpacker"],
    provider: { "@id": `${SITE.url}/#organization` },
  };

  if (coords && coords.length === 2) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: coords[0],
      longitude: coords[1],
    };
  }

  const elevationVal = options?.elevation || place.elevation;
  if (elevationVal) {
    schema.elevation = elevationVal;
  }

  if (options?.subRegionName || options?.regionName) {
    schema.containedInPlace = {
      "@type": "AdministrativeArea",
      name: [options.subRegionName, options.regionName].filter(Boolean).join(", "),
    };
  }

  return schema;
}

/** Article Schema for Field Guides & Dispatches */
export function buildArticleJsonLd(guide: Guide & { datePublished?: string; dateModified?: string }) {
  const publishedDate = guide.datePublished || "2025-06-01T08:00:00+05:30";
  const modifiedDate = guide.dateModified || publishedDate;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: absoluteUrl(`/guides/${guide.slug}`),
    image: guide.heroImage || guide.featuredImage || absoluteUrl(SITE.ogImage),
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: guide.author || "Discover Himalayan Trails Editorial Team",
    },
    publisher: {
      "@id": `${SITE.url}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/guides/${guide.slug}`),
    },
  };
}

/** WebApplication Schema for Planning Suite Tools */
export interface WebApplicationParams {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  featureList?: string[];
}

export function buildWebApplicationJsonLd(params: WebApplicationParams) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.url),
    applicationCategory: params.applicationCategory || "TravelApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires modern web browser.",
    provider: { "@id": `${SITE.url}/#organization` },
    ...(params.featureList ? { featureList: params.featureList } : {}),
  };
}

/** MedicalWebPage Schema for Mountain Safety Hub */
export function buildMedicalWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "High-Altitude Mountain Medicine & Safety Manual",
    description:
      "Clinical guidelines for Acute Mountain Sickness (AMS), High-Altitude Pulmonary Edema (HAPE), High-Altitude Cerebral Edema (HACE), Diamox dosage, and acclimatization protocols in the Indian Himalayas.",
    url: absoluteUrl("/safety"),
    author: { "@id": `${SITE.url}/#organization` },
    publisher: { "@id": `${SITE.url}/#organization` },
    about: [
      { "@type": "MedicalCondition", name: "Acute Mountain Sickness (AMS)" },
      { "@type": "MedicalCondition", name: "High-Altitude Pulmonary Edema (HAPE)" },
      { "@type": "MedicalCondition", name: "High-Altitude Cerebral Edema (HACE)" },
      { "@type": "MedicalCondition", name: "Hypothermia and Cold Injury" },
    ],
  };
}

/** TouristDestination Schema for Territories & Valley Hubs */
export interface TouristDestinationParams {
  name: string;
  description: string;
  url: string;
  image?: string;
  containedInPlace?: string;
  touristType?: string[];
}

export function buildTouristDestinationJsonLd(params: TouristDestinationParams) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.url),
    image: params.image || absoluteUrl(SITE.ogImage),
    touristType: params.touristType || ["Trekkers", "Mountaineers", "Adventure Travelers"],
    provider: { "@id": `${SITE.url}/#organization` },
    ...(params.containedInPlace
      ? {
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: params.containedInPlace,
          },
        }
      : {}),
  };
}

export function buildFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}
