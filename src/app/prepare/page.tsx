import { Metadata } from "next";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import Link from "next/link";
import { Backpack, FileText, HeartPulse, Map as MapIcon, ChevronRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Expedition Preparation — Fitness, Gear, Permits & Training",
  description:
    "Master your Himalayan expedition preparation. Comprehensive training regimens, sub-zero packing lists, inner line permits, and alpine safety protocols.",
  path: "/prepare",
  keywords: [
    "Himalayan trek preparation",
    "trekking fitness training",
    "Himalayan gear checklist",
    "inner line permits India",
    "how to prepare for high altitude trek",
  ],
});


const preparationPillars = [
  {
    title: "Gear & Packing",
    description: "Dynamic packing lists based on season, altitude, and duration of your trek.",
    icon: Backpack,
    href: "/plan/packing",
    linkText: "Open Packing Generator"
  },
  {
    title: "Permits & Administration",
    description: "Up-to-date information on inner line permits, forest fees, and expedition royalty fees.",
    icon: FileText,
    href: "/guides/trekking-permits-himachal",
    linkText: "Read Permit Guide"
  },
  {
    title: "Fitness & Training",
    description: "Physical conditioning protocols for high-altitude trekking and technical climbing.",
    icon: HeartPulse,
    href: "/guides",
    linkText: "View Training Guides"
  },
  {
    title: "Navigation & Topography",
    description: "Understanding Himalayan terrain, reading topographical maps, and trail finding.",
    icon: MapIcon,
    href: "/map",
    linkText: "Explore 3D Map"
  }
];

export default function PreparePage() {
  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Prepare", href: "/prepare" },
  ]);

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <HeroSection 
        title="Prepare" 
        subtitle="Fitness, gear, administration, and navigation protocols for the high Himalayas."
      />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {preparationPillars.map((pillar) => (
            <Link 
              key={pillar.title} 
              href={pillar.href}
              className="group bg-card border border-border hover:border-primary/50 p-8 rounded-3xl transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-6 relative">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <pillar.icon className="w-7 h-7 text-primary" />
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground/40 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300" />
              </div>
              
              <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">
                {pillar.description}
              </p>
              
              <span className="text-xs font-mono tracking-widest uppercase text-primary font-medium">
                {pillar.linkText}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
