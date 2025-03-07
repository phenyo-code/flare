import { MetadataRoute } from "next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://flare-shop.vercel.app"; // Change to your domain

  // Fetch products dynamically
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  // Fetch categories (if needed)
  const categories = ["ALL", "FOR YOU", "WOMEN", "MEN", "BRANDS", "ACCESSORIES"];

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/profile`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updatedAt,
    })),
  ];
}
