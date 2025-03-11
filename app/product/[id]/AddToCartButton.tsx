"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createCartItemAction } from "../../actions/cart";
import { storeCartItem } from "../../utils/cookies";
import { CgShoppingCart } from "react-icons/cg";

interface AddToCartButtonProps {
  productId: string;
  cartId: string;
  selectedSizeId?: string | null;
  onNoSizeSelected?: () => void;
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [screenshotPos, setScreenshotPos] = useState<{ x: number; y: number } | null>(null);

  const handleAddToCart = () => {
    if (!selectedSizeId) {
      console.log("No size selected, opening SlidingSizes");
      if (onNoSizeSelected) onNoSizeSelected();
      return;
    }

    // Get button position for screenshot start
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (buttonRect) {
      setScreenshotPos({ x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top + buttonRect.height / 2 });
    }

    startTransition(async () => {
      try {
        await createCartItemAction(cartId, productId, selectedSizeId);
        storeCartItem(productId, selectedSizeId, 1);
        setIsAdded(true);
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          setScreenshotPos(null); // Reset after animation
        }, 800); // Match animation duration
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    });
  };

  // Find cart icon position (assumes a cart icon with id="cart-icon" exists)
  useEffect(() => {
    if (isAnimating) {
      const cartIcon = document.getElementById("cart-icon");
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        const targetX = cartRect.left + cartRect.width / 2;
        const targetY = cartRect.top + cartRect.height / 2;
        setScreenshotPos((prev) =>
          prev ? { ...prev, x: targetX, y: targetY } : null
        );
      }
    }
  }, [isAnimating]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className={`font-bold py-3 px-6 w-full rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-300 ${
          isAdded
            ? "bg-gradient-to-r from-orange-500 to-red-500 cursor-not-allowed"
            : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        } ${isPending ? "opacity-75" : ""}`}
        onClick={handleAddToCart}
        disabled={isPending || isAdded}
      >
        <CgShoppingCart
          className={`mr-2 ${isAnimating ? "animate-bounce" : ""}`}
          size={20}
        />
        {isAdded ? "Added to Cart" : isPending ? "Adding..." : "Add to Cart"}
      </button>

      {/* Screenshot animation element */}
      {screenshotPos && isAnimating && (
        <div
          className="absolute w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 font-bold animate-fly-to-cart"
          style={{
            left: `${screenshotPos.x - 24}px`, // Center the 12px width
            top: `${screenshotPos.y - 24}px`, // Center the 12px height
          }}
        >
          <CgShoppingCart size={20} />
        </div>
      )}
    </div>
  );
}