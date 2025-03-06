// components/CouponInput.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyCoupon } from "@/actions/applyCoupon";
import { FaSpinner } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";

interface CouponInputProps {
  orderId: string;
  userId: string;
  initialTotal: number;
}

export default function CouponInput({ orderId, userId, initialTotal }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setPending, applyCouponDiscount } = useCartStore();

  const handleApplyCoupon = () => {
    if (!couponCode) return;

    startTransition(() => {
      setPending(true);
      applyCoupon(orderId, couponCode, userId)
        .then((result) => {
          if (result.success) {
            applyCouponDiscount(result.discount, result.newTotal); // Update store immediately
            router.refresh(); // Sync with server
          } else {
            console.error(result.error);
            // Optionally reset UI or show error
          }
        })
        .finally(() => {
          setTimeout(() => {
            setPending(false);
            setCouponCode(""); // Clear input after applying
          }, 2000); // 2-second delay like quantity updater
        });
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