"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Guide } from "@/data/types";
import { ContentCard } from "@/components/content/ContentCard";
import { AlertCircle, ArrowRight } from "lucide-react";

interface GuidesHubProps {
  guides: Guide[];
}

export function GuidesHub({ guides }: GuidesHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Expedition News",
    "News & Updates",
    "Travel Info",
    "Gear",
    "Permits",
    "Hiking",
    "Transportation",
    "Planning",
    "Regional Guide",
    "Seasonal Guide",
  ];

  const filteredGuides =
    selectedCategory === "All"
      ? guides
      : guides.filter((g) => g.category === selectedCategory);

  const featuredGuide = guides[0];

  return (
    <div className="space-y-12">
      {/* Featured Guide Banner */}
      {featuredGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden glass-museum-card border border-primary/30 p-5 sm:p-8 md:p-12 bg-gradient-to-r from-primary/10 via-card to-card shadow-lg"
        >
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-4">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <AlertCircle className="w-4 h-4 ml-1" /> Featured Field Guide
          </div>

          <div className="max-w-3xl space-y-4">
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground leading-tight">
              {featuredGuide.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-light line-clamp-3">
              {featuredGuide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 font-mono">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                {featuredGuide.category}
              </span>
              <span>•</span>
              <span>By {featuredGuide.author}</span>
            </div>

            <div className="pt-4">
              <Link
                href={`/guides/${featuredGuide.slug}`}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-focus transition-all duration-300 shadow-lg shadow-primary/20"
              >
                Read Full Field Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-border">
        {categories.map((cat) => {
          const count =
            cat === "All"
              ? guides.length
              : guides.filter((g) => g.category === cat).length;
          if (count === 0 && cat !== "All") return null;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredGuides.map((guide) => (
            <motion.div
              key={guide.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ContentCard
                title={guide.title}
                slug={guide.slug}
                basePath="/guides"
                description={guide.description}
                badges={[guide.category]}
                meta={[{ label: "Author", value: guide.author }]}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
