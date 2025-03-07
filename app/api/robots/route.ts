// app/api/robots/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /profile
Disallow: /checkout
Disallow: /api/
Allow: /api/sitemap
Allow: /api/sitemap-products

# Sitemaps
Sitemap: https://flare-shop.vercel.app/api/sitemap
Sitemap: https://flare-shop.vercel.app/api/sitemap-products

# Crawl optimization
Crawl-delay: 10
`;
  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}