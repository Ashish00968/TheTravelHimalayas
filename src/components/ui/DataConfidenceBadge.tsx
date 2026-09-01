import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Clock, Info } from 'lucide-react';

export type ConfidenceLevel = 'Official' | 'Community report' | 'Estimated' | 'Historical';

interface DataConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export function DataConfidenceBadge({ level, className }: DataConfidenceBadgeProps) {
  const getStyles = (level: ConfidenceLevel) => {
    switch (level) {
      case 'Official':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Community report':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Estimated':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Historical':
        return 'bg-white/10 text-white/60 border-white/20';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getIcon = (level: ConfidenceLevel) => {
    switch (level) {
      case 'Official':
        return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
      case 'Community report':
        return <Info className="w-3 h-3 mr-1.5" />;
      case 'Estimated':
        return <AlertCircle className="w-3 h-3 mr-1.5" />;
      case 'Historical':
        return <Clock className="w-3 h-3 mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full border font-mono text-[11px] uppercase tracking-widest",
        getStyles(level),
        className
      )}
      title={`Data Confidence: ${level}`}
    >
      {getIcon(level)}
      {level}
    </span>
  );
}
