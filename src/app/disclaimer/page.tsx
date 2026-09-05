import React from "react";
import { Metadata } from "next";
import { PageTransition } from "@/components/animation/PageTransition";
import { LegalDisclaimerView } from "@/components/legal/LegalDisclaimerView";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = generatePageMetadata({
  title: "High-Altitude Medical & Legal Disclaimer",
  description:
    "High-altitude mountain liability disclaimer, field reconnaissance terms, imagery preview notices, and wilderness risk acknowledgments.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Legal Disclaimer", href: "/disclaimer" },
  ]);

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <LegalDisclaimerView />
    </PageTransition>
  );
}
