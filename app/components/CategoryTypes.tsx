"use client";

import { useState } from "react";
import ProductList from "./ProductList";
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
  logo: string; 
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
  style: string;
  type: string;
  matchesWith: string[];
}

interface CategoryTypesProps {
  initialProducts: ProductWithSizes[];
  filters: string[];
  category: string;
  cartId?: string;
}

export default function CategoryTypes({ initialProducts, filters, category, cartId }: CategoryTypesProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredProducts = selectedFilter
    ? initialProducts.filter((product) => product.filter === selectedFilter)
    : initialProducts;

  return (
    <div>
      {/* Now Trending Heading */}
      <h2 className="text-xl ml-4 sm:text-2xl font-bold my-4 uppercase tracking-wide">
        Now Trending
      </h2>

      {/* Filter Row */}
      <div className="filter-row uppercase flex font-bold shadow-md mb-0 items-center py-2 px-4 overflow-x-auto space-x-2">
        <button
          className={`filter-tab flex-none text-center px-4 py-2 rounded-full border border-gray-300 whitespace-nowrap text-sm sm:text-base ${
            !selectedFilter ? "text-red-500  border-red-500" : "text-black bg-transparent"
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

      <Suspense fallback={<p>Loading products...</p>}>
        <ProductList products={filteredProducts} cartId={cartId} />
      </Suspense>
    </div>
  );
}
