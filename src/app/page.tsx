"use client";

import Link from "next/link";
import { himalayaAtlas } from "@/data/atlas";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, ArrowRight, Compass, Shield, Map, Star } from "lucide-react";

const EASE = [0.23, 1, 0.32, 1] as const;

// Per-territory design tokens
const TERRITORY_STYLE: Record<string, { accent: string; glow: string; label: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.20)",   label: "Kashmir" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.20)",  label: "Himachal" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.20)",  label: "Ladakh" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.20)",  label: "Uttarakhand" },
};

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "#040812" }}>

      {/* Ambient layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central glacier glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[160px]"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, rgba(124,58,237,0.08) 50%, transparent 75%)" }}
        />
        {/* Top alpenglow */}
        <div
          className="absolute top-0 left-0 right-0 h-[320px]"
          style={{ background: "linear-gradient(to bottom, rgba(59,130,246,0.10) 0%, transparent 100%)" }}
        />
        {/* Subtle star grid */}
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20"
      >
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
          style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.25)" }}
        >
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary/90">
            Himalayan Atlas &amp; Expedition Guide
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display leading-[1.04] tracking-tight font-bold mb-6">
          <motion.span
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            className="block text-5xl sm:text-7xl md:text-[90px] lg:text-[108px] text-gradient-hero"
          >
            Trek the
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="block text-5xl sm:text-7xl md:text-[90px] lg:text-[108px] text-gradient-blue"
          >
            Indian Himalayas
          </motion.span>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: "#94A3B8" }}
        >
          Curated routes, verified permits, and altitude intelligence across
          Jammu &amp; Kashmir, Himachal, Ladakh &amp; Uttarakhand.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.getElementById("regions")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary text-base px-8 py-4"
          >
            Discover Territories
          </button>
          <Link href="/map" className="btn-ghost text-base px-8 py-4">
            <Map className="w-4 h-4" />
            Open Atlas Map
          </Link>
        </motion.div>

        {/* Territory stat pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          {himalayaAtlas.map((region) => {
            const style = TERRITORY_STYLE[region.id] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.15)", label: region.name };
            const places = region.subregions.reduce((a, s) => a + s.places.length, 0);
            return (
              <Link
                key={region.id}
                href={`/explore/${region.id}`}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${style.accent}30`,
                  color: style.accent,
                }}
              >
                <span>{region.emoji}</span>
                <span>{style.label}</span>
                <span className="opacity-50 font-mono">{places}</span>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => document.getElementById("regions")?.scrollIntoView({ behavior: "smooth" })}
        style={{ color: "rgba(255,255,255,0.30)" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.button>
    </section>
  );
}

/* ── Territory Cards ──────────────────────────────────────────────────────── */
function Territories() {
  return (
    <section id="regions" className="py-24 scroll-mt-20 relative z-10" style={{ background: "#040812", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-16"
        >
          <span className="section-label block mb-3">Territories &amp; Landscapes</span>
          <h2 className="section-title mb-4">Choose Your Terrain</h2>
          <p className="text-white/55 max-w-xl mx-auto font-light leading-relaxed">
            Four distinct Himalayan worlds. Select a territory to explore its valleys, passes, and sanctuaries.
          </p>
        </motion.div>

        {/* Cards 2×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {himalayaAtlas.map((region, idx) => {
            const ts = TERRITORY_STYLE[region.id] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.15)", label: region.name };
            const totalPlaces = region.subregions.reduce((a, s) => a + s.places.length, 0);

            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, delay: idx * 0.1, ease: EASE }}
              >
                <Link
                  href={`/explore/${region.id}`}
                  className="group block relative p-7 rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-between transition-all duration-300"
                  style={{
                    background: "#0d1422",
                    border: `1px solid ${ts.accent}28`,
                    borderTop: `2px solid ${ts.accent}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 60px ${ts.glow}, 0 4px 40px rgba(0,0,0,0.5)`;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${ts.accent}60`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${ts.accent}28`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = "";
                  }}
                >
                  {/* Ambient top glow */}
                  <div
                    className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${ts.glow}, transparent 70%)` }}
                  />

                  <div className="relative z-10">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-5">
                      <span
                        className="text-4xl p-3 rounded-2xl"
                        style={{ background: `${ts.accent}14`, border: `1px solid ${ts.accent}25` }}
                      >
                        {region.emoji}
                      </span>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{ color: ts.accent, background: `${ts.accent}15`, border: `1px solid ${ts.accent}30` }}
                        >
                          {region.subregions.length} {region.subregions.length === 1 ? "valley" : "valleys"}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          {totalPlaces} places
                        </span>
                      </div>
                    </div>

                    {/* Name + desc */}
                    <h3
                      className="font-display text-2xl md:text-3xl font-bold mb-3 transition-colors"
                      style={{ color: "#F1F5F9" }}
                    >
                      {region.name}
                    </h3>
                    <p className="text-white/55 text-sm font-light leading-relaxed max-w-sm">
                      {region.cardDesc}
                    </p>
                  </div>

                  {/* Footer */}
                  <div
                    className="relative z-10 mt-6 pt-5 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {region.subregions.slice(0, 4).map((sub) => (
                        <span
                          key={sub.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{ color: "rgba(255,255,255,0.40)", background: "rgba(255,255,255,0.04)" }}
                        >
                          {sub.name}
                        </span>
                      ))}
                      {region.subregions.length > 4 && (
                        <span className="text-[10px] font-mono text-white/25 py-0.5">+{region.subregions.length - 4}</span>
                      )}
                    </div>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform"
                      style={{ color: ts.accent }}
                    >
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Highlights ───────────────────────────────────────────────────────────── */
const HIGHLIGHTS = [
  {
    href: "/guides",
    icon: Compass,
    color: "#F59E0B",
    title: "Verified Field Guides",
    desc: "Step-by-step trek logs, permit procedures, and logistics for Rohtang, Pin Parvati, Zanskar, and more.",
    cta: "Browse Guides",
  },
  {
    href: "/safety",
    icon: Shield,
    color: "#3B82F6",
    title: "Mountain Glossary & Safety",
    desc: "Acclimatisation protocols, AMS prevention, Himalayan terminology, and emergency contacts.",
    cta: "Read Safety Terms",
  },
  {
    href: "/map",
    icon: Map,
    color: "#0D9488",
    title: "Interactive 3D Atlas",
    desc: "Satellite terrain map with trek routes, elevation data, and valley-level geospatial exploration.",
    cta: "Open Atlas Map",
  },
];

function Highlights() {
  return (
    <section
      className="py-24 relative z-10"
      style={{ background: "#060b14", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-14">
          <span className="section-label block mb-3" style={{ color: "#F59E0B" }}>Field Essentials</span>
          <h2 className="section-title mb-4">Curated Alpine Knowledge</h2>
          <p className="text-white/50 max-w-xl mx-auto font-light">
            Everything you need for safe, independent high-altitude expeditions across North India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HIGHLIGHTS.map(({ href, icon: Icon, color, title, desc, cta }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            >
              <Link
                href={href}
                className="group flex flex-col justify-between p-7 rounded-2xl min-h-[260px] transition-all duration-300"
                style={{
                  background: "#0d1422",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 40px ${color}18, 0 4px 30px rgba(0,0,0,0.4)`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "";
                }}
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${color}14`, border: `1px solid ${color}28` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white/90 mb-2 group-hover:text-white transition-colors">
                    {title}
                  </h3>
                  <p className="text-white/50 text-sm font-light leading-relaxed">{desc}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mt-5 group-hover:translate-x-1 transition-transform"
                  style={{ color }}
                >
                  {cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="w-full" style={{ background: "#040812" }}>
      <Hero />
      <Territories />
      <Highlights />
    </div>
  );
}
