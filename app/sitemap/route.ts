import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export async function GET(): Promise<Response> {
  const baseUrl = "https://flare-shop.vercel.app"; // Change to your domain

  // Fetch products dynamically
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  // Fetch categories (if needed)
  const categories = ["ALL", "FOR YOU", "WOMEN", "MEN", "BRANDS", "ACCESSORIES"];

  const sitemap: MetadataRoute.Sitemap = [
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

  return new Response(
    new XMLSerializer().serializeToString(
      new DOMParser().parseFromString(
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          sitemap
            .map(
              (entry) =>
                `<url><loc>${entry.url}</loc><lastmod>${entry.lastModified.toString()}</lastmod></url>`
            )
            .join("\n") +
          `\n</urlset>`,
        "application/xml"
      )
    ),
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
}
