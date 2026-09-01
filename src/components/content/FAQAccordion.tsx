"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQAccordionProps {
  faqs: { question: string; answer: string }[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div 
      className="space-y-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {faqs.map((faq, index) => (
        <motion.div 
          key={index} 
          className="glass-card rounded-xl overflow-hidden"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
          }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left px-5 py-4 flex justify-between items-center min-h-[52px] hover:bg-white/5 transition-colors group"
            aria-expanded={openIndex === index}
          >
            <span className="text-foreground font-medium pr-4 group-hover:text-primary transition-colors text-sm md:text-base">
              {faq.question}
            </span>
            <motion.span
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-primary flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-foreground/75 text-sm leading-relaxed border-t border-white/5 pt-3">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}
