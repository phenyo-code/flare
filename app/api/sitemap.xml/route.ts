// app/api/sitemap/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";


export async function GET() {
  const baseUrl = "https://flare-shop.vercel.app";

  // Fetch products dynamically from the database
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  // Fetch brands dynamically (assuming 'style' is your brand identifier)
  const brands = await prisma.product.findMany({
    select: { style: true, updatedAt: true },
    where: { style: { not: null } }, // Only include products with a style
    distinct: ["style"], // Get unique brands
  });

  // Static pages and categories
  const staticPages = [
    { url: `${baseUrl}/`, lastmod: new Date(), changefreq: "daily", priority: "1.0" },
    { url: `${baseUrl}/profile`, lastmod: new Date(), changefreq: "weekly", priority: "0.8" },
    { url: `${baseUrl}/about`, lastmod: new Date(), changefreq: "monthly", priority: "0.7" },
    { url: `${baseUrl}/contact`, lastmod: new Date(), changefreq: "monthly", priority: "0.7" },
    { url: `${baseUrl}/search`, lastmod: new Date(), changefreq: "daily", priority: "0.6" }, // Added search page
  ];

  const categories = ["ALL", "FOR YOU", "WOMEN", "MEN", "BRANDS", "ACCESSORIES"].map((category) => ({
    url: `${baseUrl}/category/${category.toLowerCase()}`,
    lastmod: new Date(),
    changefreq: "daily",
    priority: "0.9",
  }));

  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/brand/${brand.style!.toLowerCase()}`,
    lastmod: brand.updatedAt,
    changefreq: "weekly",
    priority: "0.8",
  }));

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastmod: product.updatedAt,
    changefreq: "weekly",
    priority: "0.8",
  }));

  // Combine all URLs
  const sitemapEntries = [...staticPages, ...categories, ...brandPages, ...productPages];

  // Generate XML string
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
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

  // Return the sitemap as XML
  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 1 day
    },
  });
}