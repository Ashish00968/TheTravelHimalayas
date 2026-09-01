"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight, BookOpen } from "lucide-react";
import { himalayaAtlas } from "@/data/atlas";
import { LogoSeal } from "@/components/brand/LogoSeal";

const TRANSITION_EASE = [0.23, 1, 0.32, 1] as const;

export function ContactClient() {
  return (
    <main className="relative min-h-[90vh] pt-28 pb-24 bg-background overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Header Typography with Expedition Seal Badge */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-5xl">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: TRANSITION_EASE }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-mono text-xs text-amber-300 uppercase tracking-widest">
                Official Expedition Seal • Atlas HQ
              </span>
            </motion.div>

            <motion.h1
              className="font-display tracking-tight text-4xl sm:text-5xl md:text-6xl text-white mb-5 font-semibold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: TRANSITION_EASE }}
            >
              The Himalayan Trails
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-white/70 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: TRANSITION_EASE }}
            >
              The definitive open atlas and independent field guide to high-altitude routes, pass crossings, and alpine sanctuaries across the Indian Himalayas.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: TRANSITION_EASE }}
            className="shrink-0"
          >
            <LogoSeal size={150} glow={true} />
          </motion.div>
        </div>

        {/* Direct Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Card 1: Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: TRANSITION_EASE }}
            className="p-8 rounded-3xl bg-surface hover:bg-[#121216] border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">
                Email Dispatch
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                For route verification, editorial inquiries, partnerships, and general queries.
              </p>
            </div>
            <a
              href="mailto:hello@thehimalayantrails.com"
              className="text-sm font-mono text-primary hover:underline block pt-4 border-t border-white/5"
            >
              hello@thehimalayantrails.com
            </a>
          </motion.div>

          {/* Card 2: Phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: TRANSITION_EASE }}
            className="p-8 rounded-3xl bg-surface hover:bg-[#121216] border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">
                Field Helpline
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                Direct phone support for trail conditions, weather updates, and emergency guidance.
              </p>
            </div>
            <a
              href="tel:+919876543210"
              className="text-sm font-mono text-primary hover:underline block pt-4 border-t border-white/5"
            >
              +91 98765 43210
            </a>
          </motion.div>

          {/* Card 3: Basecamp */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: TRANSITION_EASE }}
            className="p-8 rounded-3xl bg-surface hover:bg-[#121216] border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">
                Basecamp HQ
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                Mall Road, Manali &amp; Shimla<br />
                Himachal Pradesh 175131, India
              </p>
            </div>
            <span className="text-xs font-mono text-white/40 block pt-4 border-t border-white/5">
              Field Operations &amp; Scouting
            </span>
          </motion.div>
        </div>

        {/* Mission & Territory Directory */}
        <div className="p-8 md:p-12 rounded-3xl bg-surface border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest block mb-1">
                Explore The Indian Himalayas
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">
                Atlas Territories
              </h2>
            </div>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4" /> All Guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {himalayaAtlas.map((region) => (
              <Link
                key={region.id}
                href={`/explore/${region.id}`}
                className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-primary/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl block mb-3">{region.emoji}</span>
                  <h4 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors">
                    {region.name}
                  </h4>
                  <p className="text-white/50 text-xs font-light line-clamp-2">
                    {region.cardDesc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40">
                  <span>{region.subregions.length} Divisions</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
