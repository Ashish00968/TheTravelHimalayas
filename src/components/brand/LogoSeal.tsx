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
}: LogoSealProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none group transition-all duration-700 ease-out hover:scale-[1.02] rounded-full overflow-hidden",
        glow && "shadow-[0_0_50px_rgba(56,189,248,0.30)]",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo-512.webp"
        alt="Discover Himalayan Trails Official Seal"
        width={size}
        height={size}
        className="w-full h-full object-contain rounded-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
        priority
      />
    </div>
  );
}
