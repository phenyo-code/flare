"use client";

import { useState, useTransition } from "react";
import { createCartItemAction } from "../../actions/cart";

interface AddToCartButtonProps {
    productId: string;
    cartId: string;
}

export default function AddToCartButton({ productId, cartId }: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        startTransition(async () => {
            try {
                await createCartItemAction(cartId, productId);
                setIsAdded(true); // Update button state to show "Added to Cart"
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        });
    };

    return (
        <button
            className={`font-bold py-2 px-4 rounded ${
                isAdded ? "bg-green-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-700"
            } text-white`}
            onClick={handleAddToCart}
            disabled={isPending || isAdded}
        >
            {isAdded ? "Added to Cart" : isPending ? "Adding..." : "Add to Cart"}
        </button>
    );
}
