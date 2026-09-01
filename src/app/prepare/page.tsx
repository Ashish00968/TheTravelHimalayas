import { Metadata } from "next";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import Link from "next/link";
import { Backpack, FileText, HeartPulse, Map as MapIcon, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Prepare for the Himalayas | The Himalayan Trails",
  description: "Comprehensive guides on fitness, gear, altitude safety, and permits for your Himalayan expedition.",
};

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
  return (
    <PageTransition>
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
              className="group bg-surface border border-white/10 hover:border-primary/50 p-8 rounded-3xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-6 relative">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <pillar.icon className="w-7 h-7 text-primary" />
                </div>
                <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300" />
              </div>
              
              <h3 className="text-2xl font-display font-semibold text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-white/60 font-light leading-relaxed mb-6">
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
