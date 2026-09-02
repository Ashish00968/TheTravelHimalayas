import { MetadataRoute } from "next";
import { himalayaAtlas } from "@/data/atlas";
import { guides } from "@/data/guides";
import { SITE } from "@/lib/site";

const BASE_URL = SITE.url;

export default function sitemap(): MetadataRoute.Sitemap {
  // Single timestamp for the entire sitemap — prevents CDN cache-busting on every request
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/map`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/guides`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/safety`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/plan`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/brand`, lastModified, changeFrequency: "monthly", priority: 0.3 },
  ];

  const stateRoutes: MetadataRoute.Sitemap = [];
  const divisionRoutes: MetadataRoute.Sitemap = [];
  const placeRoutes: MetadataRoute.Sitemap = [];

  for (const region of himalayaAtlas) {
    stateRoutes.push({
      url: `${BASE_URL}/explore/${region.id}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    });

    for (const sub of region.subregions) {
      divisionRoutes.push({
        url: `${BASE_URL}/explore/${region.id}/${sub.id}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.75,
      });

      for (const place of sub.places) {
        placeRoutes.push({
          url: `${BASE_URL}/explore/${region.id}/${sub.id}/${place.id}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.65,
        });
      }
    }
  }

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...stateRoutes,
    ...divisionRoutes,
    ...placeRoutes,
    ...guideRoutes,
  ];
}
