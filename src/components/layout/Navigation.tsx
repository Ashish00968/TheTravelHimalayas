"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Menu, X, Mountain, Map, BookOpen, Compass, Info, Calendar, CloudLightning, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { SearchModal } from "@/components/search/SearchModal";

import { Logo } from "@/components/brand/Logo";

interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavLink[] = [
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Plan", href: "/plan", icon: Calendar },
  { label: "Map", href: "/map", icon: Map },
  { label: "Conditions", href: "/conditions", icon: CloudLightning },
  { label: "Prepare", href: "/prepare", icon: Shield },
  { label: "Stories", href: "/stories", icon: BookOpen },
  { label: "About", href: "/contact", icon: Info },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled || isMobileOpen
            ? "frosted-glass-dark shadow-product border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-4 h-20">
          {/* Brand Logo */}
          <div onClick={() => setIsMobileOpen(false)}>
            <Logo variant="horizontal" size="md" glow={true} />
          </div>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm tracking-wide transition-all duration-200 interactive-button ${
                    isActive(link.href)
                      ? "text-primary font-medium"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span 
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(0,102,204,0.6)]" 
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="btn-icon"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden btn-icon"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen ? (
                  <motion.span key="close"
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                  >
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span key="open"
                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-3xl pt-20 overflow-y-auto"
          >
            <motion.nav
              className="container mx-auto px-6 py-10 flex flex-col min-h-[calc(100vh-5rem)]"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              {/* Nav List */}
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                  <motion.div
                    key={href}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
                    }}
                  >
                    <Link
                      href={href}
                      className={`flex items-center gap-4 text-2xl transition-all duration-200 interactive-button origin-left ${
                        isActive(href)
                          ? "text-primary font-display font-semibold"
                          : "text-foreground/70 hover:text-foreground font-display font-medium"
                      }`}
                    >
                      <Icon className="w-6 h-6 opacity-60" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom */}
              <motion.div
                className="mt-auto pt-10 pb-8"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
                }}
              >
                <Link
                  href="/#regions"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full btn-primary"
                >
                  <Mountain className="w-5 h-5" />
                  Explore Himalayan Atlas
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
