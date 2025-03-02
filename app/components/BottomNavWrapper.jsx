"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import Link from "next/link";
import { FiX } from "react-icons/fi";

export default function BottomNavWrapper({ cartItems }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add menu state
  const pathname = usePathname();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(mediaQuery.matches);
    mediaQuery.addEventListener("change", (e) => setIsStandalone(e.matches));
    return () => mediaQuery.removeEventListener("change", (e) => setIsStandalone(e.matches));
  }, []);

  return (
    <>
      <BottomNav
        cartItems={cartItems}
        isStandalone={isStandalone}
        activePath={pathname}
        onMenuToggle={() => setIsMenuOpen(true)}
      />
      {/* Side Menu (matches Header) */}
      {isMenuOpen && (
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white text-black z-50 transition-transform duration-300 ease-in-out shadow-lg ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-6">
            <FiX
              className="text-red-600 text-2xl cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
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
          </ul>
        </div>
      )}
    </>
  );
}