import React from "react";
import { Metadata } from "next";
import { PageTransition } from "@/components/animation/PageTransition";
import { LegalDisclaimerView } from "@/components/legal/LegalDisclaimerView";

export const metadata: Metadata = {
  title: "Legal Disclaimer | The Himalayan Trails",
  description: "Development preview notice, imagery mismatch disclaimer, and high-altitude non-liability terms.",
};

export default function DisclaimerPage() {
  return (
    <PageTransition>
      <LegalDisclaimerView />
    </PageTransition>
  );
}
