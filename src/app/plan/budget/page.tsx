import { Metadata } from "next";
import { BudgetCalculatorClient } from "@/components/plan/BudgetCalculatorClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";

export const metadata: Metadata = {
  title: "Trek Budget Calculator | Plan Your Trip | The Himalayan Trails",
  description: "Estimate the total cost of your Himalayan trek including permits, guides, gear rentals, and transport.",
};

export default function TrekBudgetPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Budget Calculator" 
        subtitle="Estimate your total costs based on trekking style, group size, and gear requirements."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <BudgetCalculatorClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}
