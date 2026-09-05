import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#040812",
    theme_color: "#040812",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/mountain-logo.png",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Explore Himalayan Atlas",
        short_name: "Atlas",
        description: "Explore 50+ verified high-altitude treks and summits",
        url: "/explore",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
      {
        name: "3D Satellite Terrain Map",
        short_name: "3D Map",
        description: "Interactive 3D geospatial mountain terrain",
        url: "/map",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
      {
        name: "Mountain Medicine & Safety",
        short_name: "Safety",
        description: "AMS, HAPE, HACE clinical guidelines & acclimatization rules",
        url: "/safety",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
      {
        name: "Trek Finder",
        short_name: "Finder",
        description: "Filter trails by altitude, difficulty, and season",
        url: "/plan/trek-finder",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
    ],
  };
}
