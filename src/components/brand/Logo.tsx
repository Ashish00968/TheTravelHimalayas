import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "mark" | "horizontal" | "seal" | "avatar";
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  showTagline?: boolean;
  href?: string;
  glow?: boolean;
  framed?: boolean; // If true, frames the realistic peak inside a circular DP badge
}

export function LogoMark({
  size = 48,
  className,
  glow = true,
  framed = true,
}: {
  size?: number;
  className?: string;
  glow?: boolean;
  framed?: boolean;
}) {
  const pixelSize = typeof size === "number" ? size : 48;
  const mountainPixelSize = Math.round(pixelSize * (framed ? 0.82 : 1));

  if (framed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0 select-none rounded-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105",
          glow && "shadow-[0_0_24px_rgba(245,158,11,0.35)]",
          className
        )}
        style={{
          width: pixelSize,
          height: pixelSize,
          background: "radial-gradient(circle at 50% 35%, #151F32 0%, #080C14 65%, #020408 100%)",
          border: "1.5px solid rgba(245, 158, 11, 0.75)",
        }}
      >
        {/* Soft Golden Sunrise Alpenglow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 28%, rgba(254, 240, 138, 0.4) 0%, rgba(245, 158, 11, 0.18) 35%, transparent 65%)"
          }}
        />

        {/* Inner Dotted Golden Track */}
        <div className="absolute inset-[3px] rounded-full border border-amber-400/30 border-dashed pointer-events-none" />

        {/* Photorealistic Himalayan Peak with Bottom Mist Fade */}
        <div 
          className="relative flex items-center justify-center mt-1"
          style={{
            width: mountainPixelSize,
            height: mountainPixelSize,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 98%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 98%)",
          }}
        >
          <Image
            src="/mountain-transparent.png"
            alt="The Himalayan Trails Realistic Mountain Peak"
            width={mountainPixelSize}
            height={mountainPixelSize}
            className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.9)]"
            priority
          />
        </div>
      </div>
    );
  }

  // Standalone Transparent Realistic Peak
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none transition-transform duration-500 ease-out group-hover:scale-105",
        glow && "after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_20px_rgba(245,158,11,0.3)] after:pointer-events-none",
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: pixelSize,
          height: pixelSize,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Image
          src="/mountain-transparent.png"
          alt="The Himalayan Trails Mountain Peak"
          width={pixelSize}
          height={pixelSize}
          className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
          priority
        />
      </div>
    </div>
  );
}

export function Logo({
  variant = "horizontal",
  size = "md",
  className,
  showTagline = true,
  href = "/",
  glow = false,
  framed = true,
}: LogoProps) {
  const iconPixelSize =
    typeof size === "number"
      ? size
      : size === "sm"
      ? 38
      : size === "md"
      ? 48
      : size === "lg"
      ? 60
      : 76;

  const content = (
    <div className={cn("inline-flex items-center gap-3.5 group select-none", className)}>
      <LogoMark size={iconPixelSize} glow={glow} framed={framed} />
      
      {variant === "horizontal" && (
        <div className="flex flex-col text-left justify-center pt-0.5">
          <span className="font-serif font-bold text-slate-100 tracking-[0.08em] text-lg sm:text-[19px] leading-tight group-hover:text-amber-100 transition-colors drop-shadow-sm">
            THE HIMALAYAN TRAILS
          </span>
          {showTagline && (
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-amber-400/80 font-medium mt-0.5">
              Premium Expeditions
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-xl" 
        aria-label="The Himalayan Trails Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
