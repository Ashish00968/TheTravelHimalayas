import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface LastCheckedProps {
  date: string;
  className?: string;
}

export function LastChecked({ date, className }: LastCheckedProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] text-white/50 uppercase tracking-widest",
        className
      )}
      title={`Last verified on ${date}`}
    >
      <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
      Last checked: {date}
    </span>
  );
}
