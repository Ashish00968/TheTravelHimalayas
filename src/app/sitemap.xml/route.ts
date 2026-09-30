import { himalayaAtlas } from "@/data/atlas";
import { guides } from "@/data/guides";
import { treks } from "@/data/treks";
import { peaks } from "@/data/peaks";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const BASE_URL = SITE.url;

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

// Storyline dispatch plate captions for Patalsu Peak
const PATALSU_PLATE_CAPTIONS: Record<string, string> = {
  "2clearviewofPatalsu": "Looking at Patalsu Peak from Burwa Village — clear morning view looking up at the 4,261m pyramid of Patalsu Peak from Burwa Village before heading toward the Solang trailhead",
  "4GoingtoSolangVillage": "Solang Village Visible from Solang Valley — looking across from Solang Valley toward Solang Village nestled on the mountainside as you cross the stream on the way to the trail start",
  "6SolangVillage": "Traditional Timber & Stone Hamlet — ancient Solang Village with its characteristic timber-framed stone homes, slate roofs, and apple orchards",
  "7trekStart": "Entering the Cedar Forest — stepping off the stone village lanes onto the dirt trail that plunges into dense deodar, pine, and birch woodland",
  "8intotheforestsectionCattleGrazing": "Pastoral Forest Glades — tall cedars give way to sun-dappled glades where mountain cattle graze quietly in the morning light",
  "9_1doghiking": "The Mountain Companion — friendly local Himalayan sheepdog navigating the high alpine route above Solang",
  "10abovetheTreelineViewOfDhauladharRanges": "Breaking Above the Treeline — emerging into the high alpine meadow of Shagadugh with sweeping panorama of the Dhauladhar ranges",
  "11IntoRidgeline": "Ascending the Open Arête — trail steepens across golden autumn grass slopes transitioning into rocky switchbacks along the mountain spine",
  "13ViewOfHanumanTibba": "Facing Hanuman Tibba (5,982m) — colossal sheer glaciated pyramid and hanging seracs across the western abyss of Solang",
  "12FinalRidge": "The Relentless Scree Ridge — final 200m vertical push along the exposed knife-edge of loose shale and wind-scoured scree",
  "14SummitSelfie": "The 4,261m Summit Pinnacle — standing on the pinnacle of Patalsu Peak with prayer flags fluttering and 360° Himalayan amphitheater",
  "15SunsetHanumanTibba": "Alpenglow on Hanuman Tibba — setting October sun setting the west face of Hanuman Tibba ablaze in deep golden and crimson alpenglow",
};

interface ImageNode {
  loc: string;
  title: string;
  caption: string;
}

interface SitemapUrlEntry {
  url: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  images?: ImageNode[];
}

export async function GET(): Promise<Response> {
  const lastModified = new Date();
  const lastmod = lastModified.toISOString();

  const staticRoutes: SitemapUrlEntry[] = [
    { url: BASE_URL, lastmod, changefreq: "daily", priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastmod, changefreq: "daily", priority: 0.95 },
    { url: `${BASE_URL}/map`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/conditions`, lastmod, changefreq: "daily", priority: 0.85 },
    { url: `${BASE_URL}/safety`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/guides`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/plan`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/plan/trek-finder`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/plan/compare`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/plan/season`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/plan/budget`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/plan/packing`, lastmod, changefreq: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/prepare`, lastmod, changefreq: "weekly", priority: 0.80 },
    { url: `${BASE_URL}/stories`, lastmod, changefreq: "weekly", priority: 0.80 },
    { url: `${BASE_URL}/contact`, lastmod, changefreq: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/disclaimer`, lastmod, changefreq: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastmod, changefreq: "yearly", priority: 0.3 },
  ];

  const stateRoutes: SitemapUrlEntry[] = [];
  const divisionRoutes: SitemapUrlEntry[] = [];
  const placeRoutes: SitemapUrlEntry[] = [];

  const treksBySlug = new Map(treks.map((t) => [t.slug, t]));
  const peaksBySlug = new Map(peaks.map((p) => [p.slug, p]));

  for (const region of himalayaAtlas) {
    const stateImages: ImageNode[] = [];
    if (region.image) {
      const loc = region.image.startsWith("http")
        ? region.image
        : `${BASE_URL}${region.image.startsWith("/") ? "" : "/"}${region.image}`;
      stateImages.push({
        loc,
        title: region.name,
        caption: `Panoramic alpine landscape and mountain ranges of ${region.name} — ${region.cardDesc}`,
      });
    }

    stateRoutes.push({
      url: `${BASE_URL}/explore/${region.id}`,
      lastmod,
      changefreq: "weekly",
      priority: 0.85,
      images: stateImages.length > 0 ? stateImages : undefined,
    });

    for (const sub of region.subregions) {
      divisionRoutes.push({
        url: `${BASE_URL}/explore/${region.id}/${sub.id}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.80,
      });

      for (const place of sub.places) {
        const trek = treksBySlug.get(place.id) || place.trekData;
        const peak = peaksBySlug.get(place.id) || place.peakData;

        const rawImages: string[] = [];
        const addImg = (u?: string) => {
          if (u && !rawImages.includes(u)) rawImages.push(u);
        };

        if (place.heroImage) addImg(place.heroImage);
        if (place.image) addImg(place.image);
        if (place.images) place.images.forEach(addImg);
        if (trek?.heroImage) addImg(trek.heroImage);
        if (trek?.images) trek.images.forEach(addImg);
        if (peak?.heroImage) addImg(peak.heroImage);
        if (peak?.images) peak.images.forEach(addImg);

        // Guard the image cap (Google allows max 1,000 image nodes per URL)
        const cappedImages = rawImages.slice(0, 1000);

        const elevStr =
          place.elevation ||
          trek?.maxAltitude ||
          (peak?.height ? `${peak.height}m` : "");
        const elevPart = elevStr ? `${elevStr}, ` : "";

        const imageNodes: ImageNode[] = cappedImages.map((rawUrl, idx) => {
          const loc = rawUrl.startsWith("http")
            ? rawUrl
            : `${BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
          const title = place.name;
          let caption = "";

          if (place.id === "patalsu-peak") {
            for (const [key, val] of Object.entries(PATALSU_PLATE_CAPTIONS)) {
              if (rawUrl.includes(key)) {
                caption = `${place.name} — ${val}`;
                break;
              }
            }
          }

          if (!caption) {
            if (cappedImages.length === 1 || idx === 0) {
              caption = `${place.name} (${elevPart}${sub.name}, ${region.name}) — panoramic Himalayan vista and trail gateway`;
            } else {
              caption = `${place.name} (${elevPart}${sub.name}, ${region.name}) — field photography plate ${idx + 1}`;
            }
          }

          return { loc, title, caption };
        });

        placeRoutes.push({
          url: `${BASE_URL}/explore/${region.id}/${sub.id}/${place.id}`,
          lastmod,
          changefreq: "weekly",
          priority: 0.90,
          images: imageNodes.length > 0 ? imageNodes : undefined,
        });
      }
    }

    if (region.id === "uttarakhand") {
      divisionRoutes.push({
        url: `${BASE_URL}/explore/uttarakhand/garhwal`,
        lastmod,
        changefreq: "weekly",
        priority: 0.85,
      });
      divisionRoutes.push({
        url: `${BASE_URL}/explore/uttarakhand/kumaon`,
        lastmod,
        changefreq: "weekly",
        priority: 0.85,
      });
      divisionRoutes.push({
        url: `${BASE_URL}/explore/uttarakhand/garhwal/char-dham-yatra`,
        lastmod,
        changefreq: "weekly",
        priority: 0.95,
      });
    }
  }

  const guideRoutes: SitemapUrlEntry[] = guides.map((guide) => {
    const guideImages: ImageNode[] = [];
    const gImg = guide.heroImage || guide.featuredImage;
    if (gImg) {
      const loc = gImg.startsWith("http")
        ? gImg
        : `${BASE_URL}${gImg.startsWith("/") ? "" : "/"}${gImg}`;
      guideImages.push({
        loc,
        title: guide.title,
        caption: `${guide.title} — Himalayan guide documentation`,
      });
    }
    return {
      url: `${BASE_URL}/guides/${guide.slug}`,
      lastmod,
      changefreq: "weekly",
      priority: 0.80,
      images: guideImages.length > 0 ? guideImages : undefined,
    };
  });

  const allEntries = [
    ...staticRoutes,
    ...stateRoutes,
    ...divisionRoutes,
    ...placeRoutes,
    ...guideRoutes,
  ];

  const uniqueMap = new Map<string, SitemapUrlEntry>();
  for (const entry of allEntries) {
    if (!uniqueMap.has(entry.url)) {
      uniqueMap.set(entry.url, entry);
    }
  }

  const finalEntries = Array.from(uniqueMap.values());

  const urlNodes = finalEntries
    .map((entry) => {
      let imagesXml = "";
      if (entry.images && entry.images.length > 0) {
        imagesXml = entry.images
          .map((img) => {
            const titleTag = img.title
              ? `\n      <image:title>${escapeXml(img.title)}</image:title>`
              : "";
            const captionTag = img.caption
              ? `\n      <image:caption>${escapeXml(img.caption)}</image:caption>`
              : "";
            return `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>${titleTag}${captionTag}
    </image:image>`;
          })
          .join("\n");
      }

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${imagesXml ? `\n${imagesXml}` : ""}
  </url>`;
    })
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlNodes}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
