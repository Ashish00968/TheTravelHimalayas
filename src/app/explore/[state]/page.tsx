import { notFound } from "next/navigation";
import Link from "next/link";
import { himalayaAtlas, getRegion } from "@/data/atlas";
import { ChevronRight, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return himalayaAtlas.map((r) => ({ state: r.id }));
}

const TERRITORY_STYLE: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.20)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.20)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.20)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.20)" },
};

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

  const style = TERRITORY_STYLE[region.id] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.15)" };

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: "#040812" }}>
      {/* State Header Banner */}
      <section className="relative py-16 md:py-24" style={{ background: "#080e1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Ambient Top Glow */}
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-50"
          style={{ background: style.glow }}
        />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-[0.15em]"
          >
            <ArrowLeft className="w-4 h-4" /> All Territories
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="text-5xl mb-5 block drop-shadow-xl">{region.emoji}</span>
              <h1 className="font-display tracking-tight font-bold text-4xl sm:text-5xl md:text-7xl text-white mb-5 leading-tight">
                {region.name}
              </h1>
              <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                {region.cardDesc}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
              <div>
                <span className="text-3xl font-mono font-bold text-white block mb-1">
                  {region.subregions.length}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
                  Valleys
                </span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <span className="text-3xl font-mono font-bold block mb-1" style={{ color: style.accent }}>
                  {totalPlaces}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
                  Places
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Grid */}
      <div className="container mx-auto px-6 max-w-7xl py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-white mb-2">
              Divisions &amp; Valleys
            </h2>
            <p className="text-white/50 text-base font-light">
              Select a sub-region to explore its trekking trails, peaks, and alpine passes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {region.subregions.map((sub) => (
            <Link
              key={sub.id}
              href={`/explore/${state}/${sub.id}`}
              className="group relative rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between min-h-[260px]"
              style={{
                background: "#0d1422",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Hover styling handled via inline style injected dynamically by a technique or standard CSS in globals, but React allows us to use standard hover classes paired with dynamic colors if needed. We'll use a clean approach. */}
              {/* To cleanly handle dynamic hover borders/shadows in React without complex styled-components, we can use a wrapper or just rely on CSS variables. Here, we'll set CSS vars inline. */}
              <div 
                className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  border: `1px solid ${style.accent}50`,
                  boxShadow: `0 0 40px ${style.glow}, inset 0 0 20px ${style.glow}`,
                }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-display tracking-tight font-bold text-2xl text-white/90 mb-1.5 group-hover:text-white transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs font-mono font-semibold" style={{ color: style.accent }}>
                      {sub.places.length} destinations
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}
                  >
                    <ChevronRight className="w-5 h-5 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {sub.tagline && (
                  <p className="text-white/55 text-sm font-light leading-relaxed mb-6 max-w-sm">
                    {sub.tagline}
                  </p>
                )}
              </div>

              {/* Peek at places */}
              <div className="relative z-10 flex flex-wrap gap-2 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {sub.places.slice(0, 3).map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </span>
                ))}
                {sub.places.length > 3 && (
                  <span className="text-white/30 text-[11px] font-mono px-2 py-1.5">
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
