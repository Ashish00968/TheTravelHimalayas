import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoSealProps {
  size?: number;
  className?: string;
  glow?: boolean;
  withText?: boolean;
}

export function LogoSeal({
  size = 200,
  className,
  glow = true,
  withText = false,
}: LogoSealProps) {
  const mountainSize = Math.round(size * 0.72);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none group transition-all duration-700 ease-out hover:scale-[1.02]",
        glow && "after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_60px_rgba(245,158,11,0.25)] after:pointer-events-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* 1. Precision Outer Bezel & Base Plate */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: "radial-gradient(circle at 50% 30%, #151f32 0%, #080d17 60%, #030509 100%)",
          border: "2px solid rgba(245, 158, 11, 0.75)",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.7)"
        }}
      >
        {/* Soft Golden Sunrise Alpenglow behind Peak */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 28%, rgba(254, 240, 138, 0.38) 0%, rgba(245, 158, 11, 0.16) 38%, transparent 70%)"
          }}
        />

        {/* Minimal Inner Precision Hairline Ring */}
        <div 
          className="absolute inset-[5px] rounded-full pointer-events-none"
          style={{
            border: "1px solid rgba(245, 158, 11, 0.25)"
          }}
        />

        {/* Optional Clean Arched Brand Name if withText is true */}
        {withText && (
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          >
            <path id="sealCleanArc" d="M 32,100 A 68,68 0 1,1 168,100" />
            <text fill="#FEF08A" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="8" fontWeight="700" letterSpacing="3" opacity="0.9">
              <textPath href="#sealCleanArc" startOffset="50%" textAnchor="middle">
                THE HIMALAYAN TRAILS
              </textPath>
            </text>
          </svg>
        )}
      </div>

      {/* 2. Iconic Ama Dablam Peak Rising with Bottom Mist Fade */}
      <div 
        className="relative z-10 flex items-center justify-center mt-2"
        style={{
          width: mountainSize,
          height: mountainSize,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 98%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 98%)",
        }}
      >
        <Image
          src="/mountain-logo.png"
          alt="The Himalayan Trails Ama Dablam Peak"
          width={mountainSize}
          height={mountainSize}
          className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
          priority
        />
      </div>
    </div>
  );
}
