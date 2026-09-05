import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, HeartPulse, PhoneCall } from "lucide-react";


interface GoldenRulesCalloutProps {
  maxAltitude?: string;
}

export function GoldenRulesCallout({ maxAltitude }: GoldenRulesCalloutProps) {
  return (
    <div className="my-10 rounded-3xl p-6 sm:p-8 bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/25 relative overflow-hidden shadow-sm">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs uppercase font-bold tracking-widest text-amber-500">
              Himalayan Alpine Medicine Protocol
            </span>
            {maxAltitude && (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold">
                Altitude: {maxAltitude}
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground">
            The Three Golden Rules of Altitude Safety
          </h3>

          <ol className="space-y-2 text-sm text-foreground/80 font-light list-none">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong className="font-medium text-foreground">Rule 1:</strong> Any headache or illness above 2,500m is Acute Mountain Sickness (AMS) until proven otherwise.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong className="font-medium text-foreground">Rule 2:</strong> Never ascend to sleep at a higher campsite with symptoms of altitude sickness.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                <strong className="font-medium text-foreground">Rule 3:</strong> If symptoms worsen, or if ataxia (loss of balance) or breathlessness at rest appears, descend immediately.
              </span>
            </li>
          </ol>
        </div>

        <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5">
          <Link
            href="/safety"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-500 font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-sm min-h-[44px]"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Clinical AMS Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="tel:112"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-sm min-h-[44px]"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency SAR (112)</span>
          </a>
        </div>

      </div>
    </div>
  );
}
