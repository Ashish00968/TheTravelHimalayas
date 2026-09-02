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
  { label: "Explore",    href: "/explore",    icon: Compass },
  { label: "Plan",       href: "/plan",        icon: Calendar },
  { label: "Conditions", href: "/conditions",  icon: CloudLightning },
  { label: "Prepare",    href: "/prepare",     icon: Shield },
  { label: "Stories",    href: "/stories",     icon: BookOpen },
  { label: "About",      href: "/contact",     icon: Info },
  { label: "3D Map",     href: "/map",         icon: Map },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on path change
  // Note: instead of using useEffect which causes cascading renders, we add onClick to links or wrap the change.
  // Actually, keeping the mobile menu open on navigation is not possible because we close it.
  // Next.js App Router preserves client component state on navigation.
  // The correct pattern is to close the menu on link clicks.

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled || isMobileOpen
            ? "nav-glass border-b border-white/7 shadow-[0_1px_60px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-4 h-[68px] max-w-7xl">

          {/* Brand */}
          <div onClick={() => setIsMobileOpen(false)}>
            <Logo variant="horizontal" size="md" glow={true} />
          </div>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative flex items-center px-3 py-2 rounded-lg text-[0.8125rem] font-medium tracking-wide transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/50 hover:text-white/85 hover:bg-white/4"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active-dot"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="btn-icon"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <Link
              href="/plan"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.8125rem] font-semibold transition-all duration-200"
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              <Mountain className="w-3.5 h-3.5" />
              Plan
            </Link>

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
                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="open"
                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 lg:hidden pt-[68px]"
            style={{ background: "rgba(4,8,18,0.97)", backdropFilter: "blur(24px)" }}
          >
            <motion.nav
              className="container mx-auto px-6 py-8 flex flex-col min-h-[calc(100vh-68px)] max-w-xl"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
            >
              {/* Links */}
              <div className="flex flex-col divide-y divide-white/5">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                  <motion.div
                    key={href}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
                    }}
                  >
                    <Link
                      href={href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between py-5 text-xl font-display font-medium transition-colors ${
                        isActive(href) ? "text-primary" : "text-white/65 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <Icon className="w-5 h-5 opacity-50" />
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                className="mt-auto py-8"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.45 } } }}
              >
                <Link
                  href="/map"
                  onClick={() => setIsMobileOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  <Map className="w-4 h-4" />
                  Open Himalayan Atlas
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
