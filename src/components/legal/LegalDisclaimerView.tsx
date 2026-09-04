import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

export function LegalDisclaimerView() {
  return (
    <main className="min-h-screen pt-28 pb-24 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-8 text-xs font-mono font-bold uppercase tracking-[0.15em]"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Basecamp
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 uppercase tracking-[0.25em] font-semibold">
              Legal Notice &amp; Platform Terms
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Terms of Service &amp; Legal Disclaimer
          </h1>
          <p className="text-foreground/70 text-base sm:text-lg font-light leading-relaxed">
            Important information regarding platform development status, illustrative photography, high-altitude safety, and liability limitations.
          </p>
        </div>

        {/* Development Preview Alert Box */}
        <div 
          className="p-6 sm:p-8 rounded-3xl mb-12 relative overflow-hidden border border-amber-500/35 bg-amber-500/[0.08] dark:bg-amber-500/[0.06] shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-1">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-lg sm:text-xl mb-2">
                Development Phase &amp; Illustrative Media Notice
              </h3>
              <p className="text-foreground/80 text-sm font-light leading-relaxed">
                <strong className="text-amber-700 dark:text-amber-300 font-semibold">Discover Himalayan Trails is currently in an active beta and development preview phase.</strong> All photography, place images, elevation profiles, trail coordinates, and location descriptions are provided strictly for technical demonstration and illustrative layout purposes. Imagery may not represent exact real-world locations or current terrain conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Legal Sections */}
        <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-3xl glass-museum-card border border-foreground/[0.08] space-y-3 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-foreground text-xl">
                1. Development &amp; Demonstration Status
              </h2>
            </div>
            <p>
              The information, visual assets, maps, and route data presented on <strong>discoverhimalayantrails.com</strong> are undergoing continuous field verification and refinement. During this development phase, all photos, region previews, peak graphics, and destination details serve as structural placeholders and conceptual demonstrations.
            </p>
            <p className="text-foreground/50 text-xs font-mono pt-2">
              Last Revised: September 2026 • Platform Version: Beta 3.0
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-3xl glass-museum-card border border-foreground/[0.08] space-y-3 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-teal-500" />
              <h2 className="font-display font-bold text-foreground text-xl">
                2. Media &amp; Image Mismatch Disclaimer
              </h2>
            </div>
            <p>
              Photographs displayed across trek guides, peak profiles, and regional atlases may not match the actual physical locations, weather states, or trail conditions of the depicted places. Users must not rely on platform photography as accurate geographical, navigational, or safety reference material.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-3xl glass-museum-card border border-foreground/[0.08] space-y-3 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h2 className="font-display font-bold text-foreground text-xl">
                3. High-Altitude Risk &amp; Non-Liability Clause
              </h2>
            </div>
            <p>
              Trekking, alpine climbing, and high-altitude exploration in the Indian Himalayas (Jammu &amp; Kashmir, Himachal Pradesh, Ladakh, Uttarakhand) involve extreme hazards including Acute Mountain Sickness (AMS), HAPE/HACE, sudden atmospheric changes, avalanches, and remote wilderness risks.
            </p>
            <p className="text-amber-700 dark:text-amber-200/90 font-medium">
              By accessing this platform, you acknowledge and agree that <strong>Discover Himalayan Trails, its creators, developers, and affiliates shall not be held legally liable or responsible for any injury, loss, property damage, search and rescue costs, or legal claims</strong> arising directly or indirectly from the use of, or reliance upon, any content, maps, routes, or recommendations provided on this site.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-3xl glass-museum-card border border-foreground/[0.08] space-y-3 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="font-display font-bold text-foreground text-xl">
                4. Mandatory Independent Verification
              </h2>
            </div>
            <p>
              Before planning or undertaking any high-altitude trek or expedition, visitors must independently verify all route logistics, wilderness permits, weather forecasts, and trail safety with local forest departments, registered alpine guides, and official mountain rescue organizations.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
