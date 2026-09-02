"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Menu, X, Map, BookOpen, Compass, Info, Calendar, CloudLightning, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { SearchModal } from "@/components/search/SearchModal";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavLink[] = [
  { label: "Explore",    href: "/explore",    icon: Compass },
  { label: "Plan",       href: "/plan",        icon: Calendar },
  { label: "Conditions", href: "/conditions",  icon: CloudLightning },
  { label: "Prepare",    href: "/prepare",     icon: Shield },
  { label: "Stories",    href: "/stories",     icon: BookOpen },
  { label: "About",      href: "/contact",     icon: Info },
  { label: "3D Map",     href: "/map",         icon: Map },
];

const TERRITORIES = [
  { id: "jammu-kashmir",    label: "Kashmir",    accent: "#3B82F6", emoji: "🏔️" },
  { id: "himachal-pradesh", label: "Himachal",   accent: "#F59E0B", emoji: "🌲" },
  { id: "ladakh",             label: "Ladakh",     accent: "#7C3AED", emoji: "🌌" },
  { id: "uttarakhand",        label: "Uttarakhand",accent: "#0D9488", emoji: "🛕" },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Global ⌘K keyboard shortcut for instant search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-highland ${
          scrolled
            ? "py-2.5 sm:py-3.5"
            : "py-4 sm:py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <nav 
            className={`flex items-center justify-between px-3 sm:px-5 py-2 rounded-full transition-all duration-500 ${
              scrolled
                ? "glass-capsule shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
                : "bg-transparent border border-transparent"
            }`}
          >
            {/* Brand Logo & Left-Side Theme Controller */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div onClick={() => setIsMobileOpen(false)}>
                <Logo variant="horizontal" size="md" glow={true} />
              </div>
              <div className="border-l border-foreground/15 pl-1.5 sm:pl-2.5">
                <ThemeToggle variant="nav" />
              </div>
            </div>

            {/* Desktop Navigation Links (Pill Style) */}
            <ul className="hidden xl:flex items-center gap-1 bg-foreground/[0.04] p-1 rounded-full border border-foreground/[0.08]">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 block ${
                        active
                          ? "text-foreground font-semibold"
                          : "text-foreground/65 hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {active && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-foreground/[0.08] border border-foreground/15 shadow-[0_0_15px_rgba(59,130,246,0.15)] pointer-events-none"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Actions: Quick Search Pill & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Quick Search Pill (Desktop) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] border border-foreground/10 text-foreground/60 hover:text-foreground text-xs transition-all duration-200 group"
                aria-label="Search Himalayas"
              >
                <Search className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-light">Search...</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-foreground/10 text-foreground/50 border border-foreground/10">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="sm:hidden p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Mobile Drawer Hamburger Button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="xl:hidden p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Architectural Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 xl:hidden pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto bg-background/95 backdrop-blur-2xl"
          >
            <div className="max-w-md mx-auto w-full space-y-6">
              {/* Territory Quick Links */}
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 block mb-3">
                  Territories
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {TERRITORIES.map((t) => (
                    <Link
                      key={t.id}
                      href={`/explore/${t.id}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] flex items-center gap-2.5 text-xs font-semibold transition-all"
                      style={{ color: t.accent }}
                    >
                      <span>{t.emoji}</span>
                      <span>{t.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Navigation Links */}
              <div className="divide-y divide-white/[0.06] pt-2">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between py-4 text-base font-display font-medium transition-colors ${
                      isActive(href) ? "text-primary" : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4 opacity-50" />
                      {label}
                    </span>
                    <span className="text-white/30 text-xs font-mono font-light">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="max-w-md mx-auto w-full pt-4">
              <Link
                href="/map"
                onClick={() => setIsMobileOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(59,130,246,0.3)]"
              >
                <Map className="w-4 h-4" />
                Launch 3D Himalayan Atlas
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
