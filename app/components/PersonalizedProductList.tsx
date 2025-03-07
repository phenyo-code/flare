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
  style: string;
  type: string;
  logo: string;
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
    const viewedFilters = getCookie("user_product_views");
    const searchedProducts = getCookie("user_searches");
    const viewedCategoriesCookie = getCookie("user_category_views");

    // Parse cookie data with correct types
    const filters: { filter: string; timestamp: number }[] = viewedFilters ? JSON.parse(viewedFilters) : [];
    const searchTerms: { query: string; timestamp: number }[] = searchedProducts ? JSON.parse(searchedProducts) : [];
    const viewedCategories: { category: string; timestamp: number }[] = viewedCategoriesCookie
      ? JSON.parse(viewedCategoriesCookie)
      : [];

    // Infer gender
    const inferredGender = inferGenderFromCategoryViews();

    // Filter products by inferred gender if WOMEN or MEN, otherwise use all products
    let filteredProducts = allProducts.filter((product) => product && product.filter && product.name); // Basic validation
    if (inferredGender === "WOMEN" || inferredGender === "MEN") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category?.toUpperCase() === inferredGender
      );
    }

    // Scoring system for remaining products
    const productScores = new Map<string, number>();
    const now = Date.now();
    const decayFactor = 7 * 24 * 60 * 60 * 1000; // 7-day decay

    // Score based on viewed filters (weight: 1.5)
    filters.forEach((view) => {
      filteredProducts.forEach((product) => {
        if (
          typeof product.filter === "string" &&
          typeof view.filter === "string" &&
          product.filter.toLowerCase().includes(view.filter.toLowerCase())
        ) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + 1.5);
        }
      });
    });

    // Score based on search terms (weight: 2)
    searchTerms.forEach((term) => {
      filteredProducts.forEach((product) => {
        if (
          typeof product.name === "string" &&
          typeof term.query === "string" &&
          product.name.toLowerCase().includes(term.query.toLowerCase())
        ) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + 2);
        }
      });
    });

    // Score based on category views (weight: 1, with recency decay)
    viewedCategories.forEach((view) => {
      const weight = 1 + Math.max(0, 1 - (now - view.timestamp) / decayFactor);
      filteredProducts.forEach((product) => {
        if (product.category?.toUpperCase() === view.category) {
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
        <InteractionMessage />
      )}
    </div>
  );
}

// Gender inference function
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

  if (categoryCounts.WOMEN > categoryCounts.MEN) {
    return "WOMEN";
  } else if (categoryCounts.MEN > categoryCounts.WOMEN) {
    return "MEN";
  } else {
    return "UNKNOWN";
  }
}