"use client";
const HIGHLIGHT_LABELS = ["Difficulty", "Max Altitude", "Height"];
import { motion } from "framer-motion";
interface QuickFactsProps {
  facts: { label: string; value: string }[];
}

export function QuickFacts({ facts }: QuickFactsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card rounded-xl p-6 border-primary/20"
    >
      <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Quick Facts</h3>
      <dl className="space-y-3">
        {facts.map((fact, index) => {
          const isHighlighted = HIGHLIGHT_LABELS.includes(fact.label);
          return (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className={`flex justify-between items-center py-1.5 ${isHighlighted ? "border-l-2 border-primary/50 pl-3 -ml-3" : ""}`}
            >
              <dt className="text-sm text-foreground/55">{fact.label}</dt>
              <dd className={`text-sm font-semibold ${isHighlighted ? "text-primary" : "text-foreground"}`}>
                {fact.value}
              </dd>
            </motion.div>
          );
        })}
      </dl>
    </motion.div>
  );
}
