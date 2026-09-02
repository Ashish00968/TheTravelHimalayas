import Link from "next/link";
import { ArrowUpRight, Globe, Send, Map, Mountain, Mail, Compass, Shield } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden" style={{ background: "#040812", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Ambient background glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
      />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter (Col 1-5) */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <div className="inline-block mb-6">
              <Logo variant="horizontal" size="md" glow={true} />
            </div>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-8 max-w-sm">
              The definitive English-language guide and geospatial atlas for high-altitude trekking, peak expeditions, and alpine exploration across the North Indian Himalayas.
            </p>

            {/* Newsletter - Simple visual placeholder for now as per rules "no newsletter before launch" unless strictly API */}
            <div 
              className="p-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h4 className="text-white/90 text-sm font-bold font-display mb-2">Join the Basecamp Dispatch</h4>
              <p className="text-white/40 text-xs font-light mb-4">Get seasonal route updates and permit changes.</p>
              <form className="flex items-center gap-2 group/form">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-all focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/15"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button 
                  type="button" 
                  className="p-2.5 rounded-xl text-white transition-all flex-shrink-0"
                  style={{ background: "#3B82F6", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Territories (Col 6-8) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              Territories
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/explore/himachal-pradesh" className="text-white/60 hover:text-[#F59E0B] text-sm font-light transition-colors flex items-center justify-between group">
                  Himachal Pradesh
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/uttarakhand" className="text-white/60 hover:text-[#0D9488] text-sm font-light transition-colors flex items-center justify-between group">
                  Uttarakhand
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/ladakh" className="text-white/60 hover:text-[#7C3AED] text-sm font-light transition-colors flex items-center justify-between group">
                  Ladakh
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/explore/jammu-kashmir" className="text-white/60 hover:text-[#3B82F6] text-sm font-light transition-colors flex items-center justify-between group">
                  Jammu &amp; Kashmir
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources (Col 9-10) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/guides" className="text-white/60 hover:text-white text-sm font-light transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" /> Field Guides
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-white/60 hover:text-white text-sm font-light transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Alpine Safety
                </Link>
              </li>
              <li>
                <Link href="/plan" className="text-white/60 hover:text-white text-sm font-light transition-colors flex items-center gap-2">
                  <Mountain className="w-3.5 h-3.5" /> Itinerary Planner
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-white/60 hover:text-white text-sm font-light transition-colors flex items-center gap-2">
                  <Map className="w-3.5 h-3.5" /> 3D Atlas
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect (Col 11-12) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-white/60 hover:text-white text-sm font-light transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm font-light transition-colors flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Social
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm font-light transition-colors flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Telegram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Development & Legal Disclaimer Box */}
        <div 
          className="mb-10 p-5 sm:p-6 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(13, 20, 34, 0.6)",
            border: "1px solid rgba(245, 158, 11, 0.25)"
          }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-white/50 font-light leading-relaxed">
              <strong className="text-amber-200/90 font-medium">Development Phase &amp; Legal Disclaimer:</strong> The Himalayan Trails is currently in an active development preview. All photography, location imagery, coordinates, and route metadata are illustrative placeholders for technical demonstration and may not reflect real-world locations or current terrain conditions. High-altitude trekking involves inherent dangers. Users must independently verify all route logistics with local authorities. The platform accepts no legal liability for expedition decisions or outcomes.{" "}
              <Link href="/terms" className="text-amber-400 hover:underline font-mono">
                Read Full Terms &amp; Disclaimer →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-white/30 text-xs font-light">
            &copy; {new Date().getFullYear()} The Himalayan Trails. Designed for high-altitude explorers.
          </div>
          <div className="flex items-center gap-6 text-white/30 text-xs font-light">
            <Link href="/terms" className="hover:text-white/60 transition-colors">Legal Disclaimer</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
