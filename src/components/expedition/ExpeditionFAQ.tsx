"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Peak } from "@/data/types";

interface ExpeditionFAQProps {
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionFAQ({
  peak,
  stateSlug,
}: ExpeditionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const faqs = peak.faqs && peak.faqs.length > 0
    ? peak.faqs
    : [
        {
          question: `What mountaineering experience is required for ${peak.title}?`,
          answer: `Climbers attempting ${peak.title} (${peak.height}m) must possess prior experience on glaciated peaks above 4,500m. Proficiency in crampon footwork, ice axe arrest, and roped glacier rescue techniques is mandatory.`,
        },
        {
          question: `What are the best climbing windows for ${peak.title}?`,
          answer: `Optimal climbing conditions occur during ${peak.expeditionSeason || "pre-monsoon (May–June) and post-monsoon (September–October)"}. Pre-monsoon offers more continuous snow cover on glacial approaches, while autumn features stabilized clear high-pressure weather and colder ice conditions.`,
        },
        {
          question: `Are climbing permits required from the IMF for ${peak.title}?`,
          answer: `Yes, climbing permits must be secured through the Indian Mountaineering Foundation (IMF). Foreign expeditions must apply well in advance to obtain government clearance and a designated Liaison Officer.`,
        },
      ];

  return (
    <section id="expedition-faqs" className="scroll-mt-24 space-y-6" aria-labelledby="expedition-faq-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Expedition FAQ
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2
            id="expedition-faq-heading"
            className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2"
          >
            Technical Expedition Inquiries: {peak.title}
          </h2>
          <p className="text-slate-400 font-light text-sm sm:text-base">
            Verified answers regarding climbing difficulty, technical gear, IMF permits, and base camp approach.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-shrink-0">
          <HelpCircle className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>{faqs.length} Technical Answers</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#080e1a] rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden transition-colors duration-300 shadow-2xl"
              style={isOpen ? { borderColor: `${style.accent}60` } : undefined}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.02] min-h-[44px]"
                aria-expanded={isOpen}
              >
                <h3 className="font-display font-semibold text-base sm:text-lg text-white pr-4 leading-snug">
                  {faq.question}
                </h3>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 bg-white/[0.05] text-slate-400"
                  style={isOpen ? { transform: "rotate(180deg)", color: style.accent } : undefined}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 font-light text-sm sm:text-base leading-relaxed border-t border-white/[0.04]">
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
