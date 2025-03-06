// components/CategoryHeader.tsx
"use client";

import Link from "next/link";
import { getCookie, storeCategoryView } from "@/utils/cookies";

const categories: string[] = ["ALL", "FOR YOU", "WOMEN", "MEN", "BRANDS", "ACCESSORIES"];

interface CategoryHeaderProps {
  activeCategory: string;
}

export default function CategoryHeader({ activeCategory }: CategoryHeaderProps) {
  const handleCategoryClick = (category: string) => {
    storeCategoryView(category); // Track on click
  };

  // Check if any personalization cookies exist
  const hasCookies =
    getCookie("user_product_views") || getCookie("user_searches") || getCookie("user_category_views");

  // Filter categories to hide FOR YOU if no cookies
  const visibleCategories = hasCookies
    ? categories
    : categories.filter((category) => category !== "FOR YOU");

  return (
    <div className="header-categories-row uppercase flex font-bold mb-0 items-start pt-2 px-2 overflow-x-auto lg:justify-between">
      {visibleCategories.map((category) => {
        const isActive = category.toUpperCase() === activeCategory.toUpperCase();
        const isForYou = category === "FOR YOU";
        const isAll = category === "ALL";

        return (
          <div key={category} className="flex flex-col items-center">
            <Link
              href={isForYou ? "/for-you" : isAll ? "/" : `/category/${category}`}
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