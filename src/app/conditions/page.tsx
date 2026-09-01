import { Metadata } from "next";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import Link from "next/link";
import { CloudSnow, ShieldAlert, PhoneCall, CalendarRange, ChevronRight } from "lucide-react";
import { MountainWeatherWidget } from "@/components/shared/MountainWeatherWidget";

export const metadata: Metadata = {
  title: "Conditions & Safety | The Himalayan Trails",
  description: "Real-time season conditions, mountain safety protocols, and emergency contacts for the Himalayas.",
};

const conditionsPillars = [
  {
    title: "Seasons & Weather",
    description: "Analyze the 12-month climate matrix to find the optimal window for your expedition.",
    icon: CalendarRange,
    href: "/plan/season",
    linkText: "Open Season Finder"
  },
  {
    title: "Mountain Safety (AMS)",
    description: "Protocols for Acute Mountain Sickness, acclimatization, and high-altitude health.",
    icon: ShieldAlert,
    href: "/safety",
    linkText: "Review Safety Guidelines"
  },
  {
    title: "Emergency Contacts",
    description: "Rescue numbers, regional magistrates, and local hospital information.",
    icon: PhoneCall,
    href: "/safety#emergency",
    linkText: "View Emergency Directory"
  },
  {
    title: "Snow & Trail Conditions",
    description: "Historical snowfall data, pass opening dates, and live route status reports.",
    icon: CloudSnow,
    href: "/explore",
    linkText: "Check Regions"
  }
];

export default function ConditionsPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Conditions & Safety" 
        subtitle="Weather patterns, mountain safety protocols, and emergency infrastructure."
      />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Live Weather Integration */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2">
            Live Mountain Weather
          </h2>
          <div className="w-8 h-1 bg-primary rounded-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MountainWeatherWidget coords={[32.3220, 77.1490]} locationName="Solang Valley, Kullu" />
            <MountainWeatherWidget coords={[32.2276, 78.0722]} locationName="Kaza, Spiti Valley" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {conditionsPillars.map((pillar) => (
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
