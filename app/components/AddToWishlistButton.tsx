// components/AddToWishlistButton.tsx
"use client";

import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";

interface AddToWishlistButtonProps {
  productId: string;
}

export default function AddToWishlistButton({ productId }: AddToWishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.includes(productId));
  }, [productId]);

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (wishlist.includes(productId)) {
      const updatedWishlist = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      wishlist.push(productId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      className={`p-2 rounded-full ${
        isWishlisted ? "text-orange-500" : " text-gray-700"
      }  transition-colors duration-200`}
      aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <FaRegHeart size={20} />
    </button>
  );
}