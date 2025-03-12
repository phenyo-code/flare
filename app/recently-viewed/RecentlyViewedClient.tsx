// app/recently-viewed/RecentlyViewedClient.tsx
"use client";

import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";
import { Product } from "@prisma/client";

interface ProductWithSizes extends Product {
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
}

interface RecentlyViewedClientProps {
  cartId: string | null;
}

export default function RecentlyViewedClient({ cartId }: RecentlyViewedClientProps) {
  const [products, setProducts] = useState<ProductWithSizes[]>([]);

  useEffect(() => {
    const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    if (viewedIds.length > 0) {
      fetch("/api/recently-viewed", {
        method: "POST",
        body: JSON.stringify({ ids: viewedIds }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch recently viewed products");
          return res.json();
        })
        .then((data) => setProducts(data))
        .catch((error) => console.error("Error fetching recently viewed:", error));
    }
  }, []);

  return (
    <div className="px-6 py-4">
      {products.length > 0 ? (
        <ProductList products={products} cartId={cartId} />
      ) : (
        <p className="text-center text-gray-600">No recently viewed products yet.</p>
      )}
    </div>
  );
}