// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiX, FiUser } from "react-icons/fi";
import { IoMdHome } from "react-icons/io";
import { CgShoppingCart } from "react-icons/cg";
import { RiMenu4Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ productId: number; quantity: number; size: string; measurement: string }[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
    }
  }, []);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        if (!session?.user) {
          setCartItems([]);
          return;
        }

        const response = await fetch("/api/cart/items/count", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.cartItems);
        } else {
          console.error("Failed to fetch cart item count");
        }
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    fetchCartItemCount();
  }, [session]);

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/login");
    });
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Close menu when clicking outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="header w-full  flex flex-col box-border shadow-sm">
      {/* Top Row (Hidden in standalone mode) */}
      {!isStandalone && (
        <div className="header-top-row flex justify-between items-center py-3 px-6">
          <div className="logo flex items-center">
            <Link
              href="/"
              className="text-transparent bg-gradient-to-br from-gray-800 to-red-500 bg-clip-text text-xl font-bold tracking-wider uppercase"
            >
              FLARE
            </Link>
          </div>
          <div className="header-icons flex items-center space-x-6">
            <Link href="/search" prefetch>
              <FiSearch className="text-gray-600 text-xl hover:text-gray-800 transition-colors" />
            </Link>
            <div className="cart-icon relative">
              <Link href="/cart" prefetch>
                <FiShoppingCart id="cart-icon" className="text-gray-600 text-xl hover:text-gray-800 transition-colors" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </div>
            <RiMenu4Line
              className="text-gray-600 text-xl hover:text-gray-800 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Side Menu (Only rendered when open, slides from right) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="fixed top-0 right-0 w-72 h-full bg-white shadow-md transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <FiX
                className="text-red-600 text-3xl hover:text-red-500 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
            <ul className="flex flex-col m-0 p-0 text-gray-700">
              <li>
                <Link
                  href="/profile"
                  className="flex items-center justify-between py-3 px-6 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
                  prefetch
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                  <IoIosArrowForward className="text-gray-500 text-sm" />
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="flex items-center justify-between py-3 px-6 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
                  prefetch
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                  <IoIosArrowForward className="text-gray-500 text-sm" />
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between py-3 px-6 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
                  prefetch
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                  <IoIosArrowForward className="text-gray-500 text-sm" />
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="flex items-center justify-between py-3 px-6 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
                  prefetch
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                  <IoIosArrowForward className="text-gray-500 text-sm" />
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="flex items-center justify-between py-3 px-6 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
                  prefetch
                  onClick={() => setIsMenuOpen(false)}
                >
                  Help
                  <IoIosArrowForward className="text-gray-500 text-sm" />
                </Link>
              </li>
              {session?.user?.role === "admin" && (
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center justify-between py-3 px-6 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
                    prefetch
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                    <IoIosArrowForward className="text-gray-500 text-sm" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar (Original Design) */}
      {isStandalone && (
        <div className="bottom-nav w-full bg-white fixed bottom-0 left-0 flex justify-around py-4 border-t shadow-lg z-50 pb-4">
          <Link href="/" className="text-gray-800 flex flex-col items-center pb-4">
            <IoMdHome className="text-3xl" />
          </Link>
          <Link href="/profile" className="text-gray-600 flex flex-col items-center">
            <FiUser className="text-3xl" />
          </Link>
          <Link href="/search" className="text-white flex flex-col items-center relative">
            <div
              className="bg-purple-500 text-white shadow-md transform -translate-y-3"
              style={{
                clipPath: "polygon(75% 0%, 46% 10%, 87% 30%, 93% 60%, 74% 60%, 50% 96%, 20% 90%, 0% 66%, 10% 23%, 20% 10%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
                borderRadius: "30px",
              }}
            >
              <CiSearch className="text-3xl font-bold" />
            </div>
          </Link>
          <div className="relative flex flex-col items-center">
            <Link href="/cart" className="text-gray-600 flex flex-col items-center">
              <CgShoppingCart  id="cart-icon"className="text-3xl" />
              {totalCartItems > 0 && (
                <span className="absolute top-[-6px] right-[-6px] w-3.5 h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <RiMenu4Line
              className="text-3xl text-gray-600 cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;