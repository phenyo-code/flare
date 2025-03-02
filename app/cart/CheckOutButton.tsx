"use client";

import { useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { startCheckout } from "@/actions/startCheckout";
import { useCartStore } from "../store/cartStore";

interface CheckoutButtonProps {
  orderId: string;
}

export default function CheckoutButton({ orderId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const isUpdating = useCartStore((state) => state.isUpdating());

  console.log("CheckoutButton: isUpdating =", isUpdating);

  const handleCheckout = () => {
    if (isUpdating) return; // Prevent clicking during updates
    setLoading(true);
    console.log("CheckoutButton: Starting checkout with orderId:", orderId);
    
    startCheckout(orderId)
      .catch((error) => {
        console.error("Checkout failed:", error);
        setLoading(false);
      });
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || isUpdating}
      className={`flex items-center justify-center gap-2 px-6 py-2 font-bold text-white rounded-md w-full ${
        loading || isUpdating
          ? "bg-green-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-700"
      }  duration-300`}
    >
      {loading ? (
        <>
          <FaCheckCircle className="animate-bounce" />
          Redirecting...
        </>
      ) : isUpdating ? (
        <>
          <FaSpinner className="animate-spin" />
          Please Wait...
        </>
      ) : (
        <>Proceed to Checkout</>
      )}
    </button>
  );
}
