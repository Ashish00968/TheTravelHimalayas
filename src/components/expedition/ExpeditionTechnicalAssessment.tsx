"use client";

import { Peak } from "@/data/types";

interface ExpeditionTechnicalAssessmentProps {
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionTechnicalAssessment({
  peak,
  stateSlug,
}: ExpeditionTechnicalAssessmentProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  // Technical assessment metrics derived from peak.difficulty and peak characteristics
  const isChallenging = peak.difficulty === "Challenging" || peak.difficulty === "Difficult";

  const assessmentCards = [
    {
      label: "Technical Grade",
      value: `${peak.difficulty.toUpperCase()} ALPINE`,
      desc: isChallenging
        ? "Demands steep ice climbing proficiency (up to 50°–60°), technical mixed rock handling, and roped crevasse rescue expertise."
        : "Moderate alpine climbing involving glacier moraine traversal, 35°–45° snow slopes, and crampon/ice axe mastery.",
      level: isChallenging ? "Grade IV / AD+" : "Grade II / PD",
    },
    {
      label: "Glacier Navigation",
      value: "ACTIVE CREVASSE FIELDS",
      desc: "Glacier ice aprons require continuous roped team movement, crevasse probing, and vigilance regarding hidden snow bridges.",
      level: "Commitment High",
    },
    {
      label: "Exposure & Headwall",
      value: isChallenging ? "SEVERE RIDGE EXPOSURE" : "MODERATE EXPOSURE",
      desc: isChallenging
        ? "Knife-edge arêtes and corniced ridges with multi-thousand-foot exposure to adjacent glacial cirques."
        : "Open broad snow slopes with localized exposure along the summit approach ridge.",
      level: isChallenging ? "High Exposure" : "Manageable",
    },
    {
      label: "Altitude Exposure",
      value: `${peak.height}M EXTREME ZONE`,
      desc: "Atmospheric pressure is under 55% of sea level datum. Acute Mountain Sickness (AMS), HAPE, and HACE risks are active.",
      level: "Physiological High",
    },
  ];

  return (
    <section id="technical-assessment" className="scroll-mt-24 space-y-6" aria-labelledby="technical-assessment-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Technical Evaluation
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <h2
        id="technical-assessment-heading"
        className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight"
      >
        Technical Grade &amp; Objective Hazard Assessment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessmentCards.map((card, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-white/10 text-slate-200">
                {card.level}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg sm:text-xl text-white">
              {card.value}
            </h3>

            <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
