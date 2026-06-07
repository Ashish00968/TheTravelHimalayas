import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { MotionCard } from "@/components/animation/MotionCard";

interface ContentCardProps {
  title: string;
  slug: string;
  basePath: string;
  image: string;
  description: string;
  badges?: string[];
  meta?: { label: string; value: string }[];
}

export function ContentCard({ title, slug, basePath, image, description, badges, meta }: ContentCardProps) {
  return (
    <MotionCard>
      <Link href={`${basePath}/${slug}`} className="block glass-card rounded-xl overflow-hidden group">
        <div className="aspect-[16/10] relative overflow-hidden">
          <CloudinaryImage src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-foreground/70 line-clamp-2">{description}</p>
          {badges && (
            <div className="flex flex-wrap gap-2 mt-3">
              {badges.map((badge) => (
                <span key={badge} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{badge}</span>
              ))}
            </div>
          )}
          {meta && (
            <div className="flex gap-4 mt-3 text-xs text-foreground/60">
              {meta.map((m) => (
                <span key={m.label}>{m.label}: {m.value}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </MotionCard>
  );
}
