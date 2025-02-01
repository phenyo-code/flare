"use client";

import { useState, useTransition } from "react";
import { createCartItemAction } from "../../actions/cart";

interface AddToCartButtonProps {
    productId: string;
    cartId: string;
    selectedSizeId?: string;  // Make it optional but required for adding
}

export default function AddToCartButton({ productId, cartId, selectedSizeId }: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!selectedSizeId) {
            console.error("No size selected");
            return;
        }

        startTransition(async () => {
            try {
                await createCartItemAction(cartId, productId, selectedSizeId);
                setIsAdded(true);
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        });
    };

    return (
        <button
            className={`font-bold py-2 px-4 ${
                isAdded ? "bg-green-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-700"
            } text-white`}
            onClick={handleAddToCart}
            disabled={isPending || isAdded || !selectedSizeId}  // Disable if no size selected
        >
            {isAdded ? "Added to Cart" : isPending ? "Adding..." : "Add to Cart"}
        </button>
    );
}
