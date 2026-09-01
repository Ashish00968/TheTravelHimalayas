import { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

interface SeoParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: SeoParams): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || absoluteUrl(SITE.ogImage);

  return {
    title: `${title} | ${SITE.name}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
