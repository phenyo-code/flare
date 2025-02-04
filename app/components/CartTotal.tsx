"use client";

import { useState, useEffect } from "react";

interface CartTotalProps {
  total: number;
}

export default function CartTotal({ total }: CartTotalProps) {
  const [finalTotal, setFinalTotal] = useState(total);
  const deliveryFee = 100;
  const freeDeliveryThreshold = 1000;

  useEffect(() => {
    if (total < freeDeliveryThreshold) {
      setFinalTotal(total + deliveryFee);
    } else {
      setFinalTotal(total);
    }
  }, [total]);

  return (
    <div className="mt-6 flex flex-col items-end">
      {total >= freeDeliveryThreshold ? (
        <p className="text-green-600 text-sm font-semibold">Free Delivery</p>
      ) : (
        <p className="text-red-500 text-sm">+R{deliveryFee} for delivery</p>
      )}
      <p className="text-xl font-semibold">Total: R{finalTotal}</p>
    </div>
  );
}

