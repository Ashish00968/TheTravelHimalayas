import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoSealProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export function LogoSeal({
  size = 200,
  className,
  glow = true,
}: LogoSealProps) {
  const mountainSize = Math.round(size * 0.54);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none group transition-transform duration-700 ease-out hover:scale-[1.03]",
        glow && "after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_50px_rgba(245,158,11,0.25)] after:pointer-events-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* 1. Base Plate & Circular Typography Frame (Behind Mountain) */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="sealRealBgFinal" cx="100" cy="100" r="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#151F32" />
            <stop offset="65%" stopColor="#080C14" />
            <stop offset="100%" stopColor="#020408" />
          </radialGradient>
          <linearGradient id="sealRealGoldFinal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <path id="sealRealArcTopFinal" d="M 24,100 A 76,76 0 1,1 176,100" />
          <path id="sealRealArcBottomFinal" d="M 176,100 A 76,76 0 0,1 24,100" />
        </defs>

        {/* Outer Solid Dark Base Plate */}
        <circle cx="100" cy="100" r="98" fill="#000000" opacity="0.8" />
        <circle cx="100" cy="100" r="96" fill="url(#sealRealBgFinal)" />

        {/* Outer Precision Bezel Rings */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#sealRealGoldFinal)" strokeWidth="2" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="#F59E0B" strokeWidth="0.75" strokeDasharray="2.5 2.5" opacity="0.5" />

        {/* Arched Roman Typography */}
        <text fill="#FEF08A" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="8.5" fontWeight="700" letterSpacing="3.2" opacity="0.95">
          <textPath href="#sealRealArcTopFinal" startOffset="50%" textAnchor="middle">
            THE HIMALAYAN TRAILS
          </textPath>
        </text>
        <text fill="#E2E8F0" fontFamily="'Inter', sans-serif" fontSize="6.5" fontWeight="600" letterSpacing="2.8" opacity="0.85">
          <textPath href="#sealRealArcBottomFinal" startOffset="50%" textAnchor="middle">
            ★ EST. 2026 • PREMIUM EXPEDITIONS ★
          </textPath>
        </text>

        {/* Inner Gold Frame */}
        <circle cx="100" cy="100" r="62" fill="none" stroke="url(#sealRealGoldFinal)" strokeWidth="1.5" />
      </svg>

      {/* 2. Sunrise Backdrop Glow in Center */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.58,
          height: size * 0.58,
          background: "radial-gradient(circle at 50% 28%, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.2) 38%, transparent 70%)",
        }}
      />

      {/* 3. Photorealistic Mountain Peak with Bottom Mist Fade */}
      <div 
        className="relative z-10 flex items-center justify-center mt-1"
        style={{
          width: mountainSize,
          height: mountainSize,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 96%)",
        }}
      >
        <Image
          src="/mountain-transparent.png"
          alt="The Himalayan Trails Real Peak Seal"
          width={mountainSize}
          height={mountainSize}
          className="object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)]"
          priority
        />
      </div>
    </div>
  );
}
