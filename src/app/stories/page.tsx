import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import {
  Compass,
  BookOpen,
  Clock,
  ArrowRight,
  Mountain,
  ShieldCheck,
  Mail,
  Send,
  Camera,
  MapPin,
  Sparkles,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { SITE } from "@/lib/site";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Field Dispatches & Expedition Stories — First-Hand Trail Chronicles",
  description:
    "First-hand alpine narratives, route reconnaissance chronicles, and authentic photographic dispatches from high passes and peaks across the Indian Himalayas.",
  path: "/stories",
  keywords: [
    "Patalsu peak trek story",
    "Patalsu peak speed hike chronicle",
    "Himalayan trekking stories",
    "alpine expedition stories",
    "Himachal trekking dispatch",
    "Solang valley trail stories",
  ],
});

interface StoryArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  territory: string;
  territoryId: string;
  territoryColor: string;
  altitude: string;
  readTime: string;
  date: string;
  author: string;
  authorHandle?: string;
  authorLink?: string;
  elevationGain: string;
  style: string;
  quote?: string;
  image?: string;
  relatedHref: string;
}

const FEATURED_STORIES: StoryArticle[] = [
  {
    id: "patalsu-peak-speed-hike",
    title: "Speed-Hiking the 4,261m Crest: An Autumn Solo Ascent of Patalsu Peak",
    slug: "patalsu-peak-autumn-speed-hike",
    excerpt:
      "A grueling +1,781m continuous vertical climb from Solang Village through old-growth cedar forests and high alpine meadows of Shagadugh to the loose scree knife-edge facing Hanuman Tibba. 12–13 hours of non-stop alpine endurance.",
    territory: "Himachal Pradesh",
    territoryId: "himachal-pradesh",
    territoryColor: "#F59E0B",
    altitude: "4,261m",
    readTime: "10 min read",
    date: "October Autumn Ascent",
    author: "Ashish",
    authorHandle: "@ashish_0968",
    authorLink: "https://instagram.com/ashish_0968",
    elevationGain: "+1,781m",
    style: "1-Day Alpine Speed Hike",
    quote:
      "Conquering the +1,781m vertical gain in one push is an incredible test of mountain endurance. Camping at Shagadugh gives your body time to acclimatize before tackling the relentless loose scree on the summit ridge.",
    image:
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/10abovetheTreelineViewOfDhauladharRanges.jpg",
    relatedHref: "/explore/himachal-pradesh/kullu/patalsu-peak#trail",
  },
];

export default function StoriesPage() {
  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Stories & Dispatches", href: "/stories" },
  ]);

  const submissionEmail = SITE.email.explore || "explore@discoverhimalayantrails.com";
  const mailtoSubject = encodeURIComponent("Trail Story Submission — Discover Himalayan Trails");
  const mailtoBody = encodeURIComponent(
    `Hi Discover Himalayan Trails Team,\n\nI would like to submit my trail story for publication on the platform.\n\n` +
      `• Trek / Peak Name: \n` +
      `• Territory & Region: \n` +
      `• Dates & Season: \n` +
      `• Duration & Style (Solo / Guided / Self-Supported): \n` +
      `• Max Altitude & Vertical Gain: \n` +
      `• Trail Notes & Key Highlights: \n` +
      `• Photo Drive / Cloud Link (High-res unedited plates): \n\n` +
      `Thank you!\n`
  );
  const mailtoUrl = `mailto:${submissionEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <HeroSection
        title="Field Dispatches & Alpine Stories"
        subtitle="First-hand expedition chronicles, route reconnaissance reports, and authentic photography across the 2,400km Indian Himalayan Arc."
      />

      <section className="py-12 sm:py-16 bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Top Quick Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-foreground/[0.08]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-foreground/70 font-semibold">
                Authentic Field Chronicles
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-foreground/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Field-Surveyed Telemetry</span>
            </div>
          </div>

          {/* Stories & Submissions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* 1. Featured Patalsu Peak Story (Takes 7 cols on large screens) */}
            <div className="lg:col-span-7 flex flex-col">
              {FEATURED_STORIES.map((story) => (
                <article
                  key={story.id}
                  className="group relative rounded-3xl overflow-hidden glass-museum-card border border-foreground/[0.08] hover:border-foreground/[0.25] transition-all duration-500 shadow-xl flex flex-col justify-between h-full bg-card/70 dark:bg-[#080e1a]/80"
                >
                  {/* Photo Banner with Badges */}
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden">
                    {story.image && (
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-[#080e1a] via-black/30 to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md bg-black/60 shadow-sm"
                        style={{
                          border: `1px solid ${story.territoryColor}80`,
                          color: story.territoryColor,
                        }}
                      >
                        {story.territory}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-amber-400" />
                        {story.altitude}
                      </span>
                    </div>

                    {/* Bottom Photo Pill */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md border border-white/10 text-white/90 flex items-center gap-1.5">
                        <Camera className="w-3 h-3 text-primary" />
                        12 Authentic Trail Plates
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md border border-white/10 text-white/80">
                        {story.elevationGain} Gain
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-foreground/50 mb-3">
                        <span className="text-primary font-semibold">{story.style}</span>
                        <span>•</span>
                        <span>{story.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {story.readTime}
                        </span>
                      </div>

                      {/* Heading */}
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground group-hover:text-primary transition-colors leading-snug mb-4">
                        {story.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-foreground/75 text-sm sm:text-base font-light leading-relaxed mb-6">
                        {story.excerpt}
                      </p>

                      {/* Pull Quote */}
                      {story.quote && (
                        <blockquote className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border-l-4 border-amber-500 mb-6 text-xs sm:text-sm font-serif italic text-foreground/85 leading-relaxed">
                          &ldquo;{story.quote}&rdquo;
                        </blockquote>
                      )}
                    </div>

                    {/* Card Footer: Author + CTA */}
                    <div className="pt-5 border-t border-foreground/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 font-display font-bold text-sm flex items-center justify-center border border-amber-500/30">
                          A
                        </div>
                        <div>
                          <div className="text-xs font-display font-bold text-foreground">
                            Story &amp; Photos by {story.author}
                          </div>
                          {story.authorHandle && story.authorLink && (
                            <Link
                              href={story.authorLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-pink-500 hover:text-pink-400 hover:underline"
                            >
                              <InstagramIcon className="w-3 h-3" />
                              <span>{story.authorHandle}</span>
                            </Link>
                          )}
                        </div>
                      </div>

                      <Link
                        href={story.relatedHref}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md group-hover:translate-x-0.5"
                      >
                        <span>Explore Photo Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 2. "Want Your Story to Be Published? / Add Your Story" Card (Takes 5 cols on large screens) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="h-full rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-card via-card/90 to-card/70 dark:from-[#091122] dark:via-[#070D1A] dark:to-[#050A14] border border-slate-200/90 dark:border-white/10 relative overflow-hidden shadow-xl flex flex-col justify-between backdrop-blur-xl">
                {/* Background Ambient Aura */}
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] bg-primary/20 pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] bg-amber-500/10 pointer-events-none" />

                <div className="relative z-10">
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/25 mb-5">
                    <Send className="w-3 h-3" />
                    <span>Open Field Submissions</span>
                  </div>

                  {/* Heading */}
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3 leading-tight">
                    Want Your Story to Be Published?
                  </h2>

                  {/* Subtitle */}
                  <p className="text-foreground/75 text-xs sm:text-sm font-light leading-relaxed mb-6">
                    Have you completed an independent trek, high-pass crossing, or summit expedition in Himachal, Kashmir, Ladakh, or Uttarakhand? Discover Himalayan Trails publishes authentic, field-verified dispatches from real hikers.
                  </p>

                  {/* Submission Pillars */}
                  <div className="space-y-3 mb-6">
                    <div className="p-3.5 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="block text-xs font-mono font-bold text-foreground mb-0.5">
                          1. Trail Telemetry &amp; Stats
                        </strong>
                        <span className="text-[11px] text-foreground/60 leading-relaxed font-light">
                          Route name, season, total vertical gain, camp waypoints, and water source availability.
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="block text-xs font-mono font-bold text-foreground mb-0.5">
                          2. Authentic Photographs
                        </strong>
                        <span className="text-[11px] text-foreground/60 leading-relaxed font-light">
                          High-resolution, unedited trail photos covering trailhead, forest, alpine meadow, and summit ridge.
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="block text-xs font-mono font-bold text-foreground mb-0.5">
                          3. Honest Field Reflections
                        </strong>
                        <span className="text-[11px] text-foreground/60 leading-relaxed font-light">
                          Raw pacing observations, terrain warnings, acclimatization notes, and recommendations for future explorers.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Call to Action */}
                <div className="relative z-10 pt-5 border-t border-foreground/[0.08] space-y-3">
                  <a
                    href={mailtoUrl}
                    className="w-full py-3.5 px-5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Your Story to Basecamp</span>
                  </a>

                  <div className="text-center">
                    <span className="text-[11px] font-mono text-foreground/50 block mb-1">
                      Direct Editorial Desk:
                    </span>
                    <a
                      href={`mailto:${submissionEmail}`}
                      className="text-xs font-mono font-bold text-primary hover:underline"
                    >
                      {submissionEmail}
                    </a>
                  </div>

                  <p className="text-[10px] text-center text-foreground/45 font-mono pt-1">
                    Every dispatch is fact-checked and verified by our alpine editorial team before publication. Zero commercial bias.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Discovery Banner */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl glass-capsule border border-foreground/[0.1] text-center max-w-3xl mx-auto">
            <Compass className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-display font-bold text-2xl text-foreground mb-3">
              Ready to Chart Your Own Himalayan Expedition?
            </h3>
            <p className="text-foreground/70 text-sm font-light max-w-xl mx-auto mb-6">
              Access technical trail profiles, high-resolution elevation graphs, and field safety protocols across all 4 territories.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/explore"
                className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Browse All Trails
              </Link>
              <Link
                href="/map"
                className="px-6 py-3 rounded-2xl glass-capsule hover:bg-foreground/[0.08] text-foreground font-display font-medium text-xs uppercase tracking-wider transition-all border border-foreground/[0.1]"
              >
                Launch 3D Atlas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

