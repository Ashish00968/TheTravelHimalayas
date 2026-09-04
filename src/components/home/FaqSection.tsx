"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HOMEPAGE_FAQS } from "@/data/homepage-faqs";
import {
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Compass,
  Shield,
  FileText,
  Backpack,
} from "lucide-react";

const EASE = [0.23, 1, 0.32, 1] as const;

type CategoryTab = "all" | "planning" | "safety" | "permits" | "gear";

const CATEGORIES: { id: CategoryTab; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All Questions", icon: Sparkles },
  { id: "planning", label: "Seasons & Planning", icon: Compass },
  { id: "safety", label: "Safety & AMS", icon: Shield },
  { id: "permits", label: "Permits & Logistics", icon: FileText },
  { id: "gear", label: "Gear & Fitness", icon: Backpack },
];

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>(HOMEPAGE_FAQS[0].id);

  const filteredFaqs =
    activeCategory === "all"
      ? HOMEPAGE_FAQS
      : HOMEPAGE_FAQS.filter((f) => f.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 relative z-10 bg-background transition-colors duration-300 border-t border-border/40"
      aria-label="Frequently Asked Questions"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.22em] font-bold mb-3 border border-slate-200/80 dark:border-white/10">
            <HelpCircle className="w-3.5 h-3.5" />
            Himalayan Alpine Intelligence
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-foreground mb-3 tracking-tight leading-[1.08]">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/70 text-xs sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Essential meteorological, physiological, permit, and logistical intelligence curated for independent and guided Himalayan expeditions.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    // If current open faq is not in the filtered category, open first one
                    const firstInCat =
                      cat.id === "all"
                        ? HOMEPAGE_FAQS[0].id
                        : HOMEPAGE_FAQS.find((f) => f.category === cat.id)?.id;
                    if (firstInCat) setOpenFaqId(firstInCat);
                  }}
                  className={`relative px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 border ${
                    isActive
                      ? "text-white shadow-md border-primary/60"
                      : "text-foreground/70 hover:text-foreground border-border/70 hover:border-border bg-foreground/[0.02]"
                  }`}
                  style={{
                    backgroundColor: isActive ? "var(--primary, #3B82F6)" : undefined,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          <AnimatePresence initial={false}>
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaqId === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, delay: index * 0.03, ease: EASE }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-primary/50 shadow-lg shadow-primary/5 bg-card/95 dark:bg-[#0c1322]/95"
                      : "border-border/70 hover:border-border bg-card/60 dark:bg-[#090e1a]/60"
                  } backdrop-blur-xl`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 select-none group"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {faq.categoryLabel}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
                        {faq.question}
                      </h3>
                      {!isOpen && (
                        <p className="text-foreground/60 text-xs sm:text-sm font-light mt-1.5 line-clamp-1">
                          {faq.shortAnswer}
                        </p>
                      )}
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 mt-0.5 ${
                        isOpen
                          ? "bg-primary text-white border-primary rotate-180"
                          : "bg-foreground/[0.04] text-foreground/70 border-border/80 group-hover:text-foreground"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-border/40">
                          <div className="text-foreground/85 text-xs sm:text-sm leading-relaxed space-y-3 font-normal">
                            <p className="font-medium text-foreground/95 bg-primary/[0.04] p-3 rounded-xl border border-primary/15">
                              {faq.shortAnswer}
                            </p>
                            <p className="text-foreground/75 leading-relaxed font-light">
                              {faq.detailedAnswer}
                            </p>
                          </div>

                          {faq.links && faq.links.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/50">
                                Related Intel:
                              </span>
                              {faq.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline"
                                >
                                  <span>{link.label}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Dispatch Prompt */}
        <div className="mt-10 sm:mt-12 text-center p-6 rounded-2xl border border-border/60 bg-muted/20 backdrop-blur-md">
          <p className="text-xs sm:text-sm text-foreground/80 font-light mb-3">
            Have an expedition query not covered in our telemetry? Consult our clinical safety manuals or connect with regional coordinators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/safety"
              className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-wider border border-primary/30 transition-colors inline-flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Mountain Safety Manual</span>
            </Link>
            <Link
              href="/plan/season"
              className="px-4 py-2 rounded-full glass-capsule hover:bg-foreground/[0.05] text-foreground text-xs font-mono font-semibold uppercase tracking-wider border border-border transition-colors inline-flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Seasonal Matrix</span>
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full glass-capsule hover:bg-foreground/[0.05] text-foreground text-xs font-mono font-semibold uppercase tracking-wider border border-border transition-colors inline-flex items-center gap-1.5"
            >
              <span>Field Dispatch Desk &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
