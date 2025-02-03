"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookies";
import ProductList from "./ProductList";  // Assuming ProductList is the component that displays products
import { Product } from "@prisma/client";
import InteractionMessage from "@/components/InteractionMessage"; // Import the InteractionMessage component

interface PersonalizedProductListProps {
  allProducts: Product[]; // Assuming all products are passed from the server or are already available in the app
}

export default function PersonalizedProductList({ allProducts }: PersonalizedProductListProps) {
  const [personalizedProducts, setPersonalizedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const viewedProducts = getCookie("user_product_views");
    const searchedProducts = getCookie("user_searches");

    // Initialize the set of product IDs to filter
    let productIds: string[] = [];
    
    // Process viewed products
    if (viewedProducts) {
      const viewedProductIds: string[] = JSON.parse(viewedProducts);  // Array of product IDs
      productIds = [...productIds, ...viewedProductIds]; // Add viewed product IDs
    }

    // Process searched products (this is based on product names, you might need to adjust based on your schema)
    if (searchedProducts) {
      const searchTerms: string[] = JSON.parse(searchedProducts);  // Array of search terms
      const matchingProductIds = allProducts
        .filter((product) =>
          searchTerms.some((term) => product.name.toLowerCase().includes(term.toLowerCase()))
        )
        .map((product) => product.id); // Find products that match any of the search terms

      productIds = [...productIds, ...matchingProductIds]; // Add matching products from searches
    }

    // Filter the available products to only include those that match the viewed/search criteria
    const filteredProducts = allProducts.filter((product) => productIds.includes(product.id));

    setPersonalizedProducts(filteredProducts);
    setLoading(false); // Done with fetching data
  }, [allProducts]); // Dependency array ensures it reruns if allProducts change

  if (loading) {
    return <div>Loading personalized products...</div>; // Show loading message
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
