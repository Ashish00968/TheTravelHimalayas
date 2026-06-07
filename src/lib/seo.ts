import { Metadata } from "next";

interface SeoParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

const BASE_URL = "https://thehimalayantrails.com";

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: SeoParams): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/og-default.jpg`;

  return {
    title: `${title} | TheHimalayanTrails`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
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
