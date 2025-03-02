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

    let filters: string[] = [];
    if (viewedFilters) {
      const viewedProductFilters: string[] = JSON.parse(viewedFilters);
      filters = [...filters, ...viewedProductFilters];
    }
    if (searchedProducts) {
      const searchTerms: string[] = JSON.parse(searchedProducts);
      const matchingProductFilters = allProducts
        .filter((product) =>
          searchTerms.some((term) => product.name.toLowerCase().includes(term.toLowerCase()))
        )
        .map((product) => product.filter);
      filters = [...filters, ...matchingProductFilters];
    }

    const filteredProducts = allProducts.filter((product) =>
      filters.some((filter) => product.filter.toLowerCase().includes(filter.toLowerCase()))
    );

    setPersonalizedProducts(filteredProducts);
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