"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { LogoSeal } from "@/components/brand/LogoSeal";
import { ArrowLeft, Download, Sparkles, CheckCircle2 } from "lucide-react";

export default function BrandAssetPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownloadDp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // Draw background circle
    const center = size / 2;
    const radius = size / 2 - 20;

    // Outer dark radial gradient
    const bgGrad = ctx.createRadialGradient(center, center * 0.7, 0, center, center, radius);
    bgGrad.addColorStop(0, "#151f32");
    bgGrad.addColorStop(0.65, "#080d17");
    bgGrad.addColorStop(1, "#030509");

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Golden sunrise alpenglow in upper center
    const glowGrad = ctx.createRadialGradient(center, center * 0.65, 0, center, center * 0.65, radius * 0.7);
    glowGrad.addColorStop(0, "rgba(254, 240, 138, 0.45)");
    glowGrad.addColorStop(0.35, "rgba(245, 158, 11, 0.2)");
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Outer gold metallic bezel
    ctx.lineWidth = 14;
    const goldGrad = ctx.createLinearGradient(0, 0, size, size);
    goldGrad.addColorStop(0, "#FFFBEB");
    goldGrad.addColorStop(0.3, "#FDE68A");
    goldGrad.addColorStop(0.6, "#F59E0B");
    goldGrad.addColorStop(1, "#B45309");
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    // Inner gold hairline ring
    ctx.beginPath();
    ctx.arc(center, center, radius - 24, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.stroke();

    // Draw Mountain Peak (Ama Dablam)
    const img = new (window as unknown as { Image: new () => HTMLImageElement }).Image();
    img.crossOrigin = "anonymous";
    img.src = "/mountain-transparent.png";
    img.onload = () => {
      const mountainSize = size * 0.72;
      const x = (size - mountainSize) / 2;
      const y = (size - mountainSize) / 2 + 30;

      // Clip to circular badge before drawing mountain
      ctx.beginPath();
      ctx.arc(center, center, radius - 10, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(img, x, y, mountainSize, mountainSize);
      ctx.restore();

      // Trigger download
      const link = document.createElement("a");
      link.download = "discover-himalayan-trails-instagram-dp.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <main className="min-h-screen pt-28 pb-20 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-8 text-xs font-mono font-bold uppercase tracking-[0.15em]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Basecamp
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span className="font-mono text-xs text-[#F59E0B] uppercase tracking-[0.25em] font-semibold">
              Brand Identity &amp; Profile Assets
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Discover Himalayan Trails Logo &amp; DP
          </h1>
          <p className="text-foreground/70 text-base sm:text-lg max-w-2xl font-light">
            Streamlined, modern, and professional brand identity featuring the iconic Ama Dablam summit framed in brushed gold with atmospheric sunrise alpenglow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Instagram DP Card */}
          <div 
            className="lg:col-span-7 p-8 rounded-3xl flex flex-col items-center justify-between text-center glass-museum-card border border-amber-500/30 shadow-xl"
          >
            <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-foreground/[0.08] text-xs text-foreground/50 font-mono">
              <span className="flex items-center gap-2 text-[#F59E0B] font-bold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                Instagram Profile Picture (DP)
              </span>
              <span>1080 × 1080 HD</span>
            </div>

            {/* Simulated Instagram Story Ring */}
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] mb-8 shadow-2xl">
              <div className="p-1 bg-surface dark:bg-[#080e1a] rounded-full">
                <LogoSeal size={220} glow={true} />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                Ama Dablam Minimalist Emblem
              </h3>
              <p className="text-foreground/60 text-xs sm:text-sm max-w-md font-light leading-relaxed">
                Free of cluttered arched text, designed to remain razor-sharp and instantly recognizable at small 110px mobile app icon sizes.
              </p>
            </div>

            {/* Hidden canvas for PNG generation */}
            <canvas ref={canvasRef} className="hidden" />

            <button
              onClick={handleDownloadDp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-display font-bold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Instagram DP (1080×1080 PNG)
            </button>
          </div>

          {/* Guidelines & Specs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div 
              className="p-6 rounded-3xl glass-museum-card border border-foreground/[0.08] shadow-md"
            >
              <h4 className="font-display font-bold text-foreground text-base mb-4">
                What Changed
              </h4>
              <ul className="space-y-3 text-xs text-foreground/70 font-light leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span><strong>Removed busy curved text:</strong> Deleted &quot;EST. 2026 • PREMIUM EXPEDITIONS&quot; which cluttered the mark.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span><strong>Ama Dablam Hero:</strong> Maximized the mountain silhouette with mist fade for high visual contrast.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span><strong>Pure Brushed Gold Rim:</strong> Replaced dotted dashed lines with a solid precision metallic ring.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span><strong>Sculpted Luxury Typography:</strong> Sculpted navbar brand to authoritative &quot;DISCOVER HIMALAYAN TRAILS&quot;.</span>
                </li>
              </ul>
            </div>

            {/* Navbar Format Preview */}
            <div 
              className="p-6 rounded-3xl glass-museum-card border border-foreground/[0.08] shadow-md"
            >
              <h4 className="font-display font-bold text-foreground text-base mb-4">
                Header &amp; Navbar Format
              </h4>
              <div className="p-4 rounded-2xl bg-card border border-foreground/[0.08] flex items-center justify-center">
                <Logo variant="horizontal" size="md" glow={true} />
              </div>
            </div>

            {/* Standalone Mark */}
            <div 
              className="p-6 rounded-3xl glass-museum-card border border-foreground/[0.08] shadow-md"
            >
              <h4 className="font-display font-bold text-foreground text-base mb-4">
                App Icon Mark
              </h4>
              <div className="flex items-center justify-center gap-6 py-2">
                <LogoMark size={44} glow={true} />
                <LogoMark size={56} glow={true} />
                <LogoMark size={72} glow={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
