"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

interface SizesProps {
    productId: string;
    sizes: { id: string; size: string; quantity: number }[];
    cartId?: string;
}

export default function Sizes({ productId, sizes, cartId }: SizesProps) {
    const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

    return (
        <div className="mt-6 mx-4 mb-2">
            <div className="flex gap-2 mt-10 mb-10">
                {sizes.length > 0 ? (
                    sizes.map((size) => {
                        const isOutOfStock = size.quantity === 0;
                        return (
                            <button
                                key={size.id}
                                onClick={() => !isOutOfStock && setSelectedSizeId(size.id)}
                                disabled={isOutOfStock}
                                className={`border px-4 py-2 rounded-lg  
                                    ${isOutOfStock 
                                        ? " text-gray-300 cursor-not-allowed" // Gray out if out of stock
                                        : selectedSizeId === size.id 
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

            {/* Add to Cart Button */}
            {cartId && <AddToCartButton productId={productId} cartId={cartId} selectedSizeId={selectedSizeId} />}
        </div>
    );
}
