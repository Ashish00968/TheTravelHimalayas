import Link from "next/link";
import { ArrowUpRight, Globe, Map, Mountain, Mail, Compass, Shield, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { placeIndex } from "@/data/atlas";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-12 overflow-hidden bg-background border-t border-slate-200/60 dark:border-white/[0.06] transition-colors duration-300">
      {/* Ambient background glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-primary/20"
      />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Mission (Col 1-5) */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <div className="inline-block mb-6">
              <Logo variant="horizontal" size="md" glow={true} />
            </div>
            <p className="text-foreground/80 text-sm font-light leading-relaxed mb-8 max-w-sm">
              The definitive English-language guide and geospatial atlas for high-altitude trekking, peak expeditions, and alpine exploration across the North Indian Himalayas.
            </p>

            {/* Authority Verification Badge */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Authoritative Field Atlas</span>
              </div>
              <p className="text-foreground/75 text-xs font-light leading-relaxed">
                Independent, verified trail telemetry covering Himachal Pradesh, Uttarakhand, Ladakh, and Jammu &amp; Kashmir.
              </p>
            </div>
          </div>

          {/* Territories (Col 6-8) */}
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-foreground/75">
              Territories
            </p>
            <ul className="space-y-4">
              <li>
                <Link href="/explore/himachal-pradesh" className="text-foreground/80 hover:text-[#F59E0B] text-sm font-light transition-colors flex items-center justify-between group">
                  Himachal Pradesh
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/uttarakhand" className="text-foreground/80 hover:text-[#0D9488] text-sm font-light transition-colors flex items-center justify-between group">
                  Uttarakhand
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/ladakh" className="text-foreground/80 hover:text-[#7C3AED] text-sm font-light transition-colors flex items-center justify-between group">
                  Ladakh
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/jammu-kashmir" className="text-foreground/80 hover:text-[#3B82F6] text-sm font-light transition-colors flex items-center justify-between group">
                  Jammu &amp; Kashmir
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources (Col 9-10) */}
          <div className="lg:col-span-2">
            <p className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-foreground/75">
              Resources
            </p>
            <ul className="space-y-4">
              <li>
                <Link href="/guides" className="text-foreground/80 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" /> Field Guides
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-foreground/80 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Alpine Safety
                </Link>
              </li>
              <li>
                <Link href="/plan" className="text-foreground/80 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Mountain className="w-3.5 h-3.5" /> Itinerary Planner
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-foreground/80 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Map className="w-3.5 h-3.5" /> 3D Atlas
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect (Col 11-12) */}
          <div className="lg:col-span-2">
            <p className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-foreground/75">
              Connect
            </p>
            <ul className="space-y-4">
              <li>
                <Link href="/explore" className="text-primary hover:underline text-sm font-semibold transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> All Destinations ({placeIndex.size})
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/80 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Contact
                </Link>
              </li>
              <li>
                <a 
                  href="https://instagram.com/discoverhimalayantrails" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-foreground/80 hover:text-pink-500 text-sm font-light transition-colors flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5" /> Instagram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Popular Himalayan Expeditions & High Passes Directory */}
        <div className="mb-12 pt-8 border-t border-slate-200/60 dark:border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <p className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/75">
              Popular Himalayan Trails &amp; High Passes
            </p>
            <Link
              href="/explore"
              className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1"
            >
              View Full Atlas Directory ({placeIndex.size} Places) →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Hampta Pass (4,270m)", href: "/explore/himachal-pradesh/kullu/hampta-pass" },
              { name: "Beas Kund (3,700m)", href: "/explore/himachal-pradesh/kullu/beas-kund" },
              { name: "Patalsu Peak (4,261m)", href: "/explore/himachal-pradesh/kullu/patalsu-peak" },
              { name: "Jogni Falls (2,280m)", href: "/explore/himachal-pradesh/kullu/jogni-falls" },
              { name: "Bhrigu Lake (4,300m)", href: "/explore/himachal-pradesh/kullu/bhrigu-lake" },
              { name: "Pin Parvati Pass (5,319m)", href: "/explore/himachal-pradesh/kullu/pin-parvati-pass" },
              { name: "Vaishno Devi (1,585m)", href: "/explore/jammu-kashmir/jammu/vaishno-devi" },
              { name: "Valley of Flowers (3,658m)", href: "/explore/uttarakhand/chamoli/valley-of-flowers" },
              { name: "Garhwal Char Dham (3,584m)", href: "/explore/uttarakhand/garhwal/char-dham" },
              { name: "Roopkund Lake (4,800m)", href: "/explore/uttarakhand/chamoli/roopkund-trek" },
              { name: "Kashmir Great Lakes (4,190m)", href: "/explore/jammu-kashmir/kashmir/kashmir-great-lakes" },
              { name: "Tarsar Marsar (4,020m)", href: "/explore/jammu-kashmir/kashmir/tarsar-marsar" },
              { name: "Markha Valley (5,200m)", href: "/explore/ladakh/leh/markha-valley" },
              { name: "Pangong Tso (4,225m)", href: "/explore/ladakh/leh/pangong-tso" },
            ].map((trail) => (
              <Link
                key={trail.href}
                href={trail.href}
                className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-foreground/[0.03] hover:bg-foreground/[0.08] border border-foreground/[0.06] hover:border-primary/40 text-foreground/75 hover:text-foreground transition-all duration-200"
              >
                {trail.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mountain Safety & Trailhead Verification Note */}
        <div 
          className="mb-10 p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-foreground/80 font-light leading-relaxed">
              <strong className="text-foreground font-semibold">Mountain Safety &amp; Field Verification:</strong> Trail data across Discover Himalayan Trails is field-checked and ground-surveyed where explicitly marked &ldquo;Verified GPS&rdquo;. High-altitude Himalayan weather and pass conditions shift rapidly. Always independently verify live trail status with local forest departments and district authorities before departure.{" "}
              <Link href="/disclaimer" className="text-primary hover:underline font-mono font-medium">
                Read Mountain Disclaimer →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-foreground/[0.08]"
        >
          <div className="text-foreground/75 text-xs font-light">
            &copy; {new Date().getFullYear()} Discover Himalayan Trails. Designed for high-altitude explorers.
          </div>
          <div className="flex items-center gap-6 text-foreground/75 text-xs font-light">
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Legal Disclaimer</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
