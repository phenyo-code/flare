"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiX, FiUser, FiBox } from "react-icons/fi";
import { IoMdHome } from "react-icons/io";
import { CgShoppingCart } from "react-icons/cg";
import { RiMenu4Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ productId: number; quantity: number; size: string; measurement: string }[]>([]); // Updated to handle cart items with more details
  const [isMounted, setIsMounted] = useState(false); // Track if the component is mounted
  const [isStandalone, setIsStandalone] = useState(false); // Track if the app is in standalone mode
  const { data: session } = useSession(); // Fetch session data using useSession
  const router = useRouter();

  // Set the mounted state to true after component mounts
  useEffect(() => {
    setIsMounted(true);

    // Check if the app is running as a PWA in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
    }
  }, []);

  // Fetch the cart item details when the component mounts
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        if (!session?.user) {
          setCartItems([]); // If no user is logged in, return an empty cart
          return;
        }

        const response = await fetch("/api/cart/items/count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.cartItems); // Assuming the API returns an array of cart items with size and measurement
        } else {
          console.error("Failed to fetch cart item count");
        }
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    fetchCartItemCount();
  }, [session]); // Re-run when session data changes

  // Handle sign out
  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/login"); // Redirect to login page after sign-out
    });
  };

  // Calculate the total number of cart items
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!isMounted) {
    return null; // Prevent rendering until mounted to avoid hydration errors
  }

  return (
    <div className="header w-full bg-white flex flex-col box-border">
      {/* Top Row (Will be hidden in PWA standalone mode) */}
      {!isStandalone && (
        <div className="header-top-row flex justify-between items-center py-2 px-4">
          {/* Logo */}
          <div className="logo flex items-center">
            <Link
              href="/"
              className="text-transparent bg-gradient-to-br from-black to-red-500 bg-clip-text text-2xl font-extrabold tracking-widest uppercase"
            >
              FLARE
            </Link>
          </div>

          {/* Icons */}
          <div className="header-icons flex items-center space-x-4">
            <Link href="/search" prefetch>
              <FiSearch className="text-gray-600 text-2xl cursor-pointer" />
            </Link>
            <div className="cart-icon relative">
              <Link href="/cart" prefetch>
                <FiShoppingCart className="text-gray-600 text-2xl cursor-pointer" />
                {/* Show the cart item count as a very small bubble */}
                {totalCartItems > 0 && (
                  <span className="absolute top-[0] right-[0] w-3.5 h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </div>
            {/* Menu Icon */}
            <RiMenu4Line
              className="text-gray-600 text-2xl cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Side Menu (From Right) */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white text-black z-50 transition-transform duration-300 ease-in-out shadow-lg ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <FiX
            className="text-red-600 text-2xl cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>

        {/* Menu Links */}
        <ul className="flex flex-col m-0 p-0">
          <Link href="/profile" className="text-gray-800" prefetch>
            <li className="py-4 px-6 border-b border-gray-200">Profile</li>
          </Link>
          <Link href="/settings" className="text-gray-800" prefetch>
            <li className="py-4 px-6 border-b border-gray-200">Settings</li>
          </Link>
          <Link href="/wishlist" className="text-gray-800" prefetch>
            <li className="py-4 px-6 border-b border-gray-200">Wishlist</li>
          </Link>
          <Link href="/orders" className="text-gray-800" prefetch>
            <li className="py-4 px-6 border-b border-gray-200">Orders</li>
          </Link>
          <Link href="/help" className="text-gray-800" prefetch>
            <li className="py-4 px-6 border-b border-gray-200">Help</li>
          </Link>
          <Link href="/admin" className="text-gray-800" prefetch>
            <li className="py-4 px-6 border-b border-gray-200">Admin Dashboard</li>
          </Link>

          {/* Conditionally show the logout or login button */}
          {session ? (
            <a href="/signout" className="w-full text-white bg-red-500 font-bold p-2">
              <li className="py-4 px-6">Logout</li>
            </a>
          ) : (
            <Link href="/login" className="text-blue-500 font-bold" prefetch>
              <li className="py-4 px-6 border-b border-gray-200">Login</li>
            </Link>
          )}
        </ul>
      </div>

      {/* Bottom Navigation Bar (Only visible in standalone PWA mode) */}
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
      width: "50px",  // Decreased size
      height: "50px", // Decreased size
      borderRadius: "30px", // Rounded corners
    }}
  >
    <CiSearch className="text-3xl font-bold" />
  </div>
</Link>


    <div className="relative flex flex-col items-center">
      <Link href="/cart" className="text-gray-600 flex flex-col items-center">
        <CgShoppingCart className="text-3xl" />
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
