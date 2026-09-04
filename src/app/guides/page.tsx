import { Metadata } from "next";
import { guides } from "@/data/guides";
import { GuidesHub } from "@/components/content/GuidesHub";

export const metadata: Metadata = {
  title: "Field Guides & Planning | Discover Himalayan Trails",
  description:
    "Comprehensive field guides covering transportation, permits, gear packing, and route planning for Himalayan expeditions.",
  alternates: { canonical: "https://discoverhimalayantrails.com/guides" },
};

export default function GuidesListingPage() {
  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12">
          <span className="font-mono text-xs text-primary uppercase tracking-[0.25em] block mb-2">
            Field Dispatches &amp; Knowledge Base
          </span>
          <h1 className="font-display tracking-tight font-semibold text-3xl sm:text-5xl md:text-6xl text-white mb-4">
            Travel &amp; Trail Guides
          </h1>
          <p className="text-white/65 text-base sm:text-lg font-light max-w-2xl">
            In-depth advice on seasons, permits, hiring local guides, high-altitude logistics, and equipment checklists.
          </p>
        </div>

        <GuidesHub guides={guides} />
      </div>
    </main>
  );
}
