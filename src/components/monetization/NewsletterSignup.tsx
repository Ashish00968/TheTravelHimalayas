"use client";

import { useState } from "react";
import { Check, Loader2, Mail, ArrowRight, ShieldCheck } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterSignupProps {
  /** "compact" for footer/sidebar, "hero" for large centered sections */
  variant?: "compact" | "hero";
  className?: string;
}

export function NewsletterSignup({ variant = "compact", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isHero = variant === "hero";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("You're subscribed to Himalayan Field Dispatches.");
      } else {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={`p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center gap-3 text-sm text-emerald-400 font-medium ${className}`}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 shrink-0">
          <Check className="h-4 w-4" />
        </span>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {!isHero && (
        <>
          <h3 className="font-bold font-heading text-foreground mb-2">Newsletter</h3>
          <p className="text-sm text-foreground/60 mb-4">Get weekly trail updates and tips.</p>
        </>
      )}

      {isHero ? (
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full max-w-lg mx-auto rounded-full bg-surface/95 dark:bg-[#070D1A] border border-slate-200/90 dark:border-white/15 p-1.5 shadow-lg transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 backdrop-blur-md"
        >
          <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
            Email address
          </label>
          <div className="pl-3.5 pr-1 text-foreground/40 flex items-center pointer-events-none shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id={`newsletter-email-${variant}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for trail intel..."
            className="flex-1 bg-transparent px-2.5 py-2.5 text-foreground placeholder:text-foreground/40 text-xs sm:text-sm outline-none min-w-0"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-60 shrink-0"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${variant}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-4 py-2 rounded-lg bg-background border border-foreground/[0.12] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-300 min-w-[44px] min-h-[44px] inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            Subscribe
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-xs text-red-400 font-mono" role="alert">
          {message}
        </p>
      )}

      {isHero && status !== "error" && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-foreground/50">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Monthly Cadence
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Verified Trail Status
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-foreground/40" />
            Zero Spam Guarantee
          </span>
        </div>
      )}
    </div>
  );
}
