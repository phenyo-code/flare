"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiShare } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { LuEllipsis } from "react-icons/lu";
import { CgShoppingCart } from "react-icons/cg";
import { useSession } from "next-auth/react";

type SearchHeaderProps = {
  placeholder?: string;
};

export default function SearchHeader({ placeholder = "Search FLARE..." }: SearchHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartSavings, setCartSavings] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!session?.user) {
          setCartCount(0);
          setCartSavings(0);
          return;
        }

        // Fetch cart count
        const countResponse = await fetch("/api/cart/items/count", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (countResponse.ok) {
          const countData = await countResponse.json();
          const totalItems = countData.cartItems.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
          );
          setCartCount(totalItems);
        } else {
          console.error("Failed to fetch cart count");
          setCartCount(0);
        }

        // Fetch cart savings
        const savingsResponse = await fetch("/api/cart/items/savings", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (savingsResponse.ok) {
          const savingsData = await savingsResponse.json();
          setCartSavings(parseFloat(savingsData.totalSavings));
        } else {
          console.error("Failed to fetch savings");
          setCartSavings(0);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartCount(0);
        setCartSavings(0);
      }
    };

    fetchCartData();
  }, [session]);

  const handleSearchClick = () => router.push("/search");
  const handleShareClick = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => alert("Link copied!"))
      .catch((err) => {
        console.error("Failed to copy link:", err);
        alert("Failed to copy link: " + currentUrl);
      });
  };
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleMenuNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
        {/* Back Arrow */}
        <IoIosArrowBack
          onClick={() => router.back()}
          className="text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200"
        />

        {/* Search Bar */}
        <div className="flex flex-grow mx-4 items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-red-500 transition-all duration-200">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-3 py-2 text-gray-700 bg-transparent outline-none placeholder-gray-400"
            onClick={handleSearchClick}
            readOnly
          />
          <button className="p-2 text-gray-700 hover:text-red-500 transition-colors duration-200">
            <FiSearch className="text-xl" />
          </button>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon with Count and Savings */}
          <div className="relative flex flex-col items-center">
            <CgShoppingCart
              id="cart-icon"
              className="text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200"
              onClick={() => router.push("/cart")}
            />
            {cartCount > 0 && (
              <>
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[8.5px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
                {cartSavings > 0 && (
                  <span className="absolute -bottom-4 text-[8.5px] text-white bg-red-500 px-1 py-1 rounded-full font-semibold whitespace-nowrap items-center justify-center">
                    - R{cartSavings.toFixed(2)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Share Icon */}
          <FiShare
            className="text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200"
            onClick={handleShareClick}
          />

          {/* Three Dots Menu */}
          <div className="relative">
            <LuEllipsis
              className="text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200"
              onClick={toggleMenu}
            />
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors duration-200"
                    onClick={() => handleMenuNavigation("/")}
                  >
                    Home
                  </li>
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors duration-200"
                    onClick={() => handleMenuNavigation("/wishlist")}
                  >
                    Wishlist
                  </li>
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors duration-200"
                    onClick={() => handleMenuNavigation("/recently-viewed")}
                  >
                    Recently Viewed
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}