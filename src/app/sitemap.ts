import { MetadataRoute } from "next";
import { himalayaAtlas } from "@/data/atlas";
import { guides } from "@/data/guides";
import { SITE } from "@/lib/site";

const BASE_URL = SITE.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/safety`, lastModified: new Date() },
    { url: `${BASE_URL}/guides`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
  ];

  const stateRoutes: MetadataRoute.Sitemap = [];
  const divisionRoutes: MetadataRoute.Sitemap = [];
  const placeRoutes: MetadataRoute.Sitemap = [];

  himalayaAtlas.forEach((region) => {
    stateRoutes.push({
      url: `${BASE_URL}/explore/${region.id}`,
      lastModified: new Date(),
    });

    region.subregions.forEach((sub) => {
      divisionRoutes.push({
        url: `${BASE_URL}/explore/${region.id}/${sub.id}`,
        lastModified: new Date(),
      });

      sub.places.forEach((place) => {
        placeRoutes.push({
          url: `${BASE_URL}/explore/${region.id}/${sub.id}/${place.id}`,
          lastModified: new Date(),
        });
      });
    });
  });

  const guideRoutes = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...stateRoutes,
    ...divisionRoutes,
    ...placeRoutes,
    ...guideRoutes,
  ];
}
