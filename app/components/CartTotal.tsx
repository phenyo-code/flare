"use client";

import { useState, useEffect } from "react";
import { FaTruck } from "react-icons/fa";

interface CartTotalProps {
  total: number;
}

export default function CartTotal({ total }: CartTotalProps) {
  const [finalTotal, setFinalTotal] = useState(total);
  const deliveryFee = 100; // Updated to R100
  const freeDeliveryThreshold = 1000;

  useEffect(() => {
    setFinalTotal(total);
  }, [total]);

  return (
    <div className="mt-6 flex flex-col items-end">
      {total >= freeDeliveryThreshold ? (
        <div className="flex items-center">
          <FaTruck className="text-sm text-green-600 mr-2" />
        <p className="text-green-600 text-sm font-semibold">Free Delivery</p>
        </div>
      ) : (
        <div className="flex items-center">
          <FaTruck className="text-sm text-red-500 mr-2" />
        <p className="text-red-500 text-sm">+R{deliveryFee} for delivery</p>
      </div> // Updated delivery fee to R100
      )}
      <p className="text-xl font-semibold">Total: R{finalTotal}</p>
    </div>
  );
}
