import { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

interface SeoParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

/**
 * Truncates text cleanly on word boundaries to fit meta description limits (140-155 chars)
 * without cutting words or punctuation in half.
 */
export function truncateDescription(text: string, maxLen = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  
  const cut = clean.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.65) {
    const trimmed = cut.slice(0, lastSpace).replace(/[,;:\s]+$/, "");
    return `${trimmed}...`;
  }
  return `${cut.replace(/[,;:\s]+$/, "")}...`;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  keywords,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: SeoParams): Metadata {
  const url = absoluteUrl(path);
  // Strip duplicate brand name if passed in the title so layout.tsx's template handles it cleanly once
  const cleanTitle = title.replace(/\s*\|\s*Discover Himalayan Trails.*$/i, "").trim();
  
  // Clean description to avoid mid-sentence clipping
  const cleanDescription = truncateDescription(description, 158);

  const rawImage = image || SITE.ogImage;
  const ogImage = rawImage.startsWith("http") ? rawImage : absoluteUrl(rawImage);

  return {
    title: cleanTitle,
    description: cleanDescription,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: `${cleanTitle} | ${SITE.name}`,
      description: cleanDescription,
      url,
      siteName: SITE.name,
      type,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${cleanTitle} — Discover Himalayan Trails`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | ${SITE.name}`,
      description: cleanDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
          },
        },
  };
}
