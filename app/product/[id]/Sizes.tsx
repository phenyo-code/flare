"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

interface SizesProps {
    productId: string;
    sizes: { id: string; size: string }[];
    cartId?: string;
}

export default function Sizes({ productId, sizes, cartId }: SizesProps) {
    const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold">Available Sizes:</h3>
            <div className="flex gap-2 mt-2 mb-4">
                {sizes.length > 0 ? (
                    sizes.map((size) => (
                        <button
                            key={size.id}
                            onClick={() => setSelectedSizeId(size.id)}
                            className={`border px-4 py-2 rounded-lg 
                                ${selectedSizeId === size.id 
                                    ? "bg-red-500 text-white" // Apply red background when selected
                                    : "hover:bg-red-400 hover:text-white" // Apply hover effect for unselected
                                }`}
                        >
                            {size.size}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500">No sizes available</p>
                )}
            </div>

            {/* Add to Cart Button */}
            {cartId && <AddToCartButton productId={productId} cartId={cartId} selectedSizeId={selectedSizeId} />}
        </div>
    );
}
