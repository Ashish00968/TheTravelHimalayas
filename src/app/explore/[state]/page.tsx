import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <main className="min-h-screen pt-28 pb-20 bg-background text-foreground transition-colors duration-300">
      {/* State Header Banner with Cinematic Landscape Background */}
      <section className="relative py-16 md:py-24 border-b border-foreground/[0.08] overflow-hidden transition-colors duration-300">
        {/* Territory Landscape Backdrop */}
        {region.image && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src={region.image}
              alt={region.name}
              fill
              priority
              className="object-cover object-center opacity-30 dark:opacity-20 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background backdrop-blur-[2px]" />
          </div>
        )}

        {/* Ambient Top Glow */}
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-40 dark:opacity-50 z-[1]"
          style={{ background: style.glow }}
        />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-8 text-xs font-bold uppercase tracking-[0.15em]"
          >
            <ArrowLeft className="w-4 h-4" /> All Territories
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="text-5xl mb-5 block drop-shadow-xl">{region.emoji}</span>
              <h1 className="font-display tracking-tight font-bold text-4xl sm:text-5xl md:text-7xl text-foreground mb-5 leading-tight">
                {region.name}
              </h1>
              <p className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                {region.cardDesc}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-foreground/10 pt-6 md:pt-0 md:pl-8">
              <div>
                <span className="text-3xl font-mono font-bold text-foreground block mb-1">
                  {region.subregions.length}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/50">
                  Valleys
                </span>
              </div>
              <div className="h-10 w-px bg-foreground/10" />
              <div>
                <span className="text-3xl font-mono font-bold block mb-1" style={{ color: style.accent }}>
                  {totalPlaces}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/50">
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
            <h2 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-foreground mb-2">
              Divisions &amp; Valleys
            </h2>
            <p className="text-foreground/60 text-base font-light">
              Select a sub-region to explore its trekking trails, peaks, and alpine passes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {region.subregions.map((sub) => (
            <Link
              key={sub.id}
              href={`/explore/${state}/${sub.id}`}
              className="group relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between min-h-[260px] glass-museum-card border border-foreground/[0.08] hover:border-foreground/[0.22] shadow-lg hover:shadow-xl"
            >
              {/* Dynamic Territory Accent Glow on Hover */}
              <div 
                className="absolute inset-0 rounded-3xl transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  border: `1px solid ${style.accent}50`,
                  boxShadow: `0 0 30px ${style.glow}`,
                }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-display tracking-tight font-bold text-2xl text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs font-mono font-semibold" style={{ color: style.accent }}>
                      {sub.places.length} destinations
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-foreground/[0.04] text-foreground/50 group-hover:text-foreground group-hover:bg-foreground/[0.08]"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {sub.tagline && (
                  <p className="text-foreground/65 text-sm font-light leading-relaxed mb-6 max-w-sm">
                    {sub.tagline}
                  </p>
                )}
              </div>

              {/* Peek at places */}
              <div className="relative z-10 flex flex-wrap gap-2 pt-5 border-t border-foreground/[0.08]">
                {sub.places.slice(0, 3).map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/75"
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </span>
                ))}
                {sub.places.length > 3 && (
                  <span className="text-foreground/40 text-[11px] font-mono px-2 py-1.5">
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
