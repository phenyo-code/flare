// components/CouponSection.tsx
"use client";

import { useState } from "react";
import { FaGift } from "react-icons/fa";
import SlidingCoupons from "./SlidingCoupons";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  maxUses: number;
}

interface CouponSectionProps {
  coupons: Coupon[];
}

export default function CouponSection({ coupons }: CouponSectionProps) {
  const [showCoupons, setShowCoupons] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <section className="profile-section bg-white  rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <FaGift className="mr-2 text-red-500" size={20} /> Coupons
        </h2>
        <button
          onClick={() => setShowCoupons(true)}
          className="text-red-500 hover:text-red-600 text-sm font-medium underline transition-colors"
        >
          View Coupons ({coupons.length})
        </button>

        {coupons.length === 0 && (
          <>
            {!showMore ? (
              <button
                onClick={() => setShowMore(true)}
                className="ml-4 text-gray-500 hover:text-gray-600 text-sm font-medium underline transition-colors"
              >
                See More
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowMore(false)}
                  className="ml-4 text-gray-500 hover:text-gray-600 text-sm font-medium underline transition-colors"
                >
                  See Less
                </button>
                <div className="mt-4 text-gray-600 text-sm">
                  <p>No coupons yet? Here’s how to earn them:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Leave reviews on purchased products</li>
                    <li>Subscribe to our newsletter for exclusive offers</li>
                    <li>Place an order to unlock discounts</li>
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </section>
      <SlidingCoupons
        coupons={coupons}
        isOpen={showCoupons}
        onCloseAction={() => setShowCoupons(false)}
      />
    </>
  );
}