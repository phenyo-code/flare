"use client";

import { useState, useEffect } from "react";
import { FaTruck, FaTags } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";

interface CartTotalProps {
  total: number;
}

export default function CartTotal({ total }: CartTotalProps) {
  const [finalTotal, setFinalTotal] = useState(total);
  const [subtotal, setSubtotal] = useState(total); // Add subtotal state
  const [tieredDiscount, setTieredDiscount] = useState(0);
  const { cartItems, isUpdating, finalTotal: storeFinalTotal } = useCartStore();
  const deliveryFee = 100;
  const freeDeliveryThreshold = 1000;

  useEffect(() => {
    let newTotal = total;
    let tieredDiscountPercentage = 0;

    // Calculate subtotal (total minus delivery fee if applicable)
    const calculatedSubtotal = total - (total < freeDeliveryThreshold ? deliveryFee : 0);
    setSubtotal(calculatedSubtotal);

    // Calculate tiered discount based on subtotal
    if (calculatedSubtotal >= 3000) {
      tieredDiscountPercentage = 15;
    } else if (calculatedSubtotal >= 2500) {
      tieredDiscountPercentage = 10;
    } else if (calculatedSubtotal >= 2000) {
      tieredDiscountPercentage = 5;
    }

    const tieredDiscountAmount = tieredDiscountPercentage > 0 ? (calculatedSubtotal * tieredDiscountPercentage) / 100 : 0;
    newTotal -= tieredDiscountAmount;
    setTieredDiscount(tieredDiscountAmount);

    if (!isUpdating()) {
      setFinalTotal(Math.max(newTotal, 0));
      return;
    }

    const realTimeTotal = cartItems.reduce((sum, item) => sum + item.pricePerItem * item.quantity, 0);
    const startValue = finalTotal;
    const endValue = storeFinalTotal || realTimeTotal - tieredDiscountAmount;
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
        setFinalTotal(Math.max(endValue, 0));
      }
    }, duration / steps);

    return () => clearInterval(animate);
  }, [total, cartItems, isUpdating, storeFinalTotal, finalTotal]);

  return (
    <div className="mt-6 p-4 bg-white rounded-lg  border border-gray-200">
      <div className="space-y-3">
        {/* Delivery Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaTruck
              className={`text-lg ${
                finalTotal >= freeDeliveryThreshold ? "text-green-600" : "text-red-500"
              } mr-2`}
            />
            <p
              className={`text-sm font-medium ${
                finalTotal >= freeDeliveryThreshold ? "text-green-600" : "text-red-500"
              }`}
            >
              {finalTotal >= freeDeliveryThreshold
                ? "Free Delivery!"
                : `+ Delivery Fee`}
            </p>
          </div>
          {finalTotal < freeDeliveryThreshold && (
            <p className="text-xs text-gray-500">
              Spend R{(freeDeliveryThreshold - finalTotal).toFixed(2)} more for free delivery
            </p>
          )}
        </div>

        {/* Tiered Discount */}
        {tieredDiscount > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaTags className="text-lg text-green-600 mr-2" />
              <p className="text-sm font-medium text-green-600">
               Saved: R{tieredDiscount.toFixed(2)}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {subtotal >= 3000 ? "15% off" : subtotal >= 2500 ? "10% off" : "5% off"} applied
            </p>
          </div>
        )}

        {/* Final Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <p className="text-lg font-semibold text-gray-800">Final Total</p>
          <p className="text-xl font-bold text-gray-900 animate-pulse-when-updating">
            R{finalTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        .animate-pulse-when-updating {
          ${isUpdating() ? "animation: pulse 1.5s infinite;" : ""}
        }
      `}</style>
    </div>
  );
}