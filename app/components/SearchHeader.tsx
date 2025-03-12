// components/SearchHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiShare } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { LuEllipsis } from "react-icons/lu";
import { CgShoppingCart } from "react-icons/cg";
import { useSession } from "next-auth/react";
import { FaWhatsapp, FaTwitter, FaFacebook, FaLink } from "react-icons/fa";

type SearchHeaderProps = {
  placeholder?: string;
};

export default function SearchHeader({ placeholder = "Search FLARE..." }: SearchHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartSavings, setCartSavings] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!session?.user) {
          setCartCount(0);
          setCartSavings(0);
          return;
        }

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
    const shareData = {
      title: document.title,
      text: "Check out a product I found on FLARE!",
      url: currentUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator
        .share(shareData)
        .catch((err) => console.error("Share failed:", err));
    } else {
      setIsShareOpen(true);
    }
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Link copied!");
        setIsShareOpen(false);
      })
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
        <IoIosArrowBack
          onClick={() => router.back()}
          className="text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200"
        />

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

        <div className="flex items-center space-x-4">
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

          <FiShare
            className="text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200"
            onClick={handleShareClick}
          />

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

      {/* Bottom Sheet for Sharing */}
      {isShareOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsShareOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-50 max-w-screen-xl mx-auto p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Share</h3>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={() => setIsShareOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 text-center mb-4">
              Check out a product I found on FLARE!
            </p>
            <div className="grid grid-cols-3 gap-4">
              <button
                className="flex flex-col items-center text-gray-700 hover:text-green-500 transition-colors duration-200"
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      "Check out a product I found on FLARE! " + window.location.href
                    )}`,
                    "_blank"
                  )
                }
              >
                <FaWhatsapp className="text-2xl" />
                <span className="text-sm mt-1">WhatsApp</span>
              </button>
              <button
                className="flex flex-col items-center text-gray-700 hover:text-blue-400 transition-colors duration-200"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      "Check out a product I found on FLARE! " + window.location.href
                    )}`,
                    "_blank"
                  )
                }
              >
                <FaTwitter className="text-2xl" />
                <span className="text-sm mt-1">Twitter</span>
              </button>
              <button
                className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  )
                }
              >
                <FaFacebook className="text-2xl" />
                <span className="text-sm mt-1">Facebook</span>
              </button>
              <button
                className="flex flex-col items-center text-gray-700 hover:text-red-500 transition-colors duration-200"
                onClick={handleCopyLink}
              >
                <FaLink className="text-2xl" />
                <span className="text-sm mt-1">Copy Link</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}