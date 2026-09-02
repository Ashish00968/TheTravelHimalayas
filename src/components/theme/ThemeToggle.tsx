"use client";

import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  variant?: "nav" | "floating";
  className?: string;
}

const THEME_EVENT = "himalayan-theme-change";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "dark";
}

export function ThemeToggle({ variant = "nav", className = "" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }

    window.dispatchEvent(new Event(THEME_EVENT));
  };

  if (variant === "floating") {
    return (
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
        className={`fixed left-5 bottom-6 z-50 p-3 rounded-full glass-capsule shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-center text-foreground hover:text-primary transition-all duration-300 group border ${
          theme === "dark" ? "border-white/15 bg-[#0a1122]/85" : "border-slate-300 bg-white/90"
        } ${className}`}
        title={`Toggle ${theme === "dark" ? "Light" : "Dark"} Mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-amber-400"
            >
              <Sun className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-blue-600"
            >
              <Moon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only">Toggle theme</span>
      </motion.button>
    );
  }

  // Navigation compact variant (beside logo on left)
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      className={`p-1.5 rounded-full transition-colors duration-200 flex items-center justify-center ${
        theme === "dark"
          ? "text-amber-400 hover:bg-white/10"
          : "text-blue-600 hover:bg-slate-200/80"
      } ${className}`}
      title={`Toggle ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="sun-nav"
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon-nav"
            initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
