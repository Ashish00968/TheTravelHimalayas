import { Metadata } from "next";
import Link from "next/link";
import { himalayaAtlas } from "@/data/atlas";
import { ExploreDirectory, ExplorePlaceItem } from "@/components/explore/ExploreDirectory";
import { ArrowRight, Map, Mountain, Compass, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Himalayan Atlas & Expedition Directory | The Himalayan Trails",
  description:
    "Comprehensive guide to 50+ high-altitude treks, technical peaks, and alpine passes across Himachal Pradesh, Uttarakhand, Ladakh, and Jammu & Kashmir.",
  alternates: {
    canonical: "https://thehimalayantrails.com/explore",
  },
  openGraph: {
    title: "Himalayan Atlas & Expedition Directory | The Himalayan Trails",
    description:
      "Explore 50+ verified treks, technical summits, and high passes across 4 North Indian Himalayan territories.",
    url: "https://thehimalayantrails.com/explore",
    type: "website",
  },
};

const TERRITORY_STYLES: Record<string, { accent: string; glow: string; border: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.25)", border: "rgba(59,130,246,0.35)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.25)", border: "rgba(245,158,11,0.35)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.25)", border: "rgba(124,58,237,0.35)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.25)", border: "rgba(13,148,136,0.35)" },
};

export default function ExplorePage() {
  // Flatten all places across territories and valleys
  const allPlaces: ExplorePlaceItem[] = himalayaAtlas.flatMap((region) =>
    region.subregions.flatMap((sub) =>
      sub.places.map((place) => {
        const placeHero = place.heroImage || place.image || place.peakData?.heroImage || place.trekData?.heroImage;
        return {
          id: place.id,
          name: place.name,
          type: place.type,
          emoji: place.emoji,
          image: place.image,
          heroImage: placeHero,
          elevation: place.elevation,
          bestSeason: place.bestSeason,
          difficulty: place.difficulty,
          duration: place.duration,
          distance: place.distance,
          overview: place.overview || place.experience,
          regionId: region.id,
          regionName: region.name,
          subRegionId: sub.id,
          subRegionName: sub.name,
          href: `/explore/${region.id}/${sub.id}/${place.id}`,
        };
      })
    )
  );

  const totalValleys = himalayaAtlas.reduce((acc, r) => acc + r.subregions.length, 0);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://thehimalayantrails.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Explore Atlas",
        item: "https://thehimalayantrails.com/explore",
      },
    ],
  };

  return (
    <main className="min-h-screen pt-28 pb-24" style={{ background: "#040812" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Ambient Top Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.3) 0%, transparent 70%)" }}
        />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.25em]">
              Himalayan Atlas &amp; Expedition Directory
            </span>
          </div>

          <h1 className="font-display tracking-tight font-bold text-4xl sm:text-6xl md:text-7xl text-white mb-6 leading-[1.08] max-w-4xl">
            Explore the North Indian Himalayas
          </h1>

          <p className="text-white/65 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-10">
            Authoritative trail intelligence, high-altitude passes, technical summits, and verified logistics across Himachal, Uttarakhand, Ladakh, and Kashmir.
          </p>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div 
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-white/80 font-semibold">4 Alpine Territories</span>
            </div>
            <div 
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Mountain className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-white/80 font-semibold">{totalValleys} Sub-Regions &amp; Valleys</span>
            </div>
            <div 
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Sparkles className="w-4 h-4 text-[#0D9488]" />
              <span className="text-white/80 font-semibold">{allPlaces.length} Verified Routes</span>
            </div>
            <div 
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-white/80 font-semibold">100% Geospatially Mapped</span>
            </div>
          </div>
        </div>
      </section>

      {/* Territory Command Center */}
      <section className="container mx-auto px-6 max-w-7xl py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-white/40 block mb-2">
              Step 1: Choose a Territory
            </span>
            <h2 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-white">
              The Four Great Himalayan Regions
            </h2>
          </div>
          <p className="text-white/50 text-sm font-light max-w-md">
            Each territory hosts distinctive geological terrain, permit jurisdictions, seasonal weather windows, and cultural traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {himalayaAtlas.map((region) => {
            const style = TERRITORY_STYLES[region.id] ?? {
              accent: "#3B82F6",
              glow: "rgba(59,130,246,0.20)",
              border: "rgba(59,130,246,0.30)",
            };
            const regionPlacesCount = region.subregions.reduce(
              (acc, sub) => acc + sub.places.length,
              0
            );

            return (
              <Link
                key={region.id}
                href={`/explore/${region.id}`}
                className="group relative rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                style={{
                  background: "#080e1a",
                  border: `1px solid ${style.border}`,
                  borderTop: `2px solid ${style.accent}`,
                }}
              >
                {/* Ambient Top Glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-28 pointer-events-none opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${style.glow}, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <span 
                      className="text-4xl p-2.5 rounded-2xl drop-shadow-md"
                      style={{ background: `${style.accent}14`, border: `1px solid ${style.accent}25` }}
                    >
                      {region.emoji}
                    </span>
                    <div className="text-right">
                      <span 
                        className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full block"
                        style={{ color: style.accent, background: `${style.accent}15`, border: `1px solid ${style.accent}30` }}
                      >
                        {region.subregions.length} {region.subregions.length === 1 ? "valley" : "valleys"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white mb-2.5 group-hover:text-white/90 transition-colors">
                    {region.name}
                  </h3>

                  <p className="text-white/55 text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-3">
                    {region.cardDesc}
                  </p>
                </div>

                <div 
                  className="relative z-10 pt-4 flex items-center justify-between mt-auto"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-[11px] font-mono text-white/40">
                    {regionPlacesCount} destinations
                  </span>
                  <span 
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform"
                    style={{ color: style.accent }}
                  >
                    Enter Hub <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Directory Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-10 border-t border-white/6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">
              Step 2: Filter by Expedition Profile
            </span>
            <h2 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-white">
              All Trails, Peaks &amp; Alpine Passes
            </h2>
          </div>
          <p className="text-white/50 text-sm font-light max-w-md">
            Filter all 50+ Himalayan destinations in real time by category, region, terrain difficulty, or elevation.
          </p>
        </div>

        {/* Live Interactive Directory Component */}
        <ExploreDirectory places={allPlaces} />
      </section>

      {/* Geospatial & Planning Quick Launchpad */}
      <section className="container mx-auto px-6 max-w-7xl pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 3D Map Card */}
          <Link
            href="/map"
            className="group relative rounded-3xl p-8 overflow-hidden transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.15) 0%, #080e1a 70%)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                Interactive 3D Geospatial Atlas
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed max-w-md mb-6">
                Explore summits, waypoints, passes, and trailheads on high-resolution 3D satellite terrain powered by Mapbox GL.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 group-hover:translate-x-1 transition-transform">
              Launch 3D Map <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Planning Suite Card */}
          <Link
            href="/plan"
            className="group relative rounded-3xl p-8 overflow-hidden transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.15) 0%, #080e1a 70%)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                Deterministic Expedition Planner
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed max-w-md mb-6">
                Match routes to your exact fitness level, budget, group size, and seasonal conditions with deterministic calculations.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 group-hover:translate-x-1 transition-transform">
              Open Planning Suite <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
