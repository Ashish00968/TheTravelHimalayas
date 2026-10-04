import { Suspense } from "react";
import { Metadata } from "next";
import { PageTransition } from "@/components/animation/PageTransition";
import { MapLauncher } from "@/components/maps/MapLauncher";
import { treks } from "@/data/treks";
import { generatePageMetadata } from "@/lib/seo";
import { buildWebApplicationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = generatePageMetadata({

  title: "Interactive Himalayan 3D Map Atlas — Satellite Terrain, Trails & Passes",
  description:
    "Navigate the Indian Himalayas in interactive 3D satellite terrain. Explore trailheads, mountain passes, campsites, and summit routes with elevation profiles across Himachal, Kashmir, Ladakh, and Uttarakhand.",
  path: "/map",
  keywords: [
    "Himalayan 3D map",
    "interactive mountain terrain map",
    "Mapbox 3D Himalayas",
    "Himalayan trekking trail map",
    "satellite topography Indian Himalayas",
  ],
});

export default function MapPage() {
  const webAppSchema = buildWebApplicationJsonLd({
    name: "Interactive Himalayan 3D Atlas",
    description:
      "High-resolution 3D geospatial exploration platform visualizing Himalayan topography, trekking routes, and mountain passes.",
    url: "/map",
    applicationCategory: "MapApplication",
    featureList: [
      "1.85x exaggerated 3D satellite DEM terrain",
      "Interactive trailheads, passes, and high camps",
      "Elevation milestones and valley coordinates",
      "Full-screen expedition focus modes",
    ],
  });

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "3D Map Atlas", href: "/map" },
  ]);

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <h1 className="sr-only">Interactive Himalayan 3D Map Atlas — Satellite Terrain & Trails</h1>
      <div className="w-full px-2 sm:px-4 lg:px-6 pt-2 pb-6">
        <Suspense
          fallback={
            <div className="w-full h-[calc(100vh-6.5rem)] rounded-2xl sm:rounded-3xl bg-surface border border-white/10 flex items-center justify-center animate-pulse">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          }
        >
          <MapLauncher treks={treks} />
        </Suspense>
      </div>
    </PageTransition>
  );
}

