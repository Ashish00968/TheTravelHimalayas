"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface TrekFAQProps {
  title: string;
  faqs: FAQItem[];
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekFAQ({
  title,
  faqs,
  stateSlug,
}: TrekFAQProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set());
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  if (!faqs || faqs.length === 0) return null;

  const isAllOpen = openIndices.size === faqs.length;

  const toggleAll = () => {
    if (isAllOpen) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(faqs.map((_, i) => i)));
    }
  };

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <motion.section 
      id="faqs" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/90 dark:border-white/10"
      aria-labelledby="faq-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Common Questions
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <h2 
            id="faq-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight mb-3"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-slate-700 dark:text-slate-300 font-light text-base sm:text-lg max-w-2xl">
            Clear answers regarding distance, altitude, how to reach, opening hours, winter conditions, and permits for {title}.
          </p>
        </div>

        {/* Global Expand All / Compress All Control & Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white border border-slate-200/80 dark:border-white/10 shadow-sm cursor-pointer min-h-[40px]"
            aria-label={isAllOpen ? "Compress all FAQ answers" : "Expand all FAQ answers"}
          >
            {isAllOpen ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" style={{ color: style.accent }} />
                <span>Compress All ({faqs.length})</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: style.accent }} />
                <span>Expand All ({faqs.length})</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>{openIndices.size > 0 ? `${openIndices.size}/${faqs.length} Open` : `${faqs.length} Q&As`}</span>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-3 sm:space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndices.has(idx);
          return (
            <motion.div
              key={idx}
              whileHover={shouldReduceMotion ? undefined : { borderColor: `${style.accent}35` }}
              className="bg-white dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none"
              style={isOpen ? { borderColor: `${style.accent}40` } : undefined}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] min-h-[44px] cursor-pointer"
                aria-expanded={isOpen}
              >
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white pr-4 leading-snug">
                  {faq.question}
                </h3>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-foreground/60"
                  style={isOpen ? { transform: "rotate(180deg)", color: style.accent } : undefined}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-700 dark:text-slate-300 font-light text-sm sm:text-base leading-relaxed border-t border-slate-200/80 dark:border-white/5 pt-4">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
