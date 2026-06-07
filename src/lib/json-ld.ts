import { Trek, Peak, Guide, DayHike } from "@/data/types";
import { BreadcrumbItem } from "@/lib/breadcrumbs";

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
      item: `https://thehimalayantrails.com${item.href}`,
    })),
  };
}
