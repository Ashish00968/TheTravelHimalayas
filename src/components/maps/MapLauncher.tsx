"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { GlobalMap } from "@/components/maps";
import { Trek } from "@/data/types";

interface MapLauncherProps {
  treks: Trek[];
}

export function MapLauncher({ treks }: MapLauncherProps) {
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");

  return (
    <div className="w-full h-full relative">
      <GlobalMap treks={treks} initialFocusId={focusParam} />
    </div>
  );
}
