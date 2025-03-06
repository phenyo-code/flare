// components/Footer.tsx
"use client";

import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { subscribeToNewsletter } from "../actions/newsletterAction";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isStandalone, setIsStandalone] = useState(false);
  const [openSections, setOpenSections] = useState({
    quickLinks: false,
    company: false,
    support: false,
  });

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        setMessage(result.message || "Thanks for subscribing!");
        setEmail("");
      } else {
        setError(result.error || "Something went wrong.");
      }
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <footer className="bg-gray-900 text-white py-10 mt-0">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-medium mb-4 text-gray-100">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Stay updated with our latest news and offers.</p>
          <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 bg-gray-800 text-gray-200 rounded text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
              required
              disabled={isPending}
            />
            <button
              type="submit"
              className="p-2 bg-red-500 text-white rounded text-sm transition-all duration-300 ease-in-out hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
            {message && (
              <p className="text-green-400 text-xs mt-2 transition-opacity duration-300 ease-in-out opacity-100">
                {message}
              </p>
            )}
            {error && (
              <p className="text-red-400 text-xs mt-2 transition-opacity duration-300 ease-in-out opacity-100">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Quick Links - Hidden in standalone mode */}
        {!isStandalone && (
          <div>
            <button
              onClick={() => toggleSection("quickLinks")}
              className="w-full flex items-center justify-between text-lg font-medium text-gray-100 mb-4 focus:outline-none"
            >
              Quick Links
              {openSections.quickLinks ? (
                <FaChevronUp className="text-gray-400 text-sm" />
              ) : (
                <FaChevronDown className="text-gray-400 text-sm" />
              )}
            </button>
            {openSections.quickLinks && (
              <ul className="space-y-2 text-sm">
                <li><Link href="/shop" className="text-gray-400 hover:text-gray-200">Shop</Link></li>
                <li><Link href="/cart" className="text-gray-400 hover:text-gray-200">Cart</Link></li>
                <li><Link href="/wishlist" className="text-gray-400 hover:text-gray-200">Wishlist</Link></li>
                <li><Link href="/orders" className="text-gray-400 hover:text-gray-200">Orders</Link></li>
                <li><Link href="/search" className="text-gray-400 hover:text-gray-200">Search</Link></li>
              </ul>
            )}
          </div>
        )}

        {/* Company - Hidden in standalone mode */}
        {!isStandalone && (
          <div>
            <button
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between text-lg font-medium text-gray-100 mb-4 focus:outline-none"
            >
              Company
              {openSections.company ? (
                <FaChevronUp className="text-gray-400 text-sm" />
              ) : (
                <FaChevronDown className="text-gray-400 text-sm" />
              )}
            </button>
            {openSections.company && (
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-400 hover:text-gray-200">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-gray-200">Careers</Link></li>
                <li><Link href="/team" className="text-gray-400 hover:text-gray-200">Our Team</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-gray-200">Blog</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-gray-200">Press</Link></li>
              </ul>
            )}
          </div>
        )}

        {/* Support - Hidden in standalone mode */}
        {!isStandalone && (
          <div>
            <button
              onClick={() => toggleSection("support")}
              className="w-full flex items-center justify-between text-lg font-medium text-gray-100 mb-4 focus:outline-none"
            >
              Support
              {openSections.support ? (
                <FaChevronUp className="text-gray-400 text-sm" />
              ) : (
                <FaChevronDown className="text-gray-400 text-sm" />
              )}
            </button>
            {openSections.support && (
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="text-gray-400 hover:text-gray-200">Contact Us</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-gray-200">FAQs</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-gray-200">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-gray-200">Privacy Policy</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-gray-200">Returns</Link></li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Footer Bottom */}
      <div className="text-gray-400 py-4 mt-8 mb-12 text-center text-sm">
      <p>© {new Date().getFullYear()} FLARE. All Rights Reserved. {isStandalone && <span> | v1.0.0</span>}</p>
      </div>
    </footer>
  );
}