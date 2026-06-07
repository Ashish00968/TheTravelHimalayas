import { CloudinaryImage } from "@/components/media/CloudinaryImage";

interface HeroSectionProps {
  title: string;
  image: string;
  subtitle?: string;
}

export function HeroSection({ title, image, subtitle }: HeroSectionProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-end">
      <CloudinaryImage
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="relative container mx-auto px-4 pb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-foreground/80 mt-4 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
