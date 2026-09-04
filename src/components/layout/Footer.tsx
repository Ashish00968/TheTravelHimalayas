import Link from "next/link";
import { ArrowUpRight, Globe, Send, Map, Mountain, Mail, Compass, Shield, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-12 overflow-hidden bg-background border-t border-slate-200/60 dark:border-white/[0.06] transition-colors duration-300">
      {/* Ambient background glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-primary/20"
      />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Mission (Col 1-5) */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <div className="inline-block mb-6">
              <Logo variant="horizontal" size="md" glow={true} />
            </div>
            <p className="text-foreground/70 text-sm font-light leading-relaxed mb-8 max-w-sm">
              The definitive English-language guide and geospatial atlas for high-altitude trekking, peak expeditions, and alpine exploration across the North Indian Himalayas.
            </p>

            {/* Authority Verification Badge */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Authoritative Field Atlas</span>
              </div>
              <p className="text-foreground/60 text-xs font-light leading-relaxed">
                Independent, verified trail telemetry covering Himachal Pradesh, Uttarakhand, Ladakh, and Jammu &amp; Kashmir.
              </p>
            </div>
          </div>

          {/* Territories (Col 6-8) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-foreground/50">
              Territories
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/explore/himachal-pradesh" className="text-foreground/70 hover:text-[#F59E0B] text-sm font-light transition-colors flex items-center justify-between group">
                  Himachal Pradesh
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/uttarakhand" className="text-foreground/70 hover:text-[#0D9488] text-sm font-light transition-colors flex items-center justify-between group">
                  Uttarakhand
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/ladakh" className="text-foreground/70 hover:text-[#7C3AED] text-sm font-light transition-colors flex items-center justify-between group">
                  Ladakh
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/jammu-kashmir" className="text-foreground/70 hover:text-[#3B82F6] text-sm font-light transition-colors flex items-center justify-between group">
                  Jammu &amp; Kashmir
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources (Col 9-10) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-foreground/50">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/guides" className="text-foreground/70 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" /> Field Guides
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-foreground/70 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Alpine Safety
                </Link>
              </li>
              <li>
                <Link href="/plan" className="text-foreground/70 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Mountain className="w-3.5 h-3.5" /> Itinerary Planner
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-foreground/70 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Map className="w-3.5 h-3.5" /> 3D Atlas
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect (Col 11-12) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-foreground/50">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-foreground/70 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Social
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm font-light transition-colors flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Telegram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Development & Legal Disclaimer Box */}
        <div 
          className="mb-10 p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-amber-500/30 bg-amber-500/[0.06] dark:bg-[#0d1422]/60"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-foreground/70 font-light leading-relaxed">
              <strong className="text-amber-600 dark:text-amber-300 font-semibold">Development Phase &amp; Legal Disclaimer:</strong> Discover Himalayan Trails is currently in an active development preview. All photography, location imagery, coordinates, and route metadata are illustrative placeholders for technical demonstration and may not reflect real-world locations or current terrain conditions. High-altitude trekking involves inherent dangers. Users must independently verify all route logistics with local authorities. The platform accepts no legal liability for expedition decisions or outcomes.{" "}
              <Link href="/disclaimer" className="text-amber-600 dark:text-amber-400 hover:underline font-mono font-medium">
                Read Full Terms &amp; Disclaimer →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-foreground/[0.08]"
        >
          <div className="text-foreground/50 text-xs font-light">
            &copy; {new Date().getFullYear()} Discover Himalayan Trails. Designed for high-altitude explorers.
          </div>
          <div className="flex items-center gap-6 text-foreground/50 text-xs font-light">
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Legal Disclaimer</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
