"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

interface Size {
  id: string;
  size: string;
  quantity: number;
  measurement: string; // Added measurement field
}

interface SizesProps {
  productId: string;
  sizes: Size[];
  cartId?: string;
}

export default function Sizes({ productId, sizes, cartId }: SizesProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  return (
    <div className="mt-10 mx-4 mb-2">
      {/* Display Measurement */}
      

      {/* Size Selection Buttons */}
      <p>Size</p>
      <div className="flex gap-2 mt-2 mb-10">
        {sizes.length > 0 ? (
          sizes.map((size) => {
            const isOutOfStock = size.quantity === 0;
            return (
              <button
                key={size.id}
                onClick={() => !isOutOfStock && setSelectedSize(size)}
                disabled={isOutOfStock}
                className={`border px-4 py-2 rounded-lg  
                  ${
                    isOutOfStock
                      ? "text-gray-300 cursor-not-allowed" // Gray out if out of stock
                      : selectedSize?.id === size.id
                      ? "bg-red-500 text-white" // Selected size styling
                      : "hover:bg-red-400 hover:text-white" // Hover effect
                  }`}
              >
                {size.size}
              </button>
            );
          })
        ) : (
          <p className="text-gray-500">No sizes available</p>
        )}
      </div>

      {selectedSize && (
        <div className="mb-4 bg-gray-100 p-4 rounded">
        <p className="mb-4 text-gray-500 font-medium text-xs ">
          Measurement: 
        </p>
        <p className="text-gray-400 mt-2 text-xs mx-2">{selectedSize.measurement}</p>
      </div>
      )}

      {/* Add to Cart Button */}
      {cartId && <AddToCartButton productId={productId} cartId={cartId} selectedSizeId={selectedSize?.id ?? null} />}
    </div>
  );
}
