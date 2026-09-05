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
}: {
  size?: number;
  className?: string;
  glow?: boolean;
  framed?: boolean;
}) {
  const pixelSize = typeof size === "number" ? size : 48;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none rounded-full overflow-hidden transition-all duration-500 ease-out group-hover:scale-105",
        glow && "shadow-[0_0_20px_rgba(56,189,248,0.30)]",
        className
      )}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      <Image
        src="/brand/logo.webp"
        alt="Discover Himalayan Trails Emblem"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full object-contain rounded-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        priority
      />
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
      ? 34
      : size === "md"
      ? 44
      : size === "lg"
      ? 56
      : 72;

  const content = (
    <div className={cn("inline-flex items-center gap-1.5 sm:gap-3 group select-none shrink-0", className)}>
      <div className="sm:hidden">
        <LogoMark size={34} glow={glow} framed={framed} />
      </div>
      <div className="hidden sm:block">
        <LogoMark size={iconPixelSize} glow={glow} framed={framed} />
      </div>
      
      {variant === "horizontal" && (
        <div className="hidden min-[420px]:flex flex-col text-left justify-center">
          <span className="font-mono text-[7.5px] sm:text-[9px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.30em] text-amber-500 dark:text-amber-400 leading-none mb-0.5 sm:mb-1">
            DISCOVER
          </span>
          <span className="font-display font-black text-foreground tracking-[0.06em] sm:tracking-[0.10em] text-[12px] sm:text-[16px] leading-none group-hover:text-primary transition-colors drop-shadow-sm whitespace-nowrap">
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
