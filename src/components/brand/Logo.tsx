import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "mark" | "horizontal" | "seal" | "avatar";
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  showTagline?: boolean;
  tagline?: string;
  href?: string | null;
  glow?: boolean;
  framed?: boolean;
}

/**
 * Precision Alpine Summit Mark
 * Combines a multi-faceted vector geometric Himalayan massif with the iconic Ama Dablam summit
 * and an 8-pointed golden alpine compass star.
 */
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
          "relative flex items-center justify-center shrink-0 select-none rounded-full overflow-hidden transition-all duration-500 ease-out group-hover:scale-105",
          glow && "shadow-[0_0_24px_rgba(245,158,11,0.3)]",
          className
        )}
        style={{
          width: pixelSize,
          height: pixelSize,
          background: "radial-gradient(circle at 50% 32%, #141e30 0%, #080c14 65%, #03050a 100%)",
          border: "1.5px solid rgba(245, 158, 11, 0.75)",
        }}
      >
        {/* Atmospheric Sunrise Alpenglow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 22%, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.20) 40%, transparent 72%)"
          }}
        />

        {/* Minimal Hairline Golden Ring */}
        <div className="absolute inset-[2px] rounded-full border border-amber-400/25 pointer-events-none" />

        {/* Scaled Mountain Peak with Mist Fade */}
        <div 
          className="relative flex items-center justify-center mt-1"
          style={{
            width: mountainPixelSize,
            height: mountainPixelSize,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 98%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 98%)",
          }}
        >
          <Image
            src="/mountain-logo.png"
            alt="Discover Himalayan Trails Iconic Peak"
            width={mountainPixelSize}
            height={mountainPixelSize}
            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
            priority
          />
        </div>

        {/* Summit Golden Compass Star Accent */}
        <div 
          className="absolute top-[18%] left-1/2 -translate-x-1/2 w-2 h-2 pointer-events-none opacity-90 drop-shadow-[0_0_6px_rgba(254,240,138,0.9)]"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
            <polygon points="8,0 9.8,5.8 16,8 9.8,10.2 8,16 6.2,10.2 0,8 6.2,5.8" fill="#FEF08A" />
            <circle cx="8" cy="8" r="1.5" fill="#F59E0B" />
          </svg>
        </div>
      </div>
    );
  }

  // Standalone Transparent Realistic Peak
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none transition-transform duration-500 ease-out group-hover:scale-105",
        glow && "after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_20px_rgba(245,158,11,0.25)] after:pointer-events-none",
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
          src="/mountain-logo.png"
          alt="Discover Himalayan Trails Mountain Peak"
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
  showTagline = false,
  tagline = "ALPINE GEOSPATIAL ATLAS",
  href = "/",
  glow = false,
  framed = true,
}: LogoProps) {
  const iconPixelSize =
    typeof size === "number"
      ? size
      : size === "sm"
      ? 36
      : size === "md"
      ? 44
      : size === "lg"
      ? 56
      : 72;

  const content = (
    <div className={cn("inline-flex items-center gap-2 sm:gap-3 group select-none", className)}>
      <LogoMark size={iconPixelSize} glow={glow} framed={framed} />
      
      {variant === "horizontal" && (
        <div className="flex flex-col text-left justify-center">
          <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.24em] sm:tracking-[0.30em] text-amber-500 dark:text-amber-400 leading-none mb-1">
            DISCOVER
          </span>
          <span className="font-display font-black text-foreground tracking-[0.06em] sm:tracking-[0.10em] text-[13px] sm:text-[16px] leading-none group-hover:text-primary transition-colors drop-shadow-sm whitespace-nowrap">
            HIMALAYAN TRAILS
          </span>
          {showTagline && (
            <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.20em] text-foreground/50 font-semibold mt-1 whitespace-nowrap">
              {tagline}
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
        aria-label="Discover Himalayan Trails Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
