"use client";

import { useState, useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-toastify";
import { applyCoupon } from "@/actions/applyCoupon";

interface CouponInputProps {
  userId: string;
  initialTotal: number;
  orderId: string; // Ensure this is passed from the parent
}

export default function CouponInput({ userId, initialTotal, orderId }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setPending, applyCouponDiscount } = useCartStore();

  const handleApplyCoupon = () => {
    if (!couponCode) return;

    startTransition(async () => {
      setPending(true);
      try {
        console.log("Applying coupon with orderId:", orderId); // Debug log
        const result = await applyCoupon(orderId, couponCode.toUpperCase(), userId);

        if (!result.success) {
          throw new Error(result.error || "Failed to apply coupon");
        }

        applyCouponDiscount(result.discount, result.newTotal);
        toast.success("Coupon applied successfully!");
      } catch (error) {
        console.error("Coupon apply error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to apply coupon");
      } finally {
        setTimeout(() => {
          setPending(false);
          setCouponCode("");
        }, 2000);
      }
    });
  };

  return (
    <div className="mt-2 flex items-center w-full">
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code"
        className="border border-gray-200 bg-gray-50 text-gray-700 text-xs px-6 py-2 rounded-l-md flex-1 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-100"
        disabled={isPending}
      />
      <button
        onClick={handleApplyCoupon}
        disabled={isPending}
        className={`border border-gray-200 bg-black text-white text-xs px-6 py-2 rounded-r-md transition-colors ${
          isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
        }`}
      >
        {isPending ? <FaSpinner className="animate-spin mx-auto" size={12} /> : "Apply"}
      </button>
    </div>
  );
}