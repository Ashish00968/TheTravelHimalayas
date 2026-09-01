import { Trek, Peak, Guide, DayHike } from "@/data/types";
import { BreadcrumbItem } from "@/lib/breadcrumbs";
import { absoluteUrl } from "@/lib/site";
import { SITE } from "@/lib/site";

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
    logo: absoluteUrl("/icon.png"),
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

export function buildTouristTripJsonLd(item: Trek | DayHike) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: item.title,
    description: item.overview,
    touristType: "Adventure",
  };
}

export function buildMountainJsonLd(peak: Peak) {
  return {
    "@context": "https://schema.org",
    "@type": "Mountain",
    name: peak.title,
    description: peak.overview,
    elevation: { "@type": "QuantitativeValue", value: peak.height, unitCode: "MTR" },
  };
}

export function buildArticleJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    author: { "@type": "Person", name: guide.author },
    description: guide.description,
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
