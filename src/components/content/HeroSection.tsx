"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TRANSITION_EASE = [0.23, 1, 0.32, 1] as const;

interface HeroSectionProps {
  title: string;
  image?: string;
  subtitle?: string;
}

export function HeroSection({ title, subtitle, image }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-background border-b border-white/5">
      {/* Background Image if available */}
      {image ? (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/40" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        </div>
      ) : (
        <>
          {/* Ambient background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-10 opacity-40" />
        </>
      )}

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: TRANSITION_EASE }}
          className="max-w-4xl"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-[0.25em] block mb-3">
            Himalayan Atlas &amp; Expedition Guide
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-white tracking-tight leading-[1.1]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-white/80 mt-5 leading-relaxed font-light max-w-3xl">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
