"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { HimalayaPlace } from "@/data/atlas";

interface PlaceFAQProps {
  place: HimalayaPlace;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function PlaceFAQ({
  place,
  stateSlug,
}: PlaceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const faqs = place.faqs && place.faqs.length > 0
    ? place.faqs
    : [
        {
          question: `What is the best time to visit ${place.name}?`,
          answer: `${place.name} is ideally experienced during ${place.bestSeason || "the late spring, summer, and autumn months"}. During this window, mountain roads and local transit are dependable, and daytime temperatures remain comfortable for walking and exploration.`,
        },
        {
          question: `What altitude is ${place.name} situated at?`,
          answer: `${place.name} is located at an altitude of approximately ${place.elevation || "moderate Himalayan elevation"}. At this elevation, light acclimatization is recommended if arriving directly from low plains.`,
        },
        {
          question: `Are permits required to visit ${place.name}?`,
          answer: `Most general visitors do not require special climbing permits for ${place.name}. However, depending on territory regulations (especially in border zones or sensitive national park corridors), standard vehicle green tax passes or Inner Line Permits (ILP) may apply.`,
        },
      ];

  return (
    <section id="faqs" className="scroll-mt-24 space-y-6" aria-labelledby="place-faq-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Frequently Asked Questions
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2
            id="place-faq-heading"
            className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight mb-2"
          >
            Planning Your Visit to {place.name}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-light text-sm sm:text-base">
            Authoritative field answers concerning altitude, seasonal access, and travel logistics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 flex-shrink-0">
          <HelpCircle className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>{faqs.length} Answers</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#080e1a] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none"
              style={isOpen ? { borderColor: `${style.accent}40` } : undefined}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] min-h-[44px]"
                aria-expanded={isOpen}
              >
                <h3 className="font-display font-semibold text-base sm:text-lg text-slate-900 dark:text-white pr-4 leading-snug">
                  {faq.question}
                </h3>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-foreground/60"
                  style={isOpen ? { transform: "rotate(180deg)", color: style.accent } : undefined}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 font-light text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-white/[0.04]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
