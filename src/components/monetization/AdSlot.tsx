interface AdSlotProps {
  position?: "banner" | "sidebar" | "inline";
}

export function AdSlot({ position = "inline" }: AdSlotProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center justify-center min-h-[90px] text-foreground/30 text-xs">
      <span>Ad Slot — {position}</span>
    </div>
  );
}
