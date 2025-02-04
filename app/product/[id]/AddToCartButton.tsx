"use client";

import { useState, useTransition } from "react";
import { createCartItemAction } from "../../actions/cart";
import { storeCartItem } from "../../utils/cookies"; // Import function to store in cookies
import { FaShoppingCart } from "react-icons/fa";  // Import the cart icon

interface AddToCartButtonProps {
    productId: string;
    cartId: string;
    selectedSizeId?: string;  // Make it optional but required for adding
}

export default function AddToCartButton({ productId, cartId, selectedSizeId }: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);  // For animation

    const handleAddToCart = () => {
        if (!selectedSizeId) {
            console.error("No size selected");
            return;
        }

        startTransition(async () => {
            try {
                await createCartItemAction(cartId, productId, selectedSizeId);
                storeCartItem(productId, selectedSizeId, 1); // Store item in cookies
                setIsAdded(true);
                setIsAnimating(true);  // Trigger animation
                setTimeout(() => {
                    setIsAnimating(false);  // Reset animation after a short duration
                }, 600);
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        });
    };

    return (
        <div>
            <button
                className={`add-to-cart-button font-bold py-2 px-4 w-full ${
                    isAdded ? "bg-red-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-700"
                } text-white flex items-center justify-center`}
                onClick={handleAddToCart}
                disabled={isPending || isAdded || !selectedSizeId}  // Disable if no size selected
            >
                <FaShoppingCart
                    className={`cart-icon mr-2 ${isAnimating ? "added" : ""}`}
                    size={20}
                />
                {isAdded ? "Added to Cart" : isPending ? "Adding..." : "Add to Cart"}
            </button>
        </div>
    );
}
