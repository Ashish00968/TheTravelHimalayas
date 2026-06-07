import Link from "next/link";
import { treks } from "@/data/treks";
import { peaks } from "@/data/peaks";
import { dayHikes } from "@/data/day-hikes";
import { regions } from "@/data/regions";
import { guides } from "@/data/guides";
import { ContentCard } from "@/components/content/ContentCard";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";

export default function Home() {
  const featuredTreks = treks.slice(0, 3);
  const popularPeaks = peaks.slice(0, 3);
  const bestDayHikes = dayHikes;
  const latestGuides = guides.slice(0, 3);

  return (
    <>
      {/* Hero Section — Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
        {/* Cinematic background placeholder */}
        <div className="absolute inset-0">
          <CloudinaryImage
            src="/images/hero-himalayas.jpg"
            alt="Panoramic view of the Himalayan mountain range"
            fill
            priority
            className="object-cover"
          />
        </div>
        {/* Hero content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight">
            Discover The Himalayas
            <br />
            <span className="text-primary">Beyond The Guidebooks</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Trek through ancient forests, summit towering peaks, and explore hidden valleys
            in the world&apos;s greatest mountain range.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/treks"
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors min-w-[44px] min-h-[44px]"
            >
              Explore Treks
            </Link>
            <Link
              href="/peaks"
              className="px-8 py-4 rounded-xl border border-white/20 text-foreground font-semibold text-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
            >
              Explore Peaks
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Search Shell Section */}
      <ScrollReveal>
        <section className="py-16 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                Find Your Next Adventure
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Region filter */}
                <div>
                  <label htmlFor="region-filter" className="block text-sm text-foreground/70 mb-2">
                    Region
                  </label>
                  <select
                    id="region-filter"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                  >
                    <option value="">All Regions</option>
                    <option value="kullu-manali">Kullu-Manali</option>
                    <option value="solang-valley">Solang Valley</option>
                    <option value="parvati-valley">Parvati Valley</option>
                  </select>
                </div>
                {/* Difficulty filter */}
                <div>
                  <label htmlFor="difficulty-filter" className="block text-sm text-foreground/70 mb-2">
                    Difficulty
                  </label>
                  <select
                    id="difficulty-filter"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                  >
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="difficult">Difficult</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
                {/* Duration filter */}
                <div>
                  <label htmlFor="duration-filter" className="block text-sm text-foreground/70 mb-2">
                    Duration
                  </label>
                  <select
                    id="duration-filter"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                  >
                    <option value="">Any Duration</option>
                    <option value="1-3">1–3 Days</option>
                    <option value="4-6">4–6 Days</option>
                    <option value="7+">7+ Days</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors min-w-[44px] min-h-[44px]">
                  Search Adventures
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Treks Section */}
      <ScrollReveal>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Featured Treks
                </h2>
                <p className="mt-2 text-foreground/70">
                  Handpicked routes through the heart of the Himalayas
                </p>
              </div>
              <Link
                href="/treks"
                className="hidden sm:inline-block text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTreks.map((trek) => (
                <ContentCard
                  key={trek.slug}
                  title={trek.title}
                  slug={trek.slug}
                  basePath="/treks"
                  image={trek.heroImage}
                  description={trek.description}
                  badges={[trek.difficulty, trek.region]}
                  meta={[
                    { label: "Duration", value: trek.duration },
                    { label: "Altitude", value: trek.maxAltitude },
                  ]}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/treks" className="text-primary font-medium">
                View all treks →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Popular Peaks Section */}
      <ScrollReveal>
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Popular Peaks
                </h2>
                <p className="mt-2 text-foreground/70">
                  Summit objectives for aspiring mountaineers
                </p>
              </div>
              <Link
                href="/peaks"
                className="hidden sm:inline-block text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPeaks.map((peak) => (
                <ContentCard
                  key={peak.slug}
                  title={peak.title}
                  slug={peak.slug}
                  basePath="/peaks"
                  image={peak.heroImage}
                  description={peak.description}
                  badges={[peak.difficulty, `${peak.height}m`]}
                  meta={[
                    { label: "Season", value: peak.expeditionSeason.split(",")[0] },
                    { label: "Region", value: peak.region },
                  ]}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/peaks" className="text-primary font-medium">
                View all peaks →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Best Day Hikes Section */}
      <ScrollReveal>
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Best Day Hikes
                </h2>
                <p className="mt-2 text-foreground/70">
                  Short adventures, unforgettable views
                </p>
              </div>
              <Link
                href="/day-hikes"
                className="hidden sm:inline-block text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestDayHikes.map((hike) => (
                <ContentCard
                  key={hike.slug}
                  title={hike.title}
                  slug={hike.slug}
                  basePath="/day-hikes"
                  image={hike.heroImage}
                  description={hike.description}
                  badges={[hike.difficulty, hike.region]}
                  meta={[
                    { label: "Duration", value: hike.duration },
                    { label: "Distance", value: hike.distance },
                  ]}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/day-hikes" className="text-primary font-medium">
                View all day hikes →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Explore Regions Section */}
      <ScrollReveal>
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Explore Regions
              </h2>
              <p className="mt-2 text-foreground/70">
                Discover adventures organized by destination
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <ContentCard
                  key={region.slug}
                  title={region.title}
                  slug={region.slug}
                  basePath="/regions"
                  image={region.heroImage}
                  description={region.description}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Latest Guides Section */}
      <ScrollReveal>
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Latest Guides
                </h2>
                <p className="mt-2 text-foreground/70">
                  Expert tips and travel information for the Himalayas
                </p>
              </div>
              <Link
                href="/guides"
                className="hidden sm:inline-block text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestGuides.map((guide) => (
                <ContentCard
                  key={guide.slug}
                  title={guide.title}
                  slug={guide.slug}
                  basePath="/guides"
                  image={guide.heroImage}
                  description={guide.description}
                  badges={[guide.category]}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/guides" className="text-primary font-medium">
                View all guides →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Newsletter Signup Section */}
      <ScrollReveal>
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Stay on the Trail
              </h2>
              <p className="mt-4 text-foreground/70 max-w-lg mx-auto">
                Get weekly updates on new treks, seasonal guides, and exclusive Himalayan insights
                delivered to your inbox.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                />
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors min-h-[44px] min-w-[44px]"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-xs text-foreground/50">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
