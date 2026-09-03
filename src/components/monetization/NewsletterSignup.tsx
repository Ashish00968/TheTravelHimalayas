"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

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
        setMessage("You're on the list. Check your inbox for trail dispatches.");
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
      <div className={`flex items-center gap-3 text-sm text-foreground/80 ${className}`}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Check className="h-4 w-4" />
        </span>
        {message}
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
      <form
        onSubmit={handleSubmit}
        className={isHero ? "flex flex-col sm:flex-row gap-3" : "flex gap-2"}
      >
        <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${variant}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isHero ? "Your email address" : "your@email.com"}
          className={
            isHero
              ? "flex-1 rounded-full bg-background border border-foreground/[0.12] px-6 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm shadow-sm"
              : "flex-1 px-4 py-2 rounded-lg bg-background border border-foreground/[0.12] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
          }
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={
            isHero
              ? "btn-primary disabled:opacity-60"
              : "px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-[0_0_15px_rgba(173,198,255,0.15)] hover:shadow-[0_0_20px_rgba(173,198,255,0.25)] hover:bg-primary/90 transition-all duration-300 min-w-[44px] min-h-[44px] inline-flex items-center justify-center gap-2 disabled:opacity-60"
          }
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          Subscribe
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {message}
        </p>
      )}
      {isHero && status !== "error" && (
        <p className="mt-4 text-[10px] uppercase tracking-widest text-foreground/40 font-mono font-medium">
          Unsubscribe at any time.
        </p>
      )}
    </div>
  );
}
