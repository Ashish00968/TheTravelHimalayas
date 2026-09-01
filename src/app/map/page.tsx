import { Metadata } from "next";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { GlobalMap } from "@/components/maps";
import { treks } from "@/data/treks";
// Combine treks and peaks for the global map. Currently peaks data might be in a different format,
// but treks has full coords. Let's just pass treks for now.

export const metadata: Metadata = {
  title: "Interactive Map | Explore The Himalayan Trails",
  description: "Explore trailheads, peaks, and routes in the Indian Himalayas through our interactive 3D map.",
};

export default function MapPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Interactive Himalaya Map" 
        subtitle="Explore trailheads, peaks, and route start points in 3D terrain."
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-surface">
          <GlobalMap treks={treks} />
        </div>
      </div>
    </PageTransition>
  );
}
