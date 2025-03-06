"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookies";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  Originalprice?: number;
  category: string;
  filter: string;
  images: string[];
  isRecommended: boolean;
  reviews?: any[]; // Added from schema
  createdAt: Date; // Added from schema
  updatedAt: Date; // Added from schema
  style?: string;
  type?: string;
  matchesWith?: string[]; // Added from schema
}

interface HeroSectionProps {
  initialProduct: Product | null; // Fallback product
  allProducts: Product[]; // Full product set for personalization
}

export default function ForYouHero({ initialProduct, allProducts }: HeroSectionProps) {
  const [heroProduct, setHeroProduct] = useState<Product | null>(initialProduct);

  useEffect(() => {
    const viewedFiltersCookie = getCookie("user_product_views");
    const searchedProductsCookie = getCookie("user_searches");
    const viewedCategoriesCookie = getCookie("user_category_views");

    // Parse cookie data
    const viewedFilters: { filter: string; timestamp: number }[] = viewedFiltersCookie
      ? JSON.parse(viewedFiltersCookie)
      : [];
    const searchTerms: { query: string; timestamp: number }[] = searchedProductsCookie
      ? JSON.parse(searchedProductsCookie)
      : [];
    const viewedCategories: { category: string; timestamp: number }[] = viewedCategoriesCookie
      ? JSON.parse(viewedCategoriesCookie)
      : [];

    // Infer gender based on total views
    const inferredGender = inferGenderFromCategoryViews(viewedCategories);

    // Filter products by inferred gender
    let filteredProducts = allProducts;
    if (inferredGender === "WOMEN" || inferredGender === "MEN") {
      filteredProducts = allProducts.filter(
        (product) => product.category.toUpperCase() === inferredGender
      );
    }

    // Scoring system to choose hero product
    const productScores = new Map<string, number>();
    const now = Date.now();
    const decayFactor = 7 * 24 * 60 * 60 * 1000; // 7-day decay

    // Score based on viewed filters (weight: 1.5)
    viewedFilters.forEach((view) => {
      const weight = 1.5 + Math.max(0, 1 - (now - view.timestamp) / decayFactor);
      filteredProducts.forEach((product) => {
        if (product.filter.toLowerCase().includes(view.filter.toLowerCase())) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + weight);
        }
      });
    });

    // Score based on search terms (weight: 2)
    searchTerms.forEach((term) => {
      const weight = 2 + Math.max(0, 1 - (now - term.timestamp) / decayFactor);
      filteredProducts.forEach((product) => {
        if (product.name.toLowerCase().includes(term.query.toLowerCase())) {
          productScores.set(product.id, (productScores.get(product.id) || 0) + weight);
        }
      });
    });

    // Select the highest-scored product, or fall back to initialProduct
    const selectedProduct = filteredProducts
      .map((product) => ({
        product,
        score: productScores.get(product.id) || (product.isRecommended ? 0.5 : 0), // Fixed typo: 'jurado' → 'score'
      }))
      .sort((a, b) => b.score - a.score || b.product.createdAt.getTime() - a.product.createdAt.getTime())[0]?.product ||
      initialProduct;

    setHeroProduct(selectedProduct);
  }, [initialProduct, allProducts]);

  if (!heroProduct) {
    return <p>No product available for personalization.</p>;
  }

  const firstImage = heroProduct.images[0];
  const discount = heroProduct.Originalprice
    ? ((heroProduct.Originalprice - heroProduct.price) / heroProduct.Originalprice) * 100
    : 0;

  return (
    <div className="hero-section relative w-full h-[400px] mb-10 sm:h-[500px] md:h-[600px] flex items-center justify-center">
      <Image
        src={firstImage}
        alt={heroProduct.name}
        width={0}
        height={500}
        sizes="150vw"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-1/2 transform -translate-y-1/2 text-center text-white w-full">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Best Deals For You</h2>
        {heroProduct.Originalprice && discount > 0 && (
          <p className="mb-6 text-lg sm:text-2xl md:text-2xl font-semibold">
            Like this {discount.toFixed(0)}% OFF {heroProduct.filter}
          </p>
        )}
        <Link
          href={`/product/${heroProduct.id}`}
          className="bg-red-600 text-white hover:bg-white hover:text-red-600 px-6 py-3 text-lg sm:text-xl"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}

// Gender inference function
function inferGenderFromCategoryViews(viewedCategories: { category: string; timestamp: number }[]): "WOMEN" | "MEN" | "UNKNOWN" {
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