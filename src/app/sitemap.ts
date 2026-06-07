import { MetadataRoute } from "next";
import { treks } from "@/data/treks";
import { peaks } from "@/data/peaks";
import { dayHikes } from "@/data/day-hikes";
import { guides } from "@/data/guides";
import { regions } from "@/data/regions";

const BASE_URL = "https://thehimalayantrails.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/treks`, lastModified: new Date() },
    { url: `${BASE_URL}/peaks`, lastModified: new Date() },
    { url: `${BASE_URL}/day-hikes`, lastModified: new Date() },
    { url: `${BASE_URL}/guides`, lastModified: new Date() },
    { url: `${BASE_URL}/regions`, lastModified: new Date() },
    { url: `${BASE_URL}/gallery`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
  ];

  const trekRoutes = treks.map((trek) => ({
    url: `${BASE_URL}/treks/${trek.slug}`,
    lastModified: new Date(),
  }));

  const peakRoutes = peaks.map((peak) => ({
    url: `${BASE_URL}/peaks/${peak.slug}`,
    lastModified: new Date(),
  }));

  const dayHikeRoutes = dayHikes.map((hike) => ({
    url: `${BASE_URL}/day-hikes/${hike.slug}`,
    lastModified: new Date(),
  }));

  const guideRoutes = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
  }));

  const regionRoutes = regions.map((region) => ({
    url: `${BASE_URL}/regions/${region.slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...trekRoutes,
    ...peakRoutes,
    ...dayHikeRoutes,
    ...guideRoutes,
    ...regionRoutes,
  ];
}
