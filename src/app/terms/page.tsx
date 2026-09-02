import React from "react";
import { Metadata } from "next";
import { PageTransition } from "@/components/animation/PageTransition";
import { LegalDisclaimerView } from "@/components/legal/LegalDisclaimerView";

export const metadata: Metadata = {
  title: "Terms of Service & Legal Disclaimer | The Himalayan Trails",
  description: "Legal disclaimers, development preview notice, media rights, and liability limitations for The Himalayan Trails platform.",
};

export default function TermsPage() {
  return (
    <PageTransition>
      <LegalDisclaimerView />
    </PageTransition>
  );
}
