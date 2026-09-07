type Env = Record<string, unknown>;

/**
 * Cloudflare Pages Middleware
 *
 * Ensures preview / staging deployments on *.pages.dev receive `X-Robots-Tag: noindex, nofollow`
 * to prevent duplicate content indexing in search engines, while ensuring the primary custom
 * domain (discoverhimalayantrails.com) remains 100% indexable.
 */
export async function onRequest(context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}): Promise<Response> {
  const response = await context.next();
  const url = new URL(context.request.url);

  // Apply noindex exclusively to *.pages.dev subdomains
  if (url.hostname.endsWith(".pages.dev")) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  return response;
}
