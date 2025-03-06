// components/SlidingCoupons.tsx
"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaCopy, FaCheck } from "react-icons/fa";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  maxUses: number;
}

interface SlidingCouponsProps {
  coupons: Coupon[];
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function SlidingCoupons({ coupons, isOpen, onCloseAction }: SlidingCouponsProps) {
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    onCloseAction();
  };

  const handleCopy = (couponId: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCouponId(couponId);
      setTimeout(() => setCopiedCouponId(null), 2000);
    }).catch((err) => {
      console.error("Failed to copy:", err);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div
        className={`w-full max-w-md bg-gray-50 rounded-t-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${isStandalone ? "mb-16" : "mb-0"}`}
        onClick={handleContainerClick}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-base font-medium text-gray-800">Your Coupons</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {coupons.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 text-sm">No valid coupons available</p>
              <p className="text-gray-500 text-xs mt-2">
                Earn more by reviewing products or subscribing to our newsletter!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white shadow-sm rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-left">
                        <p className="text-xl font-semibold text-red-600">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `R${coupon.discountValue}`}{" "}
                          <span className="text-xs uppercase tracking-wide text-red-500">
                            {coupon.discountType === "percentage" ? "Off" : "Discount"}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{coupon.code}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {coupon.maxUses > 1 ? `${coupon.maxUses} uses remaining` : "Single use"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(coupon.id, coupon.code)}
                        className="text-gray-500 hover:text-red-500 transition-colors ml-3"
                        title={copiedCouponId === coupon.id ? "Copied!" : "Copy code"}
                      >
                        {copiedCouponId === coupon.id ? (
                          <FaCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <FaCopy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="h-7 bg-gray-100 text-center flex items-center justify-center text-xs text-gray-600">
                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}