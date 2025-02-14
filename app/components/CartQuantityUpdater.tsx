"use client";

import { useState, useTransition } from "react";
import { updateCartQuantity } from "@/actions/updateCartQuantity";

interface CartQuantityUpdaterProps {
  cartItemId: string;
  initialQuantity: number;
  pricePerItem: number;
}

export default function CartQuantityUpdater({
  cartItemId,
  initialQuantity,
  pricePerItem,
}: CartQuantityUpdaterProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isPending] = useTransition(); // Don't need startTransition if we are disabling buttons

  return (
    <div className="flex items-center space-x-1 mt-2 border text-gray-400 border-gray-200 rounded max-w-max">
      <button
        className="px-2 py-1 bg-gray-100 text-xs  text-gray-400 font-semibold"
        disabled={true} // Disable the buttons for now
      >
        -
      </button>
      <span className="px-1 text-xs">{quantity}</span>
      <button
        className="px-2 py-1 bg-gray-100 text-xs text-gray-400 font-semibold"
        disabled={true} // Disable the buttons for now
      >
        +
      </button>
    </div>
  );
}
