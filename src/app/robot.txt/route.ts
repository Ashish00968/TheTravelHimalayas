import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const content = `User-Agent: *\nAllow: /\nDisallow: /brand\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
