"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Treks", href: "/treks" },
  { label: "Peaks", href: "/peaks" },
  { label: "Day Hikes", href: "/day-hikes" },
  { label: "Regions", href: "/regions" },
  { label: "Guides", href: "/guides" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full glass-nav">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold font-heading text-foreground">
          TheHimalayanTrails
        </Link>
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/80 hover:text-primary transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/80"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass-panel p-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 min-h-[44px] text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </header>
  );
}
