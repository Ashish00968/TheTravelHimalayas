import { notFound } from "next/navigation";
import Link from "next/link";
import { himalayaAtlas, getRegion } from "@/data/atlas";
import { ChevronRight, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return himalayaAtlas.map((r) => ({ state: r.id }));
}

export default async function StateHub({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const region = getRegion(state);

  if (!region) notFound();

  const totalPlaces = region.subregions.reduce(
    (acc, sub) => acc + sub.places.length,
    0
  );

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* State Header Banner */}
      <section className="relative py-16 md:py-24 border-b border-white/5 bg-[#0a0a0c]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-xs font-mono uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> All Regions
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-5xl mb-4 block">{region.emoji}</span>
              <h1 className="font-display tracking-tight font-semibold text-4xl sm:text-5xl md:text-6xl text-white mb-4">
                {region.name}
              </h1>
              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                {region.cardDesc}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
              <div>
                <span className="text-2xl font-mono font-semibold text-white block">
                  {region.subregions.length}
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                  Divisions
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-2xl font-mono font-semibold text-primary block">
                  {totalPlaces}
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                  Destinations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Grid */}
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display tracking-tight font-semibold text-2xl sm:text-3xl text-white">
              Divisions &amp; Valleys
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Select a sub-region to explore its trekking trails, peaks, and cultural heritage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {region.subregions.map((sub) => (
            <Link
              key={sub.id}
              href={`/explore/${state}/${sub.id}`}
              className="group relative rounded-2xl p-8 bg-surface hover:bg-[#131317] border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-display tracking-tight font-semibold text-2xl text-white mb-1 group-hover:text-primary transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-white/50 text-xs font-mono">
                      {sub.places.length} destinations
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                {sub.tagline && (
                  <p className="text-white/65 text-sm font-light leading-relaxed mb-6">
                    {sub.tagline}
                  </p>
                )}
              </div>

              {/* Peek at places */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {sub.places.slice(0, 3).map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 bg-white/[0.04] text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/5"
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </span>
                ))}
                {sub.places.length > 3 && (
                  <span className="text-white/40 text-xs px-2 py-1.5">
                    +{sub.places.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
