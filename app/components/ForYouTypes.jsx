"use client";

import { useState } from "react";
import PersonalizedProductList from "./PersonalizedProductList";
import ForYouHero from "./ForYouHero";
import { Suspense } from "react";

export default function ForYouTypes({ initialProducts, filters, featuredProduct }) {
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Filter products based on selected filter (client-side)
  const filteredProducts = selectedFilter
    ? initialProducts.filter(product => product.filter === selectedFilter)
    : initialProducts;

  return (
    <div>
      {/* Filters row styled like CategoryHeader */}
      <div className="filter-row  header-categories-row uppercase flex font-bold shadow-md mb-0 items-center py-2 px-4 overflow-x-auto">
        <button
          className={`filter-tab flex-none text-center px-4 whitespace-nowrap text-sm sm:text-base ${
            !selectedFilter ? "text-red-500" : "text-black"
          } hover:text-red-500 transition-colors duration-200`}
          onClick={() => setSelectedFilter(null)}
        >
          ALL
        </button>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-tab flex-none text-center px-4 whitespace-nowrap text-sm sm:text-base ${
              selectedFilter === filter ? "text-red-500" : "text-black"
            } hover:text-red-500 transition-colors duration-200`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* HeroSection equivalent */}
      <ForYouHero product={featuredProduct} />

      {/* Render filtered products */}
      <Suspense fallback={<p>Loading personalized products...</p>}>
        <PersonalizedProductList allProducts={filteredProducts} />
      </Suspense>
    </div>
  );
}