"use client";

import { useState, useEffect } from "react";
import { getCookie} from "@/utils/cookies";
import Link from "next/link";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookie_consent");
    if (!consent) {
      setIsVisible(true); // Show banner if no consent cookie exists
    }
  }, []);

  const handleAccept = () => {(true);
    setIsVisible(false);
  };

  const handleDeny = () => {(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to ensure essential functionality, personalize your experience, and analyze site usage. Learn more in our{" "}
          <Link href="/privacy-policy" className="underline hover:text-orange-500">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleAccept}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-4 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200"
          >
            Accept All
          </button>
          <button
            onClick={handleDeny}
            className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-800 transition-all duration-200"
          >
            Deny Non-Essential
          </button>
        </div>
      </div>
    </div>
  );
}