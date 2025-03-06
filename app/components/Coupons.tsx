"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaTimes, FaCopy } from "react-icons/fa";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  minOrderValue?: number;
}

interface CouponsProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function Coupons({ isOpen, onCloseAction }: CouponsProps) {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Fetch coupons when the component opens
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      const fetchCoupons = async () => {
        const response = await fetch(`/api/coupons?userId=${session.user.id}`);
        const data = await response.json();
        setCoupons(data);
      };
      fetchCoupons();
    }
  }, [isOpen, session]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCloseAction}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      {/* Sliding Panel */}
      <div
        className={`w-full max-w-md bg-white rounded-t-xl p-4 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Coupons</h2>
          <button onClick={onCloseAction} className="text-gray-600">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available</p>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="p-4 bg-gray-100 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{coupon.code}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(coupon.code)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                </div>
                <p className="text-sm">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% off`
                    : `$${coupon.discountValue} off`}
                </p>
                <p className="text-sm text-gray-500">
                  Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                </p>
                {coupon.minOrderValue && (
                  <p className="text-sm text-gray-500">
                    Min. order: ${coupon.minOrderValue}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}