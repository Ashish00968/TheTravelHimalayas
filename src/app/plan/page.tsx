import { Metadata } from "next";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import Link from "next/link";
import { Compass, Map, Calculator, Package, CloudLightning } from "lucide-react";

export const metadata: Metadata = {
  title: "Expedition Planning Suite | Discover Himalayan Trails",
  description:
    "Professional deterministic tools for Himalayan trekking: Trek Finder, Comparison Matrix, Budget Calculator, Packing List Generator, and Seasonal Matrix.",
  alternates: { canonical: "https://discoverhimalayantrails.com/plan" },
  openGraph: {
    title: "Expedition Planning Suite | Discover Himalayan Trails",
    description: "Match, compare, budget, and prepare for your next Himalayan expedition with precision planning tools.",
    url: "https://discoverhimalayantrails.com/plan",
    type: "website",
  },
};

export default function PlanPage() {
  const tools = [
    {
      title: "Trek Finder",
      description: "Match with the perfect Himalayan trail based on your experience, fitness, and budget.",
      icon: Compass,
      href: "/plan/trek-finder",
      status: "Live",
    },
    {
      title: "Trek Comparison",
      description: "Compare side-by-side stats, itineraries, and costs of multiple treks.",
      icon: Map,
      href: "/plan/compare",
      status: "Live",
    },
    {
      title: "Budget Calculator",
      description: "Estimate total costs including permits, guides, and gear rentals.",
      icon: Calculator,
      href: "/plan/budget",
      status: "Live",
    },
    {
      title: "Packing List Generator",
      description: "Get a customized gear list based on season, altitude, and duration.",
      icon: Package,
      href: "/plan/packing",
      status: "Live",
    },
    {
      title: "Season Finder",
      description: "Discover the best treks and typical weather conditions for any month of the year.",
      icon: CloudLightning,
      href: "/plan/season",
      status: "Live",
    },
  ];

  return (
    <PageTransition>
      <HeroSection 
        title="Plan Your Expedition" 
        subtitle="Professional tools to discover, compare, and prepare for your next Himalayan adventure."
      />
      
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.title} 
              href={tool.status === "Live" ? tool.href : "#"}
              className={`block glass-museum-card p-8 transition-all duration-300 ${
                tool.status === "Live" ? "hover:border-primary/50" : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${tool.status === "Live" ? "bg-primary/10 text-primary" : "bg-foreground/[0.05] text-foreground/40"}`}>
                  <tool.icon className="w-8 h-8" />
                </div>
                <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider border font-bold ${
                  tool.status === "Live" 
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" 
                    : "bg-foreground/[0.05] text-foreground/40 border-foreground/10"
                }`}>
                  {tool.status}
                </span>
              </div>
              
              <h3 className="text-2xl font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-foreground/70 font-light leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
