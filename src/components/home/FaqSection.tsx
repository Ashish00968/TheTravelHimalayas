"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HOMEPAGE_FAQS } from "@/data/homepage-faqs";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
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
  { id: "all", label: "All Questions (10)", icon: Sparkles },
  { id: "planning", label: "Seasons & Planning", icon: Compass },
  { id: "safety", label: "Safety & AMS", icon: Shield },
  { id: "permits", label: "Permits & Logistics", icon: FileText },
  { id: "gear", label: "Gear & Fitness", icon: Backpack },
];

export function FaqSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

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
      className="py-10 sm:py-16 relative z-10 bg-background transition-colors duration-300 border-t border-border/40"
      aria-label="Frequently Asked Questions"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Compressed Master FAQ Card */}
        <div
          className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
            isExpanded
              ? "border-primary/50 shadow-2xl shadow-primary/10 bg-card/95 dark:bg-[#0c1322]/95"
              : "border-border/80 hover:border-primary/40 bg-card/70 dark:bg-[#090e1a]/80 hover:shadow-xl hover:shadow-primary/5"
          } backdrop-blur-xl`}
        >
          {/* Compressed Header Bar / Click Trigger */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls="faq-expansion-panel"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }
            }}
            className="w-full text-left p-4 sm:p-8 cursor-pointer select-none group flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 transition-colors duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Himalayan Alpine Intelligence • 10 Verified Topics
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                Frequently Asked Questions
              </h2>
              <p className="text-foreground/70 text-xs sm:text-sm font-light mt-1.5 leading-relaxed max-w-2xl">
                High-altitude physiology, AMS triage, seasonal weather windows, ILP permits, and cold-weather gear specs.
              </p>

              {/* Quick Topic Chips in Compressed State */}
              {!isExpanded && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-border/40">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mr-1 hidden sm:inline">
                    Topics Covered:
                  </span>
                  {[
                    "Seasons by Territory",
                    "AMS & HAPE Rules",
                    "Permits & Passes",
                    "3-Layer Gear",
                    "DIY vs Guided",
                    "Fitness Benchmarks",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="px-2.5 py-0.5 rounded-md bg-foreground/[0.04] text-foreground/70 border border-border/60 text-[11px] font-mono"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Expand / Collapse Action Trigger */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                className={`px-5 py-2.5 rounded-full font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md ${
                  isExpanded
                    ? "bg-foreground/[0.08] hover:bg-foreground/[0.14] text-foreground border border-border"
                    : "bg-primary text-white hover:bg-primary/90 shadow-primary/25 group-hover:scale-105"
                }`}
              >
                <span>{isExpanded ? "Collapse FAQs" : "Open All FAQs (10)"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Smoothly Expandable FAQ Panel */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                id="faq-expansion-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden border-t border-border/60"
              >
                <div className="p-4 sm:p-8 pt-4 sm:pt-6 space-y-6">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCategory(cat.id);
                          }}
                          className={`relative px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 border ${
                            isActive
                              ? "text-white shadow-md border-primary/60 bg-primary"
                              : "text-foreground/70 hover:text-foreground border-border/70 hover:border-border bg-foreground/[0.02]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* FAQ Accordion List */}
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {filteredFaqs.map((faq, index) => {
                        const isOpen = openFaqId === faq.id;

                        return (
                          <motion.div
                            key={faq.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, delay: index * 0.02, ease: EASE }}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                              isOpen
                                ? "border-primary/50 shadow-md shadow-primary/5 bg-background/80"
                                : "border-border/70 hover:border-border bg-foreground/[0.02] hover:bg-foreground/[0.04]"
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFaq(faq.id);
                              }}
                              className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 select-none group"
                              aria-expanded={isOpen}
                              aria-controls={`faq-answer-${faq.id}`}
                            >
                              <div className="flex-1 pr-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                    {faq.categoryLabel}
                                  </span>
                                </div>
                                <h3 className="font-display font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                                  {faq.question}
                                </h3>
                                {!isOpen && (
                                  <p className="text-foreground/60 text-xs font-light mt-1 line-clamp-1">
                                    {faq.shortAnswer}
                                  </p>
                                )}
                              </div>

                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 mt-0.5 ${
                                  isOpen
                                    ? "bg-primary text-white border-primary rotate-180"
                                    : "bg-foreground/[0.04] text-foreground/70 border-border/80 group-hover:text-foreground"
                                }`}
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
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
                                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border/40">
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
                                            onClick={(e) => e.stopPropagation()}
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

                  {/* Bottom Footer inside expanded panel */}
                  <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href="/safety"
                        className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-mono font-bold uppercase tracking-wider border border-primary/20 transition-colors inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Shield className="w-3 h-3" />
                        <span>Safety Manual</span>
                      </Link>
                      <Link
                        href="/plan/season"
                        className="px-3 py-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground text-[11px] font-mono font-semibold uppercase tracking-wider border border-border/70 transition-colors inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Compass className="w-3 h-3" />
                        <span>Seasonal Matrix</span>
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                      }}
                      className="px-4 py-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground/75 hover:text-foreground text-xs font-mono uppercase tracking-wider border border-border/80 transition-colors inline-flex items-center gap-1.5"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Compress FAQs</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
