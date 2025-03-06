// components/ReviewableProducts.tsx
"use client";

import { Product } from "@prisma/client";
import ReviewableList from "./ReviewableList";
import { FaComment } from "react-icons/fa";

interface ReviewableProductsProps {
    products: Product[];
  }
  
  export default function ReviewableProducts({ products }: ReviewableProductsProps) {
    return (
      <section className="profile-section bg-whiterounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4 ">
          <FaComment className="mr-2 text-red-500" size={20} />Review
        </h2>
        <p className="text-red-500 hover:text-red-700 text-sm mb-2 font-medium">
         Review your purchased products
        </p>
        <ReviewableList products={products} />
      </section>
    );
  }

