"use client";

import { useState, useEffect } from "react";
import { FaTruck, FaTags, FaGift, FaClock, FaCreditCard } from "react-icons/fa";
import { BiSolidCoupon } from "react-icons/bi";

const messages = [
  { text: "Free deliveries for orders over R1000", icon: <FaTruck className="text-gray-400 text-lg" /> },
  { text: "-5% off on orders over R1000", icon: <FaTags className="text-gray-400 text-lg" /> },
  { text: "-10% off on orders over R2000", icon: <FaGift className="text-gray-400 text-lg" /> },
  { text: "-15% off on orders over R3000", icon: <FaTags className="text-gray-400 text-lg" /> },
  { text: "Fast shipping and delivery", icon: <FaClock className="text-gray-400 text-lg" /> },
  { text: "Secure payments with all major cards", icon: <FaCreditCard className="text-gray-400 text-lg" /> },
  { text: "Exclusive deals for FLARE members", icon: <BiSolidCoupon className="text-gray-400 text-lg" /> },
];

// Make the free delivery message appear more often
const repeatedMessages = [messages[0], ...messages, messages[0]];

export default function FreeDeliveryBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % repeatedMessages.length);
    }, 1500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-gray-400 text-center py-3 text-sm font-medium">
      <div className="flex items-center justify-center gap-2 transition-opacity duration-500 ease-in-out opacity-100">
        {repeatedMessages[currentIndex].icon}
        <span>{repeatedMessages[currentIndex].text}</span>
      </div>
    </div>
  );
}
