"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCookie } from "@/utils/cookies";
import ProductList from "@/components/ProductList";
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react"; // For cartId if authenticated



interface ViewedProduct {
  filter: string;
  timestamp: number;
}

interface ProductWithSizes extends Product {
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
}

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<ProductWithSizes[] | null>(null);
  const [cartId, setCartId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchRecentlyViewed() {
      console.log("Fetching recently viewed products...");

      // Get recently viewed products from cookie
      const cookieData = getCookie("user_product_views");
      console.log("Cookie data:", cookieData);
      if (!cookieData) {
        console.log("No user_product_views cookie found.");
        setProducts([]);
        return;
      }

      let viewedProducts: ViewedProduct[] = [];
      try {
        viewedProducts = JSON.parse(cookieData);
        console.log("Parsed viewed products:", viewedProducts);
      } catch (e) {
        console.error("Error parsing user_product_views:", e);
        setError("Failed to load recently viewed items.");
        setProducts([]);
        return;
      }

      if (viewedProducts.length === 0) {
        console.log("No recently viewed products in cookie.");
        setProducts([]);
        return;
      }

      // Fetch product details from the server
      const filters = viewedProducts.map((item) => item.filter.toLowerCase());
      console.log("Fetching products with filters:", filters);
      try {
        const response = await fetch("/api/recently-viewed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filters }),
        });

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const fetchedProducts: ProductWithSizes[] = await response.json();
        console.log("Fetched products:", fetchedProducts);

        // Sort by timestamp (most recent first)
        const sortedProducts = fetchedProducts.sort((a, b) => {
          const aTime = viewedProducts.find((vp) => vp.filter === a.filter)?.timestamp || 0;
          const bTime = viewedProducts.find((vp) => vp.filter === b.filter)?.timestamp || 0;
          return bTime - aTime;
        });
        setProducts(sortedProducts);
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError("Unable to load products. Please try again later.");
        setProducts([]);
        return;
      }

      // Fetch cartId for authenticated users
      if (session?.user) {
        try {
          const cartResponse = await fetch("/api/cart", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            console.log("Cart data:", cartData);
            setCartId(cartData.cartId);
          } else {
            console.warn("Failed to fetch cart:", cartResponse.status);
          }
        } catch (e) {
          console.error("Error fetching cartId:", e);
        }
      }
    }

    fetchRecentlyViewed();
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Recently Viewed</h1>
        <p className="text-gray-700 mb-6">
          Here are the products you’ve recently explored on FLARE. Keep browsing or add them to your cart!
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ProductList products={products} cartId={cartId} />
      </main>
      <Footer />
    </div>
  );
}