import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/cart", "/profile", "/check-out"],
      },
    ],
    sitemap: "https://flare-shop.vercel.app/sitemap.xml",
  };
}
