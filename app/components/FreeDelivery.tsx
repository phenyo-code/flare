"use client";

import { FaTruckMoving } from "react-icons/fa";

export default function FreeDeliveryBanner() {
  return (
    <div className="bg-black text-white text-center py-3 text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <span>Free deliveries for orders over R1050</span>
        <FaTruckMoving className="text-red-500 text-lg" />
      </div>
    </div>
  );
}
