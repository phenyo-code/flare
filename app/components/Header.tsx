"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<number>(0); // Start with 0 items in cart
  const { data: session } = useSession();  // Fetch session data using useSession
  const router = useRouter();

  // Fetch the cart item count when the component mounts
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        if (!session?.user) {
          setCartItems(0);
          return; // If no user is logged in, return 0 cart items
        }

        const response = await fetch("/api/cart/items/count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.count); // Assuming the API returns { count: <number> }
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
      router.push("/login");  // Redirect to login page after sign-out
    });
  };

  return (
    <div className="header w-full bg-white flex flex-col box-border">
      {/* Top Row */}
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
          <Link href="/search">
            <FiSearch className="text-gray-600 text-2xl cursor-pointer" />
          </Link>
          <div className="cart-icon relative">
            <Link href="/cart">
              <FiShoppingCart className="text-gray-600 text-2xl cursor-pointer" />
              {/* Show the cart item count as a very small bubble */}
              {cartItems > 0 && (
                <span className="absolute top-[-8] right-[-7] w-3.5 h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>
          </div>
          {/* Menu Icon */}
          <FiMenu
            className="text-gray-600 text-2xl cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </div>

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
        <Link href="/profile" className="text-gray-800">
          <li className="py-4 px-6 border-b border-gray-200">
            
              Profile
            
          </li>
          </Link>
          <Link href="/settings" className="text-gray-800">
          <li className="py-4 px-6 border-b border-gray-200">
            
              Settings
            
          </li>
          </Link>
          <Link href="/wishlist" className="text-gray-800">
          <li className="py-4 px-6 border-b border-gray-200">
            
              Wishlist
            
          </li>
          </Link>
          <Link href="/orders" className="text-gray-800">
          <li className="py-4 px-6 border-b border-gray-200">
            
              Orders
            
          </li>
          </Link>
          <Link href="/help" className="text-gray-800">
          <li className="py-4 px-6 border-b border-gray-200">
            
              Help
            
          </li>
          </Link>

         
          <Link href="/admin" className="text-gray-800">
            <li className="py-4 px-6 border-b border-gray-200">
              
                Admin Dashboard
              
            </li>
            </Link>
        

          {/* Conditionally show the logout or login button */}
          {session ? (
            <a href="/signout" 
            className="w-full text-red-800  font-bold p-2"
          >
            <li className="py-4 px-6 border-b border-gray-200">
              
                Logout
              
            </li>
            </a>
          ) : (
            <Link href="/login" className="text-red-800  font-bold">
            <li className="py-4 px-6 border-b border-gray-200">
              
                Login
              
            </li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;









