// app/api/sitemap-products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const baseUrl = "https://flare-shop.vercel.app";

  // Fetch all products with minimal data needed for sitemap
  const products = await prisma.product.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50000, // Sitemap spec limit is 50,000 URLs
  });

  // Generate sitemap entries for products
  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastmod: product.updatedAt,
    changefreq: "weekly",
    priority: "0.8",
  }));

  // Create XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productPages
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod.toISOString()}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 1 day
    },
  });
}