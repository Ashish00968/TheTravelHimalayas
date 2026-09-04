import { Metadata } from "next";
import { TrekFinderClient } from "@/components/plan/TrekFinderClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";

export const metadata: Metadata = {
  title: "Trek Finder | Plan Your Trip | Discover Himalayan Trails",
  description: "Find the perfect Himalayan trek based on your experience, fitness, season, and budget.",
};

export default function TrekFinderPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Trek Finder" 
        subtitle="Match with the perfect Himalayan trail based on your preferences."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <TrekFinderClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}
