import { Metadata } from "next";
import { PackingGeneratorClient } from "@/components/plan/PackingGeneratorClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";

export const metadata: Metadata = {
  title: "Packing List Generator | Plan Your Trip | The Himalayan Trails",
  description: "Get a customized trekking gear and packing list based on altitude, duration, and season.",
};

export default function PackingGeneratorPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Packing List Generator" 
        subtitle="Generate a personalized gear checklist for your specific trek and season."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <PackingGeneratorClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}
