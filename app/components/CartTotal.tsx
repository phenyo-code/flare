// components/CartTotal.tsx
"use client";

import { useState, useEffect } from "react";
import { FaTruck, FaGift, FaTags } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";

interface Coupon {
  discountType: string;
  discountValue: number;
}

interface CartTotalProps {
  total: number;
  coupon: Coupon | null;
}

export default function CartTotal({ total, coupon }: CartTotalProps) {
  const [finalTotal, setFinalTotal] = useState(total);
  const [tieredDiscount, setTieredDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const { cartItems, isUpdating, couponDiscount: storeCouponDiscount, finalTotal: storeFinalTotal } = useCartStore();
  const deliveryFee = 100;
  const freeDeliveryThreshold = 1000;

  useEffect(() => {
    let newTotal = total;
    let tieredDiscountPercentage = 0;

    const subtotal = total - (total < freeDeliveryThreshold ? deliveryFee : 0);
    if (subtotal >= 3000) {
      tieredDiscountPercentage = 15;
    } else if (subtotal >= 2500) {
      tieredDiscountPercentage = 10;
    } else if (subtotal >= 2000) {
      tieredDiscountPercentage = 5;
    }

    const tieredDiscountAmount = tieredDiscountPercentage > 0 ? (subtotal * tieredDiscountPercentage) / 100 : 0;
    newTotal -= tieredDiscountAmount;
    setTieredDiscount(tieredDiscountAmount);

    if (coupon) {
      const calculatedCouponDiscount =
        coupon.discountType === "percentage"
          ? (subtotal * coupon.discountValue) / 100
          : coupon.discountValue;
      newTotal -= calculatedCouponDiscount;
      setCouponDiscount(calculatedCouponDiscount);
    } else if (storeCouponDiscount > 0) {
      newTotal -= storeCouponDiscount;
      setCouponDiscount(storeCouponDiscount);
    } else {
      setCouponDiscount(0);
    }

    if (!isUpdating()) {
      setFinalTotal(Math.max(newTotal, 0));
      return;
    }

    const realTimeTotal = cartItems.reduce((sum, item) => sum + item.pricePerItem * item.quantity, 0);
    const startValue = finalTotal;
    const endValue = storeFinalTotal || realTimeTotal - tieredDiscountAmount - (storeCouponDiscount || 0);
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
  }, [total, cartItems, isUpdating, coupon, storeCouponDiscount, storeFinalTotal]);

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
      {tieredDiscount > 0 && (
        <div className="flex items-center">
          <FaTags className="text-sm text-green-600 mr-2" />
          <p className="text-sm text-green-600 font-semibold">
            Tiered Savings: R{tieredDiscount.toFixed(2)}
          </p>
        </div>
      )}
      {couponDiscount > 0 && (
        <div className="flex items-center">
          <FaGift className="text-sm text-green-600 mr-2" />
          <p className="text-sm text-green-600 font-semibold">
            Coupon Savings: R{couponDiscount.toFixed(2)}
          </p>
        </div>
      )}
      <p className="text-xl font-semibold">Total: R{finalTotal.toFixed(2)}</p>
    </div>
  );
}