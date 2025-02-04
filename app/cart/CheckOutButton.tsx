"use client";

import { useState } from "react";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

export default function CheckoutButton() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 3000); // Reset animation after 3 seconds
  };

  return (
    <Link href="/check-out">
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-6 py-2 font-bold text-white rounded-md w-full
          ${clicked ? "bg-green-500 scale-90" : "bg-green-500 hover:bg-green-700"}
          transition-all duration-300`}
      >
        {clicked ? (
          <>
            <FaCheckCircle className="animate-bounce" />
            Redirecting...
          </>
        ) : (
          <>
            <FaShoppingCart className="animate-spin" />
            Proceed to Checkout
          </>
        )}
      </button>
    </Link>
  );
}
