"use client";

export function NewsletterSignup() {
  return (
    <div>
      <h3 className="font-bold font-heading text-foreground mb-2">
        Newsletter
      </h3>
      <p className="text-sm text-foreground/60 mb-4">
        Get weekly trail updates and tips.
      </p>
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors min-w-[44px] min-h-[44px]"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
