"use client";

import { useState, useTransition } from "react";
import { createCartItemAction } from "../../actions/cart";
import { storeCartItem } from "../../utils/cookies";
import { FaShoppingCart } from "react-icons/fa";

interface AddToCartButtonProps {
  productId: string;
  cartId: string;
  selectedSizeId?: string | null; // Optional, can be null
  onNoSizeSelected?: () => void; // Callback to trigger SlidingSizes
}

export default function AddToCartButton({
  productId,
  cartId,
  selectedSizeId,
  onNoSizeSelected,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSizeId) {
      console.log("No size selected, opening SlidingSizes");
      if (onNoSizeSelected) onNoSizeSelected(); // Trigger SlidingSizes
      return;
    }

    startTransition(async () => {
      try {
        await createCartItemAction(cartId, productId, selectedSizeId);
        storeCartItem(productId, selectedSizeId, 1);
        setIsAdded(true);
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
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
        disabled={isPending || isAdded} // Only disable during pending or after added
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