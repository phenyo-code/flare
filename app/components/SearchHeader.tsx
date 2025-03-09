"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiShare } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { LuEllipsis } from "react-icons/lu";
import { CgShoppingCart } from "react-icons/cg";
import { useCartStore } from "../store/cartStore";

type SearchHeaderProps = {
  placeholder: string;
};

export default function SearchHeader({ placeholder = "Search..." }: SearchHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartSavings, setCartSavings] = useState(0);

  const { cartItems, couponDiscount } = useCartStore();
  const deliveryFee = 100;
  const freeDeliveryThreshold = 1000;

  useEffect(() => {
    // Calculate cart count
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);

    // Calculate savings (aligned with CartTotal.tsx)
    const subtotal = cartItems.reduce((sum, item) => sum + item.pricePerItem * item.quantity, 0);
    let tieredDiscountPercentage = 0;
    if (subtotal >= 3000) tieredDiscountPercentage = 15;
    else if (subtotal >= 2500) tieredDiscountPercentage = 10;
    else if (subtotal >= 2000) tieredDiscountPercentage = 5;
    const tieredDiscountAmount = tieredDiscountPercentage > 0 ? (subtotal * tieredDiscountPercentage) / 100 : 0;

    // Total savings includes tiered discount and coupon discount
    const totalSavings = tieredDiscountAmount + (couponDiscount || 0);
    setCartSavings(totalSavings);
  }, [cartItems, couponDiscount]);

  function handleSearchClick() {
    router.push("/search");
  }

  function handleShareClick() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert("Link copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy link:", err);
      alert("Failed to copy link. Please copy manually: " + currentUrl);
    });
  }

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function handleMenuNavigation(path: string) {
    router.push(path);
    setIsMenuOpen(false);
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between gap-2 bg-white p-3 shadow-md">
      {/* Back Arrow */}
      <IoIosArrowBack
        onClick={() => router.back()}
        className="text-2xl text-gray-800 cursor-pointer hover:text-orange-500 transition-colors"
      />

      {/* Search Bar */}
      <div className="flex flex-grow items-center border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full p-2 text-gray-800 outline-none bg-gray-50"
          onClick={handleSearchClick}
          readOnly
        />
        <button className="text-gray-800 p-2 hover:text-orange-500 transition-all">
          <FiSearch className="text-xl" />
        </button>
      </div>

      {/* Cart Icon with Count and Savings */}
      <div className="relative flex items-center mx-2">
        <CgShoppingCart
          className="text-2xl text-gray-800 cursor-pointer hover:text-orange-500 transition-colors"
          onClick={() => router.push("/cart")}
        />
        {cartCount > 0 && (
          <>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
            {cartSavings > 0 && (
              <span className="text-xs text-green-600 ml-2 font-semibold whitespace-nowrap">
                -R{cartSavings.toFixed(2)}
              </span>
            )}
          </>
        )}
      </div>

      {/* Share Icon */}
      <FiShare
        className="text-2xl text-gray-800 cursor-pointer hover:text-orange-500 transition-colors mx-2"
        onClick={handleShareClick}
      />

      {/* Three Dots Menu */}
      <div className="relative">
        <LuEllipsis
          className="text-2xl text-gray-800 cursor-pointer hover:text-orange-500 transition-colors mx-2"
          onClick={toggleMenu}
        />
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <ul className="py-2">
              <li
                className="px-4 py-2 text-gray-800 hover:bg-orange-100 hover:text-orange-500 cursor-pointer transition-colors"
                onClick={() => handleMenuNavigation("/")}
              >
                Home
              </li>
              <li
                className="px-4 py-2 text-gray-800 hover:bg-orange-100 hover:text-orange-500 cursor-pointer transition-colors"
                onClick={() => handleMenuNavigation("/wishlist")}
              >
                Wishlist
              </li>
              <li
                className="px-4 py-2 text-gray-800 hover:bg-orange-100 hover:text-orange-500 cursor-pointer transition-colors"
                onClick={() => handleMenuNavigation("/recently-viewed")}
              >
                Recently Viewed
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}