import React from "react";
import { Metadata } from "next";
import { PageTransition } from "@/components/animation/PageTransition";
import { LegalDisclaimerView } from "@/components/legal/LegalDisclaimerView";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service & Platform Policies",
  description:
    "Terms of service, platform usage policies, intellectual property rights, and high-altitude safety conditions for Discover Himalayan Trails.",
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Terms of Service", href: "/terms" },
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
