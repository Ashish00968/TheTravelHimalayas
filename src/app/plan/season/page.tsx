import { Metadata } from "next";
import { SeasonFinderClient } from "@/components/plan/SeasonFinderClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";

export const metadata: Metadata = {
  title: "Season Finder | Plan Your Trip | Discover Himalayan Trails",
  description: "Discover the best Himalayan treks and expected conditions for every month of the year.",
};

export default function SeasonFinderPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Season Finder" 
        subtitle="Explore Himalayan conditions and find the perfect trek for your travel dates."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <SeasonFinderClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}
