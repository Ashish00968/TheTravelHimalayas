import { himalayaAtlas } from "@/data/atlas";
import { guides } from "@/data/guides";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Escapes characters that have special meaning in XML.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Strips markdown syntax to produce clean, plain text for descriptions.
 */
function cleanMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // Italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Code
    .replace(/^\s*[-*+]\s+/gm, "") // List bullets
    .replace(/^\s*\d+\.\s+/gm, "") // Numbered lists
    .replace(/\|[^\n]+\|/g, "") // Tables
    .replace(/\n+/g, " ") // Collapse whitespace
    .trim();
}

/**
 * Derives MIME type from image URL.
 */
function getImageMimeType(url: string): string {
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".png")) return "image/png";
  if (cleanUrl.endsWith(".webp")) return "image/webp";
  if (cleanUrl.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

interface RssFeedItem {
  title: string;
  link: string;
  guid: string;
  description: string;
  pubDate: string;
  category?: string;
  imageUrl?: string;
}

// Editorial feature stories from the Himalayan Field Dispatches
const FEATURED_STORIES = [
  {
    id: "story-1",
    title: "Crossing the Hampta: When Lush Pine Forests Give Way to the Cold Desert",
    slug: "crossing-hampta-pass-monsoon",
    excerpt:
      "A transition so abrupt it feels geological. Within four hours, the sodden meadows of Jobra dissolve into the bone-dry moonscape of Chandra Valley, Spiti.",
    date: new Date("2025-08-15T06:00:00Z").toUTCString(),
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=75",
    category: "Himachal Pradesh",
  },
  {
    id: "story-2",
    title: "The Seven Hidden Turquoise Basins: An Alpine Traverse of Kashmir",
    slug: "seven-hidden-turquoise-basins-kashmir",
    excerpt:
      "Vishansar, Kishansar, and Gadsar. Beyond the reach of motorable roads, Kashmir's glacial cirques reflect clouds at 4,000 meters in complete, untouched isolation.",
    date: new Date("2025-07-20T06:00:00Z").toUTCString(),
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=75",
    category: "Jammu & Kashmir",
  },
  {
    id: "story-3",
    title: "Beyond the Khardung La: Solitude Across the Ancient Kingdom of Zanskar",
    slug: "solitude-across-ancient-zanskar",
    excerpt:
      "Centuries-old monasteries perched like raptors on sheer cliffs. Navigating the frozen rivers and remote gorges of high-altitude trans-Himalayan Ladakh.",
    date: new Date("2025-09-10T06:00:00Z").toUTCString(),
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=75",
    category: "Ladakh",
  },
  {
    id: "story-4",
    title: "In the Shadow of Nanda Devi: The Sacred Sanctuaries of Garhwal",
    slug: "in-the-shadow-of-nanda-devi",
    excerpt:
      "Trekking the outer rim of India's second-highest summit. Alpine rhododendron groves give way to granite walls that scrape the stratosphere at 7,816 meters.",
    date: new Date("2025-06-18T06:00:00Z").toUTCString(),
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=75",
    category: "Uttarakhand",
  },
];

export async function GET(): Promise<Response> {
  // Stable build-time publication timestamp
  const buildDate = new Date("2026-03-01T00:00:00Z").toUTCString();
  const feedItems: RssFeedItem[] = [];

  // 1. Editorial Field Dispatches / Stories
  for (const story of FEATURED_STORIES) {
    feedItems.push({
      title: story.title,
      link: absoluteUrl("/stories"),
      guid: `${absoluteUrl("/stories")}#${story.slug}`,
      description: story.excerpt,
      pubDate: story.date,
      category: story.category,
      imageUrl: story.image,
    });
  }

  // 2. Authoritative Alpine Guides
  for (const guide of guides) {
    const rawDesc = guide.description || guide.content.slice(0, 300);
    feedItems.push({
      title: guide.title,
      link: absoluteUrl(`/guides/${guide.slug}`),
      guid: absoluteUrl(`/guides/${guide.slug}`),
      description: cleanMarkdown(rawDesc),
      pubDate: buildDate,
      category: guide.category,
      imageUrl: guide.heroImage || guide.featuredImage || undefined,
    });
  }

  // 3. Atlas Places, Treks, Peaks & Destinations
  for (const region of himalayaAtlas) {
    for (const sub of region.subregions) {
      for (const place of sub.places) {
        const placeTitle =
          place.trekData?.title || place.peakData?.title || place.name;
        const placePath = `/explore/${region.id}/${sub.id}/${place.id}`;
        const canonicalLink = absoluteUrl(placePath);

        const rawDesc =
          place.trekData?.overview ||
          place.peakData?.overview ||
          place.overview ||
          `${place.name} in ${sub.name}, ${region.name}. High-altitude route breakdown and field guide on Discover Himalayan Trails.`;

        const heroImg =
          place.heroImage ||
          place.image ||
          place.trekData?.heroImage ||
          place.peakData?.heroImage;

        feedItems.push({
          title: `${placeTitle} — ${region.name}`,
          link: canonicalLink,
          guid: canonicalLink,
          description: cleanMarkdown(rawDesc),
          pubDate: buildDate,
          category: region.name,
          imageUrl: heroImg && heroImg.trim().length > 0 ? heroImg.trim() : undefined,
        });
      }
    }
  }

  // Build RSS 2.0 XML with Pinterest-compatible media tags
  const xmlItems = feedItems
    .map((item) => {
      let mediaXml = "";
      if (item.imageUrl) {
        const mimeType = getImageMimeType(item.imageUrl);
        const safeImgUrl = escapeXml(item.imageUrl);
        mediaXml = `
      <enclosure url="${safeImgUrl}" type="${mimeType}" length="0" />
      <media:content url="${safeImgUrl}" medium="image" type="${mimeType}">
        <media:title>${escapeXml(item.title)}</media:title>
      </media:content>`;
      }

      const categoryXml = item.category
        ? `\n      <category>${escapeXml(item.category)}</category>`
        : "";

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>${categoryXml}${mediaXml}
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <link>${SITE.url}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
${xmlItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
