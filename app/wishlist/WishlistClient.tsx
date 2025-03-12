// app/wishlist/WishlistClient.tsx
"use client";

import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";
import { Product } from "@prisma/client";

interface ProductWithSizes extends Product {
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
}

interface WishlistClientProps {
  cartId: string | null;
}

export default function WishlistClient({ cartId }: WishlistClientProps) {
  const [wishlistProducts, setWishlistProducts] = useState<ProductWithSizes[]>([]);

  useEffect(() => {
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (wishlistIds.length > 0) {
      fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ ids: wishlistIds }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch wishlist products");
          return res.json();
        })
        .then((data) => setWishlistProducts(data))
        .catch((error) => console.error("Error fetching wishlist:", error));
    }
  }, []);

  return (
    <div className="px-6 py-4">
      {wishlistProducts.length > 0 ? (
        <ProductList products={wishlistProducts} cartId={cartId} />
      ) : (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      )}
    </div>
  );
}