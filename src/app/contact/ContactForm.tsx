"use client";

export function ContactForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground/80 mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your name"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground/80 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-foreground/80 mb-2"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="What is this about?"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground/80 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Your message..."
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px]"
      >
        Send Message
      </button>
    </form>
  );
}
