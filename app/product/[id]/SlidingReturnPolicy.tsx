// app/product/[id]/SlidingReturnPolicy.tsx
"use client";

import { useState } from "react";
import { FaBoxOpen, FaTruck, FaUndo, FaQuestionCircle, FaPhone } from "react-icons/fa";

interface SlidingReturnPolicyProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function SlidingReturnPolicy({ isOpen, onCloseAction }: SlidingReturnPolicyProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    setIsExpanded(false); // Reset expanded state on close
    onCloseAction();
  };

  const toggleExpand = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div
        className={`w-full max-w-md bg-white rounded-t-xl p-6 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={handleContainerClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Return Policy</h2>
          <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <div className="flex items-center">
            <FaBoxOpen className="text-gray-600 mr-2" />
            <p className="text-sm text-gray-600">
              We offer a 30-day return policy for unused items in original condition.
            </p>
          </div>
          <span
            onClick={toggleExpand}
            className="text-red-500 text-sm font-medium mt-2 inline-block cursor-pointer hover:underline"
          >
            {isExpanded ? "Show Less" : "Learn More"}
          </span>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start">
              <FaUndo className="text-red-500 mr-2 mt-1" />
              <div>
                <p className="font-semibold">Eligibility</p>
                <p className="text-sm">
                  Returns are accepted within 30 days of delivery for items that are unused, unworn, and in their original packaging with tags attached.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaTruck className="text-red-500 mr-2 mt-1" />
              <div>
                <p className="font-semibold">Return Shipping</p>
                <p className="text-sm">
                  Free return shipping on orders over R1000. For orders below R1000, a R50 fee applies, deducted from your refund.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaBoxOpen className="text-red-500 mr-2 mt-1" />
              <div>
                <p className="font-semibold">Process</p>
                <p className="text-sm">
                  Initiate a return via your FLARE account. Pack the item securely and drop it off at a designated courier point.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaQuestionCircle className="text-red-500 mr-2 mt-1" />
              <div>
                <p className="font-semibold">Refunds</p>
                <p className="text-sm">
                  Refunds are processed within 7-10 business days after we receive the item. Original shipping costs are non-refundable.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaPhone className="text-red-500 mr-2 mt-1" />
              <div>
                <p className="font-semibold">Support</p>
                <p className="text-sm">
                  Contact us at support@flare.co.za or +27 123 456 789 for assistance with your return.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}