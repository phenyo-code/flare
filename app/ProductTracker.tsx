// app/ProductTracker.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProductTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/product/")) {
      const productId = pathname.split("/product/")[1];
      if (productId) {
        const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        if (!viewed.includes(productId)) {
          viewed.unshift(productId);
          viewed.splice(5);
          localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
        }
      }
    }
  }, [pathname]);

  return null;
}