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
  framed?: boolean; // If true, frames the peak inside a clean circular badge
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
  const mountainPixelSize = Math.round(pixelSize * (framed ? 0.84 : 1));

  if (framed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0 select-none rounded-full overflow-hidden transition-all duration-500 ease-out group-hover:scale-105",
          glow && "shadow-[0_0_24px_rgba(245,158,11,0.25)]",
          className
        )}
        style={{
          width: pixelSize,
          height: pixelSize,
          background: "radial-gradient(circle at 50% 32%, #141e30 0%, #080c14 65%, #03050a 100%)",
          border: "1.5px solid rgba(245, 158, 11, 0.65)",
        }}
      >
        {/* Atmospheric Sunrise Alpenglow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 25%, rgba(254, 240, 138, 0.35) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 70%)"
          }}
        />

        {/* Minimal Hairline Golden Ring */}
        <div className="absolute inset-[2px] rounded-full border border-amber-400/20 pointer-events-none" />

        {/* Ama Dablam Mountain Peak with Mist Fade */}
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
            alt="The Himalayan Trails Iconic Peak"
            width={mountainPixelSize}
            height={mountainPixelSize}
            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
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
  showTagline = false,
  tagline = "HIMALAYAN ATLAS",
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
          <span className="font-display font-bold text-foreground tracking-[0.06em] sm:tracking-[0.12em] text-[13px] sm:text-[17px] leading-none group-hover:text-primary transition-colors drop-shadow-sm whitespace-nowrap">
            THE HIMALAYAN TRAILS
          </span>
          {showTagline && (
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-amber-500 dark:text-amber-400 font-semibold mt-1 whitespace-nowrap">
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
        aria-label="The Himalayan Trails Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
