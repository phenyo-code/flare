// components/ProductCardSkeleton.tsx

import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="product-card shadow-md rounded-md overflow-hidden bg-gray-300 animate-pulse">
      {/* Image with "FLARE" text centered */}
      <div className="w-full h-48 relative bg-gray-400">
        <div className="absolute inset-0 flex justify-center items-center text-white font-bold text-4xl">
          FLARE
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Title Skeleton */}
        <div className="w-full h-6 bg-gray-400 rounded-md"></div>
        
        {/* Price Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-20 h-6 bg-gray-400 rounded-md"></div>
        </div>

        {/* Discount Skeleton */}
        <div className="w-16 h-6 bg-gray-400 rounded-md mt-2"></div>
      </div>
    </div>
  );
}
