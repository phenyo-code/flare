"use client";

import { useState, useEffect } from "react";
import { FaTruck, FaGift, FaTags } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";

interface CartTotalProps {
  total: number;
}

export default function CartTotal({ total }: CartTotalProps) {
  const [finalTotal, setFinalTotal] = useState(total);
  const [discount, setDiscount] = useState(0);
  const { cartItems, isUpdating } = useCartStore();
  const deliveryFee = 100;
  const freeDeliveryThreshold = 1000;

  useEffect(() => {
    let newTotal = total;
    let discountPercentage = 0;

    // Apply discounts based on total price
    if (total >= 3000) {
      discountPercentage = 15;
    } else if (total >= 2500) {
      discountPercentage = 10;
    } else if (total >= 2000) {
      discountPercentage = 5;
    }

    if (discountPercentage > 0) {
      const discountAmount = (total * discountPercentage) / 100;
      newTotal -= discountAmount;
      setDiscount(discountAmount);
    } else {
      setDiscount(0);
    }

    if (!isUpdating()) {
      setFinalTotal(newTotal);
      return;
    }

    // Real-time total update during cart updates
    const realTimeTotal = cartItems.reduce(
      (sum, item) => sum + item.pricePerItem * item.quantity,
      0
    );

    const startValue = finalTotal;
    const endValue = realTimeTotal;
    const duration = 2300;
    const steps = 20;
    const stepValue = (endValue - startValue) / steps;
    let currentStep = 0;

    const animate = setInterval(() => {
      currentStep += 1;
      const newValue = startValue + stepValue * currentStep;
      setFinalTotal(Math.round(newValue));

      if (currentStep >= steps) {
        clearInterval(animate);
        setFinalTotal(endValue);
      }
    }, duration / steps);

    return () => clearInterval(animate);
  }, [total, cartItems, isUpdating, finalTotal]);

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

      {discount > 0 && (
        <div className="flex items-center">
        <FaTags className="text-sm text-green-600 mr-2" />
        <p className="text-sm text-green-600 font-semibold">
          Saved: R{discount.toFixed(2)}
        </p>
        </div>
      )}

      <p className="text-xl font-semibold">Total: R{finalTotal.toFixed(2)}</p>
    </div>
  );
}
