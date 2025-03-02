"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiX, FiUser, FiBox } from "react-icons/fi";
import { IoMdHome } from "react-icons/io";
import { CgShoppingCart } from "react-icons/cg";
import { RiMenu4Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const StandaloneHeader = () => {
  const [cartItems, setCartItems] = useState([]);
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
          headers: {
            "Content-Type": "application/json",
          },
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

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="header w-full bg-white flex flex-col box-border">
      {isStandalone && (
        <div className="flex flex-col items-center bg-white">
          {/* Back Button */}
          <div className="flex w-full items-center mb-2">
            <div className="text-transparent bg-gradient-to-br ml-4 mt-2 from-black to-red-500 bg-clip-text text-2xl font-extrabold tracking-widest uppercase">
              FLARE
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneHeader;
