import Link from "next/link";
import { getSubRegion } from "@/data/atlas";
import { Compass, Mountain, MapPin } from "lucide-react";

interface RelatedContentProps {
  stateId: string;
  divisionId: string;
  currentPlaceId: string;
}

export function RelatedContent({ stateId, divisionId, currentPlaceId }: RelatedContentProps) {
  const subRegion = getSubRegion(stateId, divisionId);
  if (!subRegion) return null;

  const relatedPlaces = subRegion.places.filter(p => p.id !== currentPlaceId).slice(0, 3);
  
  if (relatedPlaces.length === 0) return null;

  return (
    <section className="mt-20 pt-10 border-t border-border">
      <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
        More in {subRegion.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPlaces.map((place) => {
          let Icon = MapPin;
          let typeLabel = "Destination";
          
          if (place.type === "trek") {
            Icon = Compass;
            typeLabel = "Trek";
          } else if (place.type === "peak") {
            Icon = Mountain;
            typeLabel = "Peak";
          }

          const link = `/explore/${stateId}/${divisionId}/${place.id}`;

          return (
            <Link 
              key={place.id}
              href={link}
              className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{typeLabel}</span>
              </div>
              <h3 className="text-lg font-display font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                {place.name}
              </h3>
              <p className="text-muted-foreground text-sm font-light line-clamp-2">
                {place.overview || place.experience || "Discover this breathtaking Himalayan destination."}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Contextual Expedition Planning & Authority Mesh */}
      <div className="mt-12 pt-8 border-t border-border/60">
        <h3 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-4">
          Expedition Preparation &amp; Trail Safety
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/safety"
            className="p-4 rounded-xl bg-card/60 hover:bg-card border border-border hover:border-primary/40 transition-all text-left group"
          >
            <span className="text-[11px] font-mono text-primary font-bold block mb-1">
              Altitude Protocol →
            </span>
            <span className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors block">
              AMS, HAPE &amp; Diamox Guide
            </span>
          </Link>
          <Link
            href="/plan/packing"
            className="p-4 rounded-xl bg-card/60 hover:bg-card border border-border hover:border-primary/40 transition-all text-left group"
          >
            <span className="text-[11px] font-mono text-primary font-bold block mb-1">
              Gear Checklist →
            </span>
            <span className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors block">
              Altitude Packing Generator
            </span>
          </Link>
          <Link
            href="/plan/season"
            className="p-4 rounded-xl bg-card/60 hover:bg-card border border-border hover:border-primary/40 transition-all text-left group"
          >
            <span className="text-[11px] font-mono text-primary font-bold block mb-1">
              Pass Status →
            </span>
            <span className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors block">
              12-Month Weather Matrix
            </span>
          </Link>
          <Link
            href="/map"
            className="p-4 rounded-xl bg-card/60 hover:bg-card border border-border hover:border-primary/40 transition-all text-left group"
          >
            <span className="text-[11px] font-mono text-primary font-bold block mb-1">
              3D Cartography →
            </span>
            <span className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors block">
              Interactive Topo Atlas
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
