"use client";

import { FaTruck } from "react-icons/fa";

export default function FreeDeliveryBanner() {
  return (
    <div className="bg-black text-gray-400 text-center py-3 text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <span>Free deliveries for orders from R1000</span>
        <FaTruck className="text-gray-400 text-lg" />
      </div>
    </div>
  );
}
