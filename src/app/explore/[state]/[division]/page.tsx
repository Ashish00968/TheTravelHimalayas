import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { himalayaAtlas, getRegion, getSubRegion } from "@/data/atlas";
import { DivisionClient } from "./DivisionClient";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { buildTouristDestinationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
  const seen = new Set<string>();
  const params: { state: string; division: string }[] = [];
  himalayaAtlas.forEach((region) => {
    region.subregions.forEach((sub) => {
      const key = `${region.id}/${sub.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        params.push({ state: region.id, division: sub.id });
      }
    });
  });
  if (!seen.has("uttarakhand/garhwal")) params.push({ state: "uttarakhand", division: "garhwal" });
  if (!seen.has("uttarakhand/kumaon")) params.push({ state: "uttarakhand", division: "kumaon" });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; division: string }>;
}): Promise<Metadata> {
  const { state, division } = await params;
  const region = getRegion(state);
  if (!region) return {};

  if (state === "uttarakhand" && (division === "garhwal" || division === "kumaon")) {
    const isGarhwal = division === "garhwal";
    const divName = isGarhwal ? "Garhwal" : "Kumaon";
    const districts = region.subregions.filter(
      (s) => s.division === divName && s.id !== "garhwal" && s.id !== "kumaon"
    );
    const placeCount = districts.reduce((acc, d) => acc + d.places.length, 0);

    return generatePageMetadata({
      title: `${divName} Division Treks & Districts — Uttarakhand Alpine Guide`,
      description: isGarhwal
        ? `Explore Garhwal Division across 7 districts (Chamoli, Rudraprayag, Uttarkashi, Pauri, Tehri, Dehradun, Haridwar) with ${placeCount} verified destinations, Char Dham trails, and high bugyals.`
        : `Explore Kumaon Division across 6 districts (Pithoragarh, Bageshwar, Almora, Nainital, Champawat, Udham Singh Nagar) with ${placeCount} verified destinations, Pindari and Milam glaciers, and Panchachuli peaks.`,
      path: `/explore/${state}/${division}`,
      image: region.image,
      keywords: isGarhwal
        ? [
            "Garhwal Division",
            "Garhwal treks",
            "Garhwal districts Uttarakhand",
            "Chamoli treks",
            "Rudraprayag treks",
            "Uttarkashi treks",
            "Char Dham Garhwal",
          ]
        : [
            "Kumaon Division",
            "Kumaon treks",
            "Kumaon districts Uttarakhand",
            "Pithoragarh treks",
            "Pindari glacier trek",
            "Panchachuli base camp",
            "Milam glacier",
          ],
    });
  }

  const subRegion = getSubRegion(state, division);
  if (!subRegion) return {};

  const placeNames = subRegion.places.slice(0, 5).map((p) => p.name).join(", ");

  return generatePageMetadata({
    title: `Treks & Trails in ${subRegion.name} — ${region.name} Valley Guide`,
    description:
      subRegion.tagline ||
      `Explore ${subRegion.places.length} verified treks, peaks, and alpine passes in ${subRegion.name}, ${region.name}. Featuring ${placeNames}.`,
    path: `/explore/${state}/${division}`,
    image: region.image,
    keywords: [
      `${subRegion.name} treks`,
      `${subRegion.name} trails`,
      `${subRegion.name} trekking routes`,
      `hiking in ${subRegion.name}`,
      `${region.name} expeditions`,
      ...subRegion.places.map((p) => p.name),
    ],
  });
}

export default async function DivisionPage({
  params,
}: {
  params: Promise<{ state: string; division: string }>;
}) {
  const { state, division } = await params;
  const region = getRegion(state);
  if (!region) notFound();

  // Special Division Hub for Uttarakhand (Garhwal & Kumaon)
  if (state === "uttarakhand" && (division === "garhwal" || division === "kumaon")) {
    const isGarhwal = division === "garhwal";
    const divName = isGarhwal ? "Garhwal" : "Kumaon";
    const siblingDiv = isGarhwal ? "kumaon" : "garhwal";
    const siblingName = isGarhwal ? "Kumaon" : "Garhwal";
    const districts = region.subregions.filter(
      (s) => s.division === divName && s.id !== "garhwal" && s.id !== "kumaon"
    );
    const totalDestinations = districts.reduce((acc, d) => acc + d.places.length, 0);

    const divTagline = isGarhwal
      ? "Sacred river origins of the holy Ganga and Yamuna, ancient Char Dham shrines, UNESCO Valley of Flowers, and expansive high-altitude alpine bugyals across 7 administrative districts."
      : "Legendary Pindari and Milam glaciers, dramatic Panchachuli massifs, tranquil lake districts, and ancient Katyuri stone temple enclaves across 6 administrative districts.";

    const destinationSchema = buildTouristDestinationJsonLd({
      name: `${divName} Division, ${region.name}`,
      description: divTagline,
      url: `/explore/${state}/${division}`,
      image: region.image,
      containedInPlace: `${region.name}, Indian Himalayas`,
    });

    const breadcrumbSchema = buildBreadcrumbJsonLd([
      { label: "Home", href: "/" },
      { label: "Explore", href: "/explore" },
      { label: region.name, href: `/explore/${state}` },
      { label: `${divName} Division`, href: `/explore/${state}/${division}` },
    ]);

    const accentColor = isGarhwal ? "#10B981" : "#0D9488";
    const glowColor = isGarhwal ? "rgba(16,185,129,0.2)" : "rgba(13,148,136,0.2)";

    return (
      <main className="min-h-screen pt-28 pb-20 bg-background text-foreground transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="mb-4">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Explore", href: "/explore" },
                { label: region.name, href: `/explore/${state}` },
                { label: `${divName} Division`, href: `/explore/${state}/${division}` },
              ]}
            />
          </div>

          <Link
            href={`/explore/${state}`}
            className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-8 text-[10px] font-bold uppercase tracking-[0.15em] group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to {region.name}
          </Link>

          {/* Division Header Hero */}
          <div className="mb-12 p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl glass-museum-card border border-foreground/[0.08]">
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40 dark:opacity-60"
              style={{ background: glowColor }}
            />
            <span
              className="font-mono text-xs uppercase tracking-[0.2em] block mb-3 font-bold"
              style={{ color: accentColor }}
            >
              {region.name} • Division Hub
            </span>
            <h1 className="font-display tracking-tight font-bold text-4xl sm:text-5xl md:text-6xl text-foreground mb-5 leading-tight">
              {divName} Division
            </h1>
            <p className="text-foreground/70 text-base sm:text-lg max-w-3xl font-light leading-relaxed mb-6">
              {divTagline}
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-foreground/[0.08] text-xs font-mono font-bold text-foreground/60">
              <span>{districts.length} Administrative Districts</span>
              <span>•</span>
              <span style={{ color: accentColor }}>{totalDestinations} Verified Destinations</span>
            </div>
          </div>

          {/* Featured Char Dham Yatra Grand Pilgrimage Hub (Garhwal Exclusive) */}
          {isGarhwal && (
            <div className="mb-14 p-8 md:p-10 rounded-3xl relative overflow-hidden glass-museum-card border border-emerald-500/25 bg-gradient-to-br from-emerald-950/20 via-background to-blue-950/20 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 bg-emerald-500" />
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-3xl space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      🛕 Sacred Himalayan Circuit
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      4 Shrines • 2 Itineraries
                    </span>
                  </div>

                  <h2 className="font-display tracking-tight font-bold text-2xl sm:text-3xl md:text-4xl text-foreground">
                    Garhwal Char Dham Yatra
                  </h2>

                  <p className="text-foreground/75 text-sm sm:text-base font-light leading-relaxed">
                    The cardinal pilgrimage of the Himalayas: <strong>Yamunotri</strong> (3,291m), <strong>Gangotri</strong> (3,100m), <strong>Kedarnath</strong> (3,584m), and <strong>Badrinath</strong> (3,133m). Compare the <strong>10–12 Day Commercial Agency Circuit</strong> with DHT&apos;s <strong>14–16 Day Insider Explorer Circuit</strong> featuring Dhari Devi Mandir, Kharsali, Harsil Valley, Triyuginarayan, Madhyamaheshwar link, Joshimath, Urgam Valley, Mana First Village, and Vasudhara Falls.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-foreground/50 block">Shrine 1</span>
                      <span className="text-xs font-bold text-foreground">Yamunotri (Trek)</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-foreground/50 block">Shrine 2</span>
                      <span className="text-xs font-bold text-foreground">Gangotri (Road)</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-foreground/50 block">Shrine 3</span>
                      <span className="text-xs font-bold text-foreground">Kedarnath (Trek)</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-foreground/50 block">Shrine 4</span>
                      <span className="text-xs font-bold text-foreground">Badrinath (Road)</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full lg:w-auto">
                  <Link
                    href={`/explore/${state}/${division}/char-dham`}
                    className="inline-flex items-center justify-center gap-2.5 w-full lg:w-auto px-6 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow-lg hover:shadow-emerald-500/25"
                  >
                    Open Dedicated Char Dham Place Guide &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Districts Grid */}
          <div className="space-y-6 mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-foreground/[0.08] pb-4">
              <div>
                <h2 className="font-display tracking-tight font-bold text-2xl sm:text-3xl text-foreground mb-1">
                  Districts of {divName}
                </h2>
                <p className="text-foreground/60 text-sm font-light">
                  Select a district to view its trailheads, mountain temples, and alpine trekking routes.
                </p>
              </div>
              <Link
                href={`/explore/${state}/${siblingDiv}`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors"
              >
                Switch to {siblingName} Division <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {districts.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/explore/${state}/${sub.id}`}
                  className="group relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between min-h-[250px] glass-museum-card border border-foreground/[0.08] hover:border-foreground/[0.22] shadow-lg hover:shadow-xl"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-display tracking-tight font-bold text-2xl text-foreground mb-1.5 group-hover:text-primary transition-colors">
                          {sub.name}
                        </h3>
                        <p className="text-xs font-mono font-semibold" style={{ color: accentColor }}>
                          {sub.places.length} destinations
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-foreground/[0.04] text-foreground/50 group-hover:text-foreground group-hover:bg-foreground/[0.08]">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {sub.tagline && (
                      <p className="text-foreground/65 text-sm font-light leading-relaxed mb-6 max-w-md">
                        {sub.tagline}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10 flex flex-wrap gap-2 pt-5 border-t border-foreground/[0.08]">
                    {sub.places.slice(0, 4).map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/75"
                      >
                        <span>{p.emoji}</span>
                        <span>{p.name}</span>
                      </span>
                    ))}
                    {sub.places.length > 4 && (
                      <span className="text-foreground/40 text-[11px] font-mono px-2 py-1.5">
                        +{sub.places.length - 4} more
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(destinationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
        />
      </main>
    );
  }

  // Regular district page
  const subRegion = getSubRegion(state, division);
  if (!subRegion) notFound();

  const destinationSchema = buildTouristDestinationJsonLd({
    name: `${subRegion.name}, ${region.name}`,
    description: subRegion.tagline || `Alpine trekking routes and passes in ${subRegion.name}`,
    url: `/explore/${state}/${division}`,
    image: region.image,
    containedInPlace: subRegion.division ? `${subRegion.division} Division, ${region.name}` : region.name,
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: region.name, href: `/explore/${state}` },
    ...(subRegion.division
      ? [{ label: `${subRegion.division} Division`, href: `/explore/${state}/${subRegion.division.toLowerCase()}` }]
      : []),
    { label: subRegion.name, href: `/explore/${state}/${division}` },
  ]);

  return (
    <>
      <DivisionClient
        state={state}
        division={division}
        region={region}
        subRegion={subRegion}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(destinationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
    </>
  );
}
