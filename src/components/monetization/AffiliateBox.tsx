import { CloudinaryImage } from "@/components/media/CloudinaryImage";

interface AffiliateBoxProps {
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

export function AffiliateBox({
  image,
  title,
  description,
  ctaText,
  ctaUrl,
}: AffiliateBoxProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex gap-4 items-center">
      <div className="w-20 h-20 relative flex-shrink-0">
        <CloudinaryImage
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-foreground/70 mt-1">{description}</p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-2 text-sm text-primary hover:underline min-h-[44px]"
        >
          {ctaText} →
        </a>
      </div>
    </div>
  );
}
