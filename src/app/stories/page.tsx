import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { Compass, BookOpen, Clock, ArrowRight, Mountain, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Himalayan Stories & Field Dispatches | Discover Himalayan Trails",
  description:
    "First-hand alpine narratives, route scouting chronicles, and photographic dispatches from high passes across Himachal Pradesh, Kashmir, Ladakh, and Uttarakhand.",
  alternates: { canonical: "https://discoverhimalayantrails.com/stories" },
  openGraph: {
    title: "Himalayan Stories & Field Dispatches | Discover Himalayan Trails",
    description: "First-hand alpine narratives, route scouting chronicles, and photographic dispatches across the Indian Himalayas.",
    url: "https://discoverhimalayantrails.com/stories",
    type: "website",
  },
};

interface StoryArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  territory: string;
  territoryId: string;
  territoryColor: string;
  altitude: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  relatedHref: string;
}

const FEATURED_STORIES: StoryArticle[] = [
  {
    id: "story-1",
    title: "Crossing the Hampta: When Lush Pine Forests Give Way to the Cold Desert",
    slug: "crossing-hampta-pass-monsoon",
    excerpt:
      "A transition so abrupt it feels geological. Within four hours, the sodden meadows of Jobra dissolve into the bone-dry moonscape of Chandra Valley, Spiti.",
    territory: "Himachal Pradesh",
    territoryId: "himachal-pradesh",
    territoryColor: "#F59E0B",
    altitude: "4,270m",
    readTime: "6 min read",
    date: "August 2025",
    author: "Alpine Field Team",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=75",
    relatedHref: "/explore/himachal-pradesh/kullu/hampta-pass",
  },
  {
    id: "story-2",
    title: "The Seven Hidden Turquoise Basins: An Alpine Traverse of Kashmir",
    slug: "seven-hidden-turquoise-basins-kashmir",
    excerpt:
      "Vishansar, Kishansar, and Gadsar. Beyond the reach of motorable roads, Kashmir's glacial cirques reflect clouds at 4,000 meters in complete, untouched isolation.",
    territory: "Jammu & Kashmir",
    territoryId: "jammu-kashmir",
    territoryColor: "#3B82F6",
    altitude: "4,190m",
    readTime: "8 min read",
    date: "July 2025",
    author: "Alpine Field Team",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=75",
    relatedHref: "/explore/jammu-kashmir",
  },
  {
    id: "story-3",
    title: "Beyond the Khardung La: Solitude Across the Ancient Kingdom of Zanskar",
    slug: "solitude-across-ancient-zanskar",
    excerpt:
      "Centuries-old monasteries perched like raptors on sheer cliffs. Navigating the frozen rivers and remote gorges of high-altitude trans-Himalayan Ladakh.",
    territory: "Ladakh",
    territoryId: "ladakh",
    territoryColor: "#7C3AED",
    altitude: "5,359m",
    readTime: "9 min read",
    date: "September 2025",
    author: "Alpine Field Team",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=75",
    relatedHref: "/explore/ladakh",
  },
  {
    id: "story-4",
    title: "In the Shadow of Nanda Devi: The Sacred Sanctuaries of Garhwal",
    slug: "in-the-shadow-of-nanda-devi",
    excerpt:
      "Trekking the outer rim of India's second-highest summit. Alpine rhododendron groves give way to granite walls that scrape the stratosphere at 7,816 meters.",
    territory: "Uttarakhand",
    territoryId: "uttarakhand",
    territoryColor: "#0D9488",
    altitude: "4,750m",
    readTime: "7 min read",
    date: "June 2025",
    author: "Alpine Field Team",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=75",
    relatedHref: "/explore/uttarakhand",
  },
];

export default function StoriesPage() {
  return (
    <PageTransition>
      <HeroSection 
        title="Field Dispatches & Alpine Stories" 
        subtitle="First-hand accounts, route reconnaissance reports, and photographic chronicles across the 2,400km Indian Himalayan Arc."
      />

      <section className="py-16 bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Top Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-foreground/[0.08]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-foreground/70 font-semibold">
                Curated Regional Dispatches
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-foreground/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Field Verified Routes</span>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {FEATURED_STORIES.map((story) => (
              <article
                key={story.id}
                className="group relative rounded-3xl overflow-hidden glass-museum-card border border-foreground/[0.08] hover:border-foreground/[0.25] transition-all duration-500 shadow-xl flex flex-col justify-between"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md bg-black/60"
                      style={{ border: `1px solid ${story.territoryColor}80`, color: story.territoryColor }}
                    >
                      {story.territory}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white/80 bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-1">
                      <Mountain className="w-3 h-3 text-amber-400" />
                      {story.altitude}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono text-foreground/50 mb-3">
                      <span>{story.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {story.readTime}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                      {story.title}
                    </h2>

                    <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {story.excerpt}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-foreground/[0.08] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-foreground/50">
                      By {story.author}
                    </span>
                    <Link
                      href={story.relatedHref}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-foreground group-hover:translate-x-1 transition-all"
                    >
                      <span>Explore Trail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Discovery Banner */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl glass-capsule border border-foreground/[0.1] text-center max-w-3xl mx-auto">
            <Compass className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-display font-bold text-2xl text-foreground mb-3">
              Ready to Chart Your Own Himalayan Expedition?
            </h3>
            <p className="text-foreground/70 text-sm font-light max-w-xl mx-auto mb-6">
              Access technical trail profiles, high-resolution elevation graphs, and field safety protocols across all 4 territories.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/explore"
                className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Browse All Trails
              </Link>
              <Link
                href="/map"
                className="px-6 py-3 rounded-2xl glass-capsule hover:bg-foreground/[0.08] text-foreground font-display font-medium text-xs uppercase tracking-wider transition-all border border-foreground/[0.1]"
              >
                Launch 3D Atlas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
