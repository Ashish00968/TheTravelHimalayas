import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";

export default function ExplorePage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Explore" 
        subtitle="Discover destinations, treks, peaks, and more. This section is currently being updated for Phase 1."
      />
    </PageTransition>
  );
}
