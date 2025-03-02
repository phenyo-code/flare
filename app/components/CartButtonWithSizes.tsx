"use client";

import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import SlidingSizes from "./SlidingSizes";

interface Size {
  id: string;
  size: string;
  quantity: number;
  measurement: string;
}

interface CartButtonWithSizesProps {
  productId: string;
  sizes: Size[];
  cartId?: string;
}

export default function CartButtonWithSizes({ productId, sizes, cartId }: CartButtonWithSizesProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to ProductLink
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
      >
        <FaShoppingCart className="text-lg" />
      </button>
      <SlidingSizes
        productId={productId}
        sizes={sizes}
        cartId={cartId}
        isOpen={isOpen}
        onCloseAction={() => setIsOpen(false)}
        isLoggedIn={!!cartId} // Pass login status
        images={[]}      />
    </>
  );
}