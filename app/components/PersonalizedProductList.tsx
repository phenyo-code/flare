"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookies";
import ProductList from "./ProductList";
import InteractionMessage from "@/components/InteractionMessage";
import ProductListSkeleton from "@/components/ProductListSkeleton";

interface ProductWithSizes {
  id: string;
  name: string;
  price: number;
  Originalprice: number;
  category: string;
  filter: string;
  images: string[];
  isRecommended: boolean;
  reviews: any[];
  createdAt: Date;
  updatedAt: Date;
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
  style: string | null;
  brandName?: string; // Added from updated schema
  type: string | null;
  matchesWith: string[];
}

interface PersonalizedProductListProps {
  allProducts: ProductWithSizes[];
  cartId?: string;
}

export default function PersonalizedProductList({ allProducts, cartId }: PersonalizedProductListProps) {
  const [personalizedProducts, setPersonalizedProducts] = useState<ProductWithSizes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const viewedFiltersCookie = getCookie("user_product_views");
    const searchedProductsCookie = getCookie("user_searches");
    const viewedCategoriesCookie = getCookie("user_category_views");

    // Parse cookie data with updated structures
    const viewedFilters: { filter: string; timestamp: number }[] = viewedFiltersCookie
      ? JSON.parse(viewedFiltersCookie)
      : [];
    const searchTerms: { query: string; timestamp: number }[] = searchedProductsCookie
      ? JSON.parse(searchedProductsCookie)
      : [];
    const viewedCategories: { category: string; timestamp: number }[] = viewedCategoriesCookie
      ? JSON.parse(viewedCategoriesCookie)
      : [];

    // Infer gender
    const inferredGender = inferGenderFromCategoryViews();

    // Filter products by inferred gender if WOMEN or MEN, otherwise use all products
    let filteredProducts = allProducts;
    if (inferredGender === "WOMEN" || inferredGender === "MEN") {
      filteredProducts = allProducts.filter(
        (product) => product.category.toUpperCase() === inferredGender
      );
    }

    // Scoring system for remaining products
    const productScores = new Map<string, number>();
    const now = Date.now();
    const decayFactor = 7 * 24 * 60 * 60 * 1000; // 7-day decay

    // Score based on viewed filters (weight: 1.5, with recency decay)
    viewedFilters.forEach((view) => {
      const weight = 1.5 + Math.max(0, 1 - (now - view.timestamp) / decayFactor);
      filteredProducts.forEach((product) => {
        if (product.filter.toLowerCase().includes(view.filter.toLowerCase())) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + weight);
        }
      });
    });

    // Score based on search terms (weight: 2, with recency decay)
    searchTerms.forEach((term) => {
      const weight = 2 + Math.max(0, 1 - (now - term.timestamp) / decayFactor);
      filteredProducts.forEach((product) => {
        const nameMatch = product.name.toLowerCase().includes(term.query.toLowerCase());
        const brandMatch = product.brandName?.toLowerCase().includes(term.query.toLowerCase());
        if (nameMatch || brandMatch) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + weight);
        }
      });
    });

    // Score based on category views (weight: 1, with recency decay)
    viewedCategories.forEach((view) => {
      const weight = 1 + Math.max(0, 1 - (now - view.timestamp) / decayFactor);
      filteredProducts.forEach((product) => {
        if (product.category.toUpperCase() === view.category) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + weight);
        }
      });
    });

    // Score based on brand affinity from viewed products (weight: 1.5)
    const brandViews = viewedFilters.reduce((acc: Set<string>, view) => {
      const matchingProduct = filteredProducts.find((p) =>
        p.filter.toLowerCase().includes(view.filter.toLowerCase())
      );
      if (matchingProduct?.brandName) {
        acc.add(matchingProduct.brandName.toLowerCase());
      }
      return acc;
    }, new Set<string>());

    brandViews.forEach((brand) => {
      const weight = 1.5; // Static weight for brand affinity
      filteredProducts.forEach((product) => {
        if (product.brandName?.toLowerCase() === brand) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + weight);
        }
      });
    });

    // Sort and limit products
    const scoredProducts = filteredProducts
      .map((product) => ({
        product,
        score: productScores.get(product.id) || (product.isRecommended ? 0.5 : 0),
      }))
      .sort((a, b) => b.score - a.score || b.product.createdAt.getTime() - a.product.createdAt.getTime())
      .map((entry) => entry.product)
      .slice(0, 12);

    setPersonalizedProducts(scoredProducts);
    setLoading(false);
  }, [allProducts]);

  if (loading) {
    return <ProductListSkeleton />;
  }

  return (
    <div>
      {personalizedProducts.length > 0 ? (
        <ProductList products={personalizedProducts} cartId={cartId} />
      ) : (
        <InteractionMessage  />
      )}
    </div>
  );
}

// Gender inference function (unchanged from cookies.ts)
function inferGenderFromCategoryViews(): "WOMEN" | "MEN" | "UNKNOWN" {
  let viewedCategories: { category: string; timestamp: number }[] = [];

  try {
    const cookieData = getCookie("user_category_views");
    viewedCategories = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing viewed categories for gender inference:", e);
    return "UNKNOWN";
  }

  if (viewedCategories.length === 0) {
    return "UNKNOWN";
  }

  const categoryCounts = viewedCategories.reduce(
    (acc: { WOMEN: number; MEN: number }, view) => {
      if (view.category === "WOMEN") acc.WOMEN += 1;
      if (view.category === "MEN") acc.MEN += 1;
      return acc;
    },
    { WOMEN: 0, MEN: 0 }
  );

  return categoryCounts.WOMEN > categoryCounts.MEN ? "WOMEN" : categoryCounts.MEN > categoryCounts.WOMEN ? "MEN" : "UNKNOWN";
}