// app/api/robots/route.ts (or pages/api/robots.ts)
import { NextResponse } from "next/server";

export async function GET() {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /profile
Disallow: /checkout  # Fixed typo from /check-out
Disallow: /api/      # Disallow API endpoints except sitemap
Allow: /api/sitemap  # Explicitly allow the sitemap endpoint

# Sitemap
Sitemap: https://flare-shop.vercel.app/api/sitemap

# Crawl optimization
Crawl-delay: 10      # Optional: Slows down crawling to reduce server load (in seconds)
`;

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 1 day
    },
  });
}