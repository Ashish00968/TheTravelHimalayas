import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ContentCardProps {
  title: string;
  slug: string;
  basePath: string;
  image?: string;
  description: string;
  badges?: string[];
  meta?: { label: string; value: string }[];
}

export function ContentCard({
  title,
  slug,
  basePath,
  description,
  badges,
  meta,
}: ContentCardProps) {
  return (
    <Link
      href={`${basePath}/${slug}`}
      className="group block relative p-7 rounded-2xl bg-card hover:bg-card/80 border border-border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((badge) => (
              <span
                key={badge}
                className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium font-mono"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 font-light">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
        {meta && meta.length > 0 ? (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {meta.map((m, i) => (
              <span key={m.label} className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground">{m.value}</span>
                {i < meta.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                )}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
          Read Guide <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
