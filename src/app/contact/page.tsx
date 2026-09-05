import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = generatePageMetadata({
  title: "About & Basecamp Operations — Discover Himalayan Trails",
  description:
    "Learn about Discover Himalayan Trails, our field reconnaissance operations, high-altitude safety standards, and direct contact dispatch.",
  path: "/contact",
  keywords: [
    "Discover Himalayan Trails contact",
    "Himalayan trekking basecamp",
    "alpine expedition support India",
    "about Discover Himalayan Trails",
  ],
});

export default function ContactPage() {
  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "About & Contact", href: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <ContactClient />
    </>
  );
}

