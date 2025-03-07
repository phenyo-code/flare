import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<Response> {
  const baseUrl = "https://flare-shop.vercel.app"; // Change to your domain

  // Fetch products dynamically from your database
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  // Fetch categories (you can modify this as per your use case)
  const categories = ["ALL", "FOR YOU", "WOMEN", "MEN", "BRANDS", "ACCESSORIES"];

  // Define the list of URLs for your sitemap
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
      lastModified: product.updatedAt instanceof Date ? product.updatedAt : new Date(),
    })),
  ];

  // Serialize the sitemap to XML format
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemap
      .map(
        (entry) =>
          `<url><loc>${entry.url}</loc><lastmod>${(entry.lastModified instanceof Date ? entry.lastModified.toISOString() : new Date().toISOString())}</lastmod></url>`
      )
      .join("\n") +
    `\n</urlset>`;

  // Return the XML response
  return new Response(xmlContent, {
    headers: { "Content-Type": "application/xml" }, // Ensure content type is set to XML
  });
}
