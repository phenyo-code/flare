// app/product/[id]/ReturnPolicyTrigger.tsx
"use client";

import { useState } from "react";
import { FaBoxOpen, FaChevronRight } from "react-icons/fa";
import SlidingReturnPolicy from "./SlidingReturnPolicy";

export default function ReturnPolicyTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div
        className="flex items-center justify-between mt-2 border-t pt-2 cursor-pointer bg-ora hover:text-red-500 transition-colors duration-200"
        onClick={handleOpen}
      >
        <div className="flex items-center">
          <FaBoxOpen className="text-gray-600" />
          <p className="text-sm font-semibold text-gray-400 mx-2">Return Policy</p>
        </div>
        <FaChevronRight className="text-gray-400" />
      </div>
      <SlidingReturnPolicy isOpen={isOpen} onCloseAction={handleClose} />
    </>
  );
}