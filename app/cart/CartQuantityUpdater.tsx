"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCartQuantity } from "@/actions/updateCartQuantity";
import { FaSpinner } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setPending, updateItemQuantity } = useCartStore();

  const handleUpdate = (newQuantity: number) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    updateItemQuantity(cartItemId, newQuantity, pricePerItem); // Update store immediately

    startTransition(() => {
      console.log("Starting quantity update, incrementing pendingUpdates");
      setPending(true);
      updateCartQuantity(cartItemId, newQuantity)
        .then((result) => {
          if (result.success) {
            console.log("Quantity update successful, refreshing page");
            router.refresh();
          } else {
            setQuantity(initialQuantity);
            console.error(result.error);
          }
        })
        .finally(() => {
          setTimeout(() => {
            console.log("Quantity update complete, decrementing pendingUpdates");
            setPending(false);
          }, 3000); // 2-second delay
        });
    });
  };

  return (
    <div className="flex items-center space-x-1 mt-2 border text-gray-400 border-gray-200 rounded max-w-max">
      <button
        onClick={() => handleUpdate(quantity - 1)}
        disabled={isPending || quantity <= 1}
        className={`px-2 py-1 bg-gray-100 text-xs font-semibold ${
          isPending || quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:bg-gray-200"
        }`}
      >
        -
      </button>
      <span className="px-1 text-xs flex items-center min-w-[20px] justify-center">
        {isPending ? <FaSpinner className="animate-spin text-gray-400" size={12} /> : quantity}
      </span>
      <button
        onClick={() => handleUpdate(quantity + 1)}
        disabled={isPending}
        className={`px-2 py-1 bg-gray-100 text-xs font-semibold ${
          isPending ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:bg-gray-200"
        }`}
      >
        +
      </button>
    </div>
  );
}