"use client";

import { useState } from "react";
import PersonalizedProductList from "./PersonalizedProductList";
import ForYouHero from "./ForYouHero";
import { Suspense } from "react";

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
  matchesWith: string[];
}

interface ForYouTypesProps {
  initialProducts: ProductWithSizes[];
  filters: string[];
  featuredProduct: ProductWithSizes;
  cartId?: string;
}

export default function ForYouTypes({
  initialProducts,
  filters,
  featuredProduct,
  cartId,
}: ForYouTypesProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredProducts = selectedFilter
    ? initialProducts.filter((product) => product.filter === selectedFilter)
    : initialProducts;

  return (
    <div>
      <ForYouHero product={featuredProduct} />

      {/* Now Trending Heading */}
      <h2 className="text-xl ml-4 sm:text-2xl font-extrabold my-4 uppercase tracking-wide">
        Trending Picks
      </h2>

      {/* Filter Row */}
      <div className="filter-row header-categories-row uppercase flex font-bold shadow-md mb-0 items-center pb-2 px-4 overflow-x-auto space-x-2">
        <button
          className={`filter-tab flex-none text-center px-4 py-2 rounded-full border border-gray-300 whitespace-nowrap text-sm sm:text-base ${
            !selectedFilter ? "text-red-500 border-red-500" : "text-black bg-transparent"
          } hover:text-red-500 transition-colors duration-200`}
          onClick={() => setSelectedFilter(null)}
        >
          ALL
        </button>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-tab flex-none text-center px-4 py-2 rounded-full border border-gray-300 whitespace-nowrap text-sm sm:text-base ${
              selectedFilter === filter ? "text-red-500 border-red-500" : "text-black bg-transparent"
            } hover:text-red-500 transition-colors duration-200`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <Suspense fallback={<p>Loading personalized products...</p>}>
        <PersonalizedProductList allProducts={filteredProducts} cartId={cartId} />
      </Suspense>
    </div>
  );
}
