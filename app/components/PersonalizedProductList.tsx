"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookies";
import ProductList from "./ProductList";  // Assuming ProductList is the component that displays products
import { Product } from "@prisma/client";
import InteractionMessage from "@/components/InteractionMessage"; // Import the InteractionMessage component
import ProductListSkeleton from "@/components/ProductListSkeleton"; // Import the ProductListSkeleton component

interface PersonalizedProductListProps {
  allProducts: Product[]; // Assuming all products are passed from the server or are already available in the app
}

export default function PersonalizedProductList({ allProducts }: PersonalizedProductListProps) {
  const [personalizedProducts, setPersonalizedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const viewedFilters = getCookie("user_product_views");
    const searchedProducts = getCookie("user_searches");

    // Initialize the set of filters to apply
    let filters: string[] = [];
    
    // Process viewed filters
    if (viewedFilters) {
      const viewedProductFilters: string[] = JSON.parse(viewedFilters);  // Array of product filters
      filters = [...filters, ...viewedProductFilters]; // Add viewed product filters
    }

    // Process searched products (this is based on search terms, you might need to adjust based on your schema)
    if (searchedProducts) {
      const searchTerms: string[] = JSON.parse(searchedProducts);  // Array of search terms
      const matchingProductFilters = allProducts
        .filter((product) =>
          searchTerms.some((term) => product.name.toLowerCase().includes(term.toLowerCase()))
        )
        .map((product) => product.filter); // Find products that match any of the search terms and store their filter

      filters = [...filters, ...matchingProductFilters]; // Add matching product filters from searches
    }

    // Filter the available products to only include those that match the viewed/search filter criteria
    const filteredProducts = allProducts.filter((product) =>
      filters.some((filter) => product.filter.toLowerCase().includes(filter.toLowerCase()))
    );

    setPersonalizedProducts(filteredProducts);
    setLoading(false); // Done with fetching data
  }, [allProducts]); // Dependency array ensures it reruns if allProducts change

  if (loading) {
    return <ProductListSkeleton />; // Show skeleton loading state instead of text
  }

  return (
    <div>
      {/* Conditionally render ProductList or InteractionMessage */}
      {personalizedProducts.length > 0 ? (
        <ProductList products={personalizedProducts} />
      ) : (
        <InteractionMessage /> // Show interaction message if no personalized products
      )}
    </div>
  );
}
