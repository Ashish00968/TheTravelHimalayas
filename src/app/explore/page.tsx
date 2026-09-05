import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { himalayaAtlas } from "@/data/atlas";
import { ExploreDirectory, ExplorePlaceItem } from "@/components/explore/ExploreDirectory";
import { ArrowRight, Map, Mountain, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Atlas & Trail Directory — 50+ High-Altitude Treks & Summits",
  description:
    "Comprehensive directory of 50+ verified high-altitude treks, technical peaks, and alpine passes across Himachal Pradesh, Uttarakhand, Ladakh, and Jammu & Kashmir with 3D terrain maps.",
  path: "/explore",
  keywords: [
    "Himalayan atlas",
    "Himalayan trekking directory",
    "best treks Indian Himalayas",
    "Himachal Pradesh trekking routes",
    "Ladakh expeditions directory",
    "Uttarakhand high altitude treks",
    "Kashmir alpine lakes directory",
  ],
});


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

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Explore Atlas", href: "/explore" },
  ]);

  const territoriesListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Indian Himalayan Territories",
    description: "Four sovereign Himalayan adventure territories mapped in the atlas.",
    itemListElement: himalayaAtlas.map((region, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: region.name,
      url: `${SITE.url}/explore/${region.id}`,
    })),
  };

  return (
    <main className="min-h-screen pt-28 pb-24 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(territoriesListJsonLd) }}
      />


      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-foreground/[0.08]">
        {/* Ambient Top Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-primary/20"
        />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.25em] font-bold">
              Himalayan Atlas &amp; Expedition Directory
            </span>
          </div>

          <h1 className="font-display tracking-tight font-bold text-4xl sm:text-6xl md:text-7xl text-foreground mb-6 leading-[1.08] max-w-4xl">
            Explore the North Indian Himalayas
          </h1>

          <p className="text-foreground/75 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-10">
            Authoritative trail intelligence, high-altitude passes, technical summits, and verified logistics across Himachal, Uttarakhand, Ladakh, and Kashmir.
          </p>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/60 dark:bg-white/[0.03] border border-foreground/[0.08]">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-foreground/90 font-semibold">4 Alpine Territories</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/60 dark:bg-white/[0.03] border border-foreground/[0.08]">
              <Mountain className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-foreground/90 font-semibold">{totalValleys} Sub-Regions &amp; Valleys</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/60 dark:bg-white/[0.03] border border-foreground/[0.08]">
              <Sparkles className="w-4 h-4 text-[#0D9488]" />
              <span className="text-foreground/90 font-semibold">{allPlaces.length} Verified Routes</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/60 dark:bg-white/[0.03] border border-foreground/[0.08]">
              <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-foreground/90 font-semibold">100% Geospatially Mapped</span>
            </div>
          </div>
        </div>
      </section>

      {/* Territory Command Center */}
      <section className="container mx-auto px-6 max-w-7xl py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block mb-2">
              Step 1: Choose a Territory
            </span>
            <h2 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-foreground">
              The Four Great Himalayan Regions
            </h2>
          </div>
          <p className="text-foreground/70 text-sm font-light max-w-md">
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
                className="group relative rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden glass-museum-card shadow-lg"
                style={{
                  borderTop: `3px solid ${style.accent}`,
                }}
              >
                {/* Territory Landscape Backdrop */}
                {region.image && (
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <Image
                      src={region.image}
                      alt={region.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover object-center opacity-10 dark:opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-transparent" />
                  </div>
                )}

                {/* Ambient Top Glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-28 pointer-events-none opacity-30 transition-opacity duration-300 group-hover:opacity-80 z-[1]"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${style.glow}, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <span 
                      className="text-4xl p-2.5 rounded-2xl drop-shadow-md"
                      style={{ background: `${style.accent}15`, border: `1px solid ${style.accent}30` }}
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

                  <h3 className="font-display text-2xl font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors">
                    {region.name}
                  </h3>

                  <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-3">
                    {region.cardDesc}
                  </p>
                </div>

                <div 
                  className="relative z-10 pt-4 flex items-center justify-between mt-auto border-t border-foreground/[0.08]"
                >
                  <span className="text-[11px] font-mono text-foreground/50">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-10 border-t border-foreground/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block mb-2">
              Step 2: Filter by Expedition Profile
            </span>
            <h2 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-foreground">
              Master Trailhead &amp; Summit Directory
            </h2>
          </div>
          <p className="text-foreground/70 text-sm font-light max-w-md">
            Query 59 verified expeditions across the northern ranges. Filter by category, territory, and technical difficulty.
          </p>
        </div>

        {/* Interactive Master Directory with Filter Controls */}
        <ExploreDirectory places={allPlaces} />
      </section>

      {/* 3D Map Banner Launchpad */}
      <section className="container mx-auto px-6 max-w-7xl pt-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-primary/30 relative overflow-hidden glass-museum-card shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary block mb-2">
                Geospatial Cartography
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3">
                Visualize Topography in 3D WebGL
              </h3>
              <p className="text-foreground/70 text-sm font-light leading-relaxed">
                Launch our interactive satellite terrain engine to inspect ridgeline gradients, high pass corridors, and glacial watersheds across all four territories.
              </p>
            </div>
            <Link
              href="/map"
              className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shrink-0"
            >
              <Map className="w-4 h-4" />
              Launch 3D Explorer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
