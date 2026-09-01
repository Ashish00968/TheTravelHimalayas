import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";

export default function StoriesPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Stories" 
        subtitle="Editorial and content architecture connecting your journey to the Himalayas."
      />
    </PageTransition>
  );
}
