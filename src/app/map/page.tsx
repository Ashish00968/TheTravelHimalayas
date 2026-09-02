import { Metadata } from "next";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { MapLauncher } from "@/components/maps/MapLauncher";
import { treks } from "@/data/treks";

export const metadata: Metadata = {
  title: "Interactive 3D Map | Explore The Himalayan Trails",
  description: "Explore trailheads, peaks, and routes in the Indian Himalayas through our interactive 3D map.",
};

export default function MapPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Interactive Himalayan 3D Atlas" 
        subtitle="Explore high-altitude trailheads, mountain valleys, and expedition routes across the Indian Himalayas in 3D terrain."
      />
      
      <div className="container mx-auto px-4 lg:px-6 pb-20">
        <MapLauncher treks={treks} />
      </div>
    </PageTransition>
  );
}
