"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Compass, Mountain, ArrowRight, Bookmark } from "lucide-react";
import { useSavedExpeditions } from "@/lib/saved-expeditions";

interface SavedExpeditionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedExpeditionsDrawer({ isOpen, onClose }: SavedExpeditionsDrawerProps) {
  const { saved, count, remove, clear, mounted } = useSavedExpeditions();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-md h-full bg-background/95 backdrop-blur-2xl border-l border-foreground/10 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Saved Expeditions"
          >
            {/* Header */}
            <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Bookmark className="w-5 h-5 fill-primary/20" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground leading-tight">
                    Saved Expeditions
                  </h2>
                  <p className="text-xs font-mono text-muted-foreground">
                    {count} {count === 1 ? "trail" : "trails"} bookmarked
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    onClick={clear}
                    className="text-xs font-mono text-muted-foreground hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
                    title="Clear all saved"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                  aria-label="Close saved expeditions drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {saved.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted-foreground">
                    <Compass className="w-8 h-8 opacity-60" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h3 className="font-display font-semibold text-foreground text-base">
                      No saved trails yet
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Click the bookmark icon on any trek or peak guide to build your expedition shortlist.
                    </p>
                  </div>
                  <Link
                    href="/explore"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors pt-2"
                  >
                    <span>Browse Himalayan Trails</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                saved.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl p-4 bg-card/70 hover:bg-card border border-foreground/10 hover:border-primary/40 transition-all flex gap-4 overflow-hidden"
                  >
                    {/* Thumbnail */}
                    {item.image && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-foreground/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase font-semibold">
                          {item.type}
                        </span>
                        {item.difficulty && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {item.difficulty}
                          </span>
                        )}
                      </div>

                      <Link
                        href={item.url}
                        onClick={onClose}
                        className="font-display font-semibold text-foreground hover:text-primary transition-colors text-sm block truncate mb-1"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                        {item.elevation && <span>{item.elevation}</span>}
                        {item.duration && <span>• {item.duration}</span>}
                      </div>

                      <div className="text-[10px] font-mono text-muted-foreground/70 truncate mt-1">
                        {item.divisionName || item.regionName}
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => remove(item.id)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-muted-foreground hover:text-rose-500 transition-all self-start"
                      title="Remove from saved"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary / Quick Action */}
            {count > 0 && (
              <div className="p-6 border-t border-foreground/10 bg-card/40 space-y-3">
                <Link
                  href="/plan/compare"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-display font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Mountain className="w-4 h-4" />
                  <span>Compare Saved Trails</span>
                </Link>
                <p className="text-[11px] font-mono text-center text-muted-foreground">
                  Stored privately on your device for offline trail reference.
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
