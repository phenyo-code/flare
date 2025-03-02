"use client";

import { useState, useEffect } from "react";
import { FaTruck } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";

interface CartTotalProps {
  total: number;
}

export default function CartTotal({ total }: CartTotalProps) {
  const [finalTotal, setFinalTotal] = useState(total);
  const isUpdating = useCartStore((state) => state.isUpdating());
  const deliveryFee = 100; // Updated to R100
  const freeDeliveryThreshold = 1000;

  useEffect(() => {
    if (!isUpdating) {
      // If not updating, set finalTotal directly to total
      setFinalTotal(total);
      return;
    }

    // When updating, animate the transition
    const startValue = finalTotal;
    const endValue = total;
    const duration = 800; // Animation duration in ms (1 second)
    const steps = 20; // Number of animation steps
    const stepValue = (endValue - startValue) / steps;
    let currentStep = 0;

    const animate = setInterval(() => {
      currentStep += 1;
      const newValue = startValue + stepValue * currentStep;
      setFinalTotal(Math.round(newValue)); // Round to avoid decimals

      if (currentStep >= steps) {
        clearInterval(animate);
        setFinalTotal(endValue); // Ensure final value matches total
      }
    }, duration / steps);

    // Cleanup interval on unmount or new update
    return () => clearInterval(animate);
  }, [total, isUpdating, finalTotal]);

  return (
    <div className="mt-6 flex flex-col items-end">
      {finalTotal >= freeDeliveryThreshold ? (
        <div className="flex items-center">
          <FaTruck className="text-sm text-green-600 mr-2" />
          <p className="text-green-600 text-sm font-semibold">Free Delivery</p>
        </div>
      ) : (
        <div className="flex items-center">
          <FaTruck className="text-sm text-red-500 mr-2" />
          <p className="text-red-500 text-sm">+R{deliveryFee} for delivery</p>
        </div>
      )}
      <p className="text-xl font-semibold">Total: R{finalTotal}</p>
    </div>
  );
}