"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface RelatedItem {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  region?: string;
  difficulty?: string;
}

interface RelatedContentProps {
  title: string;
  items: RelatedItem[];
  basePath: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
};

export function RelatedContent({ title, items, basePath }: RelatedContentProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-white/10">
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">
        {title}
      </h2>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-3"
      >
        {items.map((item) => (
          <motion.div key={item.slug} variants={itemVariants}>
            <Link
              href={`${basePath}/${item.slug}`}
              className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors text-sm font-medium w-fit"
            >
              Explore this: <span className="text-foreground group-hover:text-primary transition-colors">{item.title}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
