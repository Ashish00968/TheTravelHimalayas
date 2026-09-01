"use client";

import Link from "next/link";
import { NewsletterSignup } from "@/components/monetization/NewsletterSignup";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 max-w-7xl">
        <div className="md:col-span-1">
          <div className="mb-6">
            <Logo variant="horizontal" size="md" glow={true} />
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-6 font-light">
            Curating the definitive atlas to high-altitude expeditions, remote trekking trails, and mountaineering culture across the Indian Himalayas.
          </p>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white mb-5">
            Atlas &amp; Trails
          </h3>
          <nav className="flex flex-col gap-3 font-light text-sm">
            <Link
              href="/explore/himachal-pradesh"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Himachal Pradesh
            </Link>
            <Link
              href="/explore/uttarakhand"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Uttarakhand
            </Link>
            <Link
              href="/explore/ladakh"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Ladakh &amp; Zanskar
            </Link>
            <Link
              href="/explore/jammu-kashmir"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Jammu &amp; Kashmir
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white mb-5">
            Resources
          </h3>
          <nav className="flex flex-col gap-3 font-light text-sm">
            <Link
              href="/safety"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Mountain Terms &amp; Safety
            </Link>
            <Link
              href="/guides"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Field &amp; Travel Guides
            </Link>
            <Link
              href="/guides/trekking-permits-himachal"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Permits &amp; Regulations
            </Link>
            <Link
              href="/guides/packing-list-himalayan-treks"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Gear Checklist
            </Link>
            <Link
              href="/contact"
              className="text-white/60 hover:text-primary transition-colors w-fit"
            >
              Contact Basecamp
            </Link>
          </nav>
        </div>

        <div className="md:col-span-1">
          <h3 className="font-display text-base font-semibold text-white mb-5">
            Stay Informed
          </h3>
          <NewsletterSignup />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
        <p className="text-xs text-white/40 font-mono">
          © {new Date().getFullYear()} The Himalayan Trails. All rights reserved.
        </p>
        <div className="flex gap-2">
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a
            href={SITE.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href={SITE.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
