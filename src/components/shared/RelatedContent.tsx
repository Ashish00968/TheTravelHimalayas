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
    <section className="mt-20 pt-10 border-t border-white/10">
      <h2 className="text-2xl font-display font-semibold text-white mb-6">
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
              className="group block p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">{typeLabel}</span>
              </div>
              <h3 className="text-lg font-display font-medium text-white group-hover:text-primary transition-colors mb-2">
                {place.name}
              </h3>
              <p className="text-white/60 text-sm font-light line-clamp-2">
                {place.overview || place.experience || "Discover this breathtaking Himalayan destination."}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
