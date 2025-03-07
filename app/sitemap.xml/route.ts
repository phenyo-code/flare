import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma"; // Ensure this is correct for your project setup

export async function GET() {
    const baseUrl = "https://flare-shop.vercel.app"; // Your domain
  
    // Fetch products dynamically from the database
    const products = await prisma.product.findMany({
      select: { id: true, updatedAt: true },
    });
  
    // Categories (you can modify this as needed)
    const categories = ["ALL", "FOR YOU", "WOMEN", "MEN", "BRANDS", "ACCESSORIES"];
  
    // Construct the list of URLs for the sitemap
    const sitemap = [
      { url: `${baseUrl}/`, lastModified: new Date() },
      { url: `${baseUrl}/profile`, lastModified: new Date() },
      { url: `${baseUrl}/about`, lastModified: new Date() },
      { url: `${baseUrl}/contact`, lastModified: new Date() },
      ...categories.map((category) => ({
        url: `${baseUrl}/category/${category.toLowerCase()}`,
        lastModified: new Date(),
      })),
      ...products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: product.updatedAt,
      })),
    ];
  
    // Generate XML string from the sitemap array
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      sitemap
        .map(
          (entry) =>
            `<url><loc>${entry.url}</loc><lastmod>${entry.lastModified.toISOString()}</lastmod></url>`
        )
        .join("\n") +
      `\n</urlset>`;
  
    // Return the sitemap as XML
    return new NextResponse(xmlContent, {
      headers: {
        "Content-Type": "application/xml", // Set correct content type for XML
      },
    });
  }