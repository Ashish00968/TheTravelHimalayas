"use client";

import { useState } from "react";

interface FAQAccordionProps {
  faqs: { question: string; answer: string }[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left p-4 flex justify-between items-center min-h-[44px]"
            aria-expanded={openIndex === index}
          >
            <span className="text-foreground font-medium pr-4">
              {faq.question}
            </span>
            <span className="text-foreground/60 flex-shrink-0">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-foreground/70 text-sm">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
