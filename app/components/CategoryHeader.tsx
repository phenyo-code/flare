"use client";  // Ensures this is a client-side component

import Link from "next/link";
import { getCookie, storeCategoryView } from "@/utils/cookies";
import { useEffect, useState } from "react";

const categories: string[] = ["ALL", "FOR YOU", "WOMEN", "MEN", "BRANDS", "ACCESSORIES"];

interface CategoryHeaderProps {
  activeCategory: string;
}

export default function CategoryHeader({ activeCategory }: CategoryHeaderProps) {
  const [visibleCategories, setVisibleCategories] = useState<string[]>(categories); // Default to all categories
  const [isClient, setIsClient] = useState(false);  // Flag to track client-side render

  const handleCategoryClick = (category: string) => {
    storeCategoryView(category); // Track on click
  };

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client

    // Check if any personalization cookies exist (client-side only)
    const hasCookies =
      getCookie("user_product_views") || getCookie("user_searches") || getCookie("user_category_views");

    // Filter categories to hide FOR YOU if no cookies
    const updatedCategories = hasCookies
      ? categories
      : categories.filter((category) => category !== "FOR YOU");

    setVisibleCategories(updatedCategories);
  }, []); // Empty dependency array: runs once after mount

  if (!isClient) {
    return null; // Return null to avoid mismatch on initial render
  }

  return (
    <div className="header-categories-row uppercase flex font-bold mb-0 items-start pt-2 px-2 overflow-x-auto lg:justify-between">
      {visibleCategories.map((category) => {
        const isActive = category.toUpperCase() === activeCategory.toUpperCase();
        const isForYou = category === "FOR YOU";
        const isAll = category === "ALL";
        const isBrands = category === "BRANDS";

        return (
          <div key={category} className="flex flex-col items-center">
            <Link
              href={
                isForYou
                  ? "/for-you"
                  : isAll
                  ? "/"
                  : isBrands
                  ? "/brand"
                  : `/category/${category}`
              }
              className={`category-tab text-gray-700 text-center px-4 pb-2 whitespace-nowrap text-sm sm:text-base ${
                isActive ? "text-black font-bold" : "text-black"
              } hover:text-black transition-colors duration-200`}
              aria-current={isActive ? "page" : undefined}
              prefetch
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Link>
            {isActive && <div className="w-full bg-gray-700 h-[5px] mt-0" />}
          </div>
        );
      })}
    </div>
  );
}
