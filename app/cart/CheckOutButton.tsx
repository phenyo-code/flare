"use client";

import { useState } from "react";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { startCheckout } from "@/actions/startCheckout";

export default function CheckoutButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await startCheckout(orderId);
    } catch (error) {
      console.error("Checkout failed:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-2 font-bold text-white rounded-md w-full
          ${loading ? "bg-green-500 scale-90" : "bg-green-500 hover:bg-green-700"}
          transition-all duration-300`}
    >
      {loading ? (
        <>
          <FaCheckCircle className="animate-bounce" />
          Redirecting...
        </>
      ) : (
        <>
          
          Proceed to Checkout
        </>
      )}
    </button>
  );
}
