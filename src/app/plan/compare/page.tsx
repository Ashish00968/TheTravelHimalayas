import { Metadata } from "next";
import { TrekComparisonClient } from "@/components/plan/TrekComparisonClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";

export const metadata: Metadata = {
  title: "Trek Comparison | Plan Your Trip | Discover Himalayan Trails",
  description: "Compare side-by-side stats, itineraries, and difficulties of multiple Himalayan treks.",
};

export default function TrekComparisonPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Trek Comparison" 
        subtitle="Compare side-by-side stats, altitudes, and itineraries to make the right choice."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <TrekComparisonClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}
