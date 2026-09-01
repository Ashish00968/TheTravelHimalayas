"use client";

import Link from "next/link";
import { himalayaAtlas } from "@/data/atlas";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, ArrowRight, Compass, Shield, MapPin } from "lucide-react";

const TRANSITION_EASE = [0.23, 1, 0.32, 1] as const;

function ParallaxHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={ref} className="relative min-h-[calc(100vh-5rem)] py-16 sm:py-24 flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Ambient Background with Deep Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-50" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: TRANSITION_EASE }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs text-amber-300 uppercase tracking-widest">
            The Himalayan Atlas &amp; Trails
          </span>
        </motion.div>

        <h1 className="font-display tracking-tight text-5xl sm:text-6xl md:text-[76px] lg:text-[88px] font-semibold leading-[1.05] text-white">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: TRANSITION_EASE }}
            className="block"
          >
            Pahadi Trails &amp;
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: TRANSITION_EASE }}
            className="bg-gradient-to-r from-white via-white/90 to-amber-200/80 bg-clip-text text-transparent block"
          >
            Mountain Passes.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: TRANSITION_EASE }}
          className="font-sans text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Curated guides, verified high-altitude routes, and regional itineraries across Jammu &amp; Kashmir, Himachal Pradesh, Ladakh, and Uttarakhand.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: TRANSITION_EASE }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <button
            onClick={() => {
              const el = document.getElementById("regions");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-primary"
          >
            Discover the Regions
          </button>
          <Link
            href="/guides"
            className="btn-ghost"
          >
            Read Field Guides
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/50 cursor-pointer hover:text-amber-300 transition-colors"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => {
          const el = document.getElementById("regions");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 opacity-75" />
      </motion.div>
    </section>
  );
}

function DiscoverRegions() {
  return (
    <section id="regions" className="py-24 bg-background relative z-10 border-t border-white/5 scroll-mt-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: TRANSITION_EASE }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-[0.25em] block mb-2">
            Territories &amp; Landscapes
          </span>
          <h2 className="font-display tracking-tight font-semibold text-3xl sm:text-5xl md:text-6xl text-white mb-4">
            Discover the Regions
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg font-light">
            Select a Himalayan territory to explore its valleys, divisions, alpine passes, and mountain sanctuaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {himalayaAtlas.map((region, idx) => {
            const totalPlaces = region.subregions.reduce((acc, sub) => acc + sub.places.length, 0);

            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: TRANSITION_EASE }}
              >
                <Link
                  href={`/explore/${region.id}`}
                  className="group block relative p-8 md:p-10 glass-card flex flex-col justify-between min-h-[340px]"
                >
                  {/* Subtle Top Gradient Accent */}
                  <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10 block">
                        {region.emoji}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="glass-pill px-3 py-1.5">
                          {region.subregions.length} {region.subregions.length === 1 ? "Division" : "Divisions"}
                        </span>
                        <span className="glass-pill px-3 py-1.5 text-primary">
                          {totalPlaces} Trails &amp; Spots
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display tracking-tight font-semibold text-2xl md:text-3xl text-white mb-3 group-hover:text-primary transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-white/65 text-base font-light leading-relaxed max-w-lg">
                      {region.cardDesc}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-6">
                    <div className="flex flex-wrap gap-2">
                      {region.subregions.map((sub) => (
                        <span
                          key={sub.id}
                          className="text-xs text-white/50 bg-white/[0.03] px-2.5 py-1 rounded-md"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary font-medium group-hover:translate-x-1 transition-transform">
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

function HighlightsSection() {
  return (
    <section className="py-24 bg-[#07090e] border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-[0.25em] block mb-2">
            Field Essentials
          </span>
          <h2 className="font-display tracking-tight font-semibold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            Curated High-Altitude Knowledge
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base font-light">
            Everything you need for safe, independent alpine expeditions across the North Indian Himalaya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/guides"
            className="group p-8 glass-card flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20 mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Verified Field Guides
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Step-by-step trek logs, permit procedures, and logistics for Rohtang, Pin Parvati, and Zanskar routes.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 font-medium mt-6 group-hover:translate-x-1 transition-transform">
              Browse Guides →
            </span>
          </Link>

          <Link
            href="/safety"
            className="group p-8 glass-card flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                Mountain Glossary &amp; Safety
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Acclimatization protocols, Himalayan glossary, altitude sickness prevention, and weather readiness.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-primary font-medium mt-6 group-hover:translate-x-1 transition-transform">
              Read Safety Terms →
            </span>
          </Link>

          <Link
            href="/contact"
            className="group p-8 glass-card flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/20 mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Basecamp &amp; Dispatch
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Direct helpline for route scouting, partnership inquiries, and local field support across Shimla and Manali.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-medium mt-6 group-hover:translate-x-1 transition-transform">
              Contact Basecamp →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="w-full bg-background">
      <ParallaxHero />
      <DiscoverRegions />
      <HighlightsSection />
    </div>
  );
}
