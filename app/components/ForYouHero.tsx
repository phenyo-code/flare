"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookies";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string; // Required
  price: number; // Required
  Originalprice?: number | null; // Optional, nullable per schema
  category: string; // Required
  filter: string; // Required
  images: string[]; // Required
  isRecommended: boolean; // Required
  reviews?: any[] | null; // Optional, nullable
  createdAt: Date; // Required
  updatedAt: Date; // Required
  style?: string | null; // Optional, nullable per schema
  type?: string | null; // Optional, nullable per schema
  matchesWith?: string[] | null; // Optional, nullable
  logo?: string | null; // Added from schema, optional
}

interface HeroSectionProps {
  initialProduct: Product | null; // Fallback product
  allProducts: Product[]; // Full product set for personalization
}

export default function ForYouHero({ initialProduct, allProducts }: HeroSectionProps) {
  const [heroProduct, setHeroProduct] = useState<Product | null>(initialProduct);

  useEffect(() => {
    const viewedFiltersCookie = getCookie("user_product_views");

    // Parse viewed products cookie (expecting [{ filter: string, timestamp: number }])
    const viewedProducts: { filter: string; timestamp: number }[] = viewedFiltersCookie
      ? JSON.parse(viewedFiltersCookie)
      : [];

    // If no viewed products, use initialProduct
    if (viewedProducts.length === 0) {
      setHeroProduct(initialProduct);
      return;
    }

    // Find the most recently viewed product
    const latestView = viewedProducts.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest
    );

    // Match the latest viewed filter to a product in allProducts
    const selectedProduct = allProducts.find(
      (product) =>
        product.filter &&
        latestView.filter &&
        product.filter.toLowerCase() === latestView.filter.toLowerCase()
    ) || initialProduct;

    setHeroProduct(selectedProduct);
  }, [initialProduct, allProducts]);

  if (!heroProduct) {
    return <p>No product available to display.</p>;
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