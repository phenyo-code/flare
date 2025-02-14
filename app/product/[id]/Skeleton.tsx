// components/ProductDetailsSkeleton.tsx

import SearchHeader from "@/components/SearchHeader";
import React from "react";

export default function ProductDetailsSkeleton() {
  return (
    <div>
       <SearchHeader placeholder="Search" />
    <div className="overflow-hidden min-h-screen">
      {/* Header Skeleton */}


      <div className="container bg-white mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section Skeleton */}
          <div className="w-full lg:w-1/2 flex justify-center items-center relative">
            <div className="w-full h-72 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="text-gray-300 text-4xl font-bold uppercase">FLARE</span>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="w-full lg:w-1/2 lg:pl-8 mt-2">
            <div className="w-32 h-2 bg-gray-300 animate-pulse rounded-md mb-4"></div> {/* Price */}
            <div className="w-24 h-2 bg-gray-300 animate-pulse rounded-md mb-6"></div> {/* Discount Badge */}

            {/* Product Name Skeleton */}
            <div className="w-48 h-2 bg-gray-300 animate-pulse rounded-md mb-6"></div>

            {/* Sizes Skeleton */}
            <div className="w-32 h-2 bg-gray-300 animate-pulse rounded-md mb-6"></div>

            <span className="w-full block bg-gray-100 h-2 mb-6"></span>

            {/* Shipping Info Skeleton */}
            <div className="w-full p-4 bg-gray-50 rounded-md mb-6">
              <div className="w-36 h-2 bg-gray-300 animate-pulse rounded-md mb-2"></div> {/* User Name */}
              <div className="w-24 h-2 bg-gray-300 animate-pulse rounded-md mb-4"></div> {/* Delivery Info */}
              <div className="w-20 h-2 bg-gray-300 animate-pulse rounded-md mb-4"></div> {/* Shipping Details */}
            </div>

            <span className="w-full block bg-gray-100 h-2"></span>

            {/* Similar Products Skeleton */}
            <div className="w-full h-6 bg-gray-300 animate-pulse rounded-md mb-4"></div>

            {/* Reviews Skeleton */}
            <div className="w-32 h-2 bg-gray-300 animate-pulse rounded-md mb-6"></div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
