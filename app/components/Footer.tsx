"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "../actions/newsletterAction";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        setEmail(""); // Clear input
      } else {
        setError(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <footer className="bg-black text-white py-10 mt-0">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Newsletter */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Newsletter</h4>
          <p className="text-gray-400 mb-4">Stay updated with our latest news and offers.</p>
          <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 bg-white text-gray-800 rounded"
              required
              disabled={isPending} // Disable input during transition
            />
            <button
              type="submit"
              className="p-2 bg-red-500 text-white rounded transition-all duration-300 ease-in-out hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
              <p className="text-green-400 text-sm transition-opacity duration-300 ease-in-out opacity-100">
                {message}
              </p>
            )}
            {error && (
              <p className="text-red-400 text-sm transition-opacity duration-300 ease-in-out opacity-100">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="/shop" className="text-gray-400 hover:text-white">Shop</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
            <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-400 mb-4">Have questions? Feel free to reach out.</p>
          <p className="text-gray-400">Email: <a href="mailto:support@flare.com" className="hover:text-white">support@flare.com</a></p>
          <p className="text-gray-400">Phone: +1 (234) 567-890</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-gray-400 py-4 mt-8 text-center">
        <p>© {new Date().getFullYear()} FLARE. All Rights Reserved.</p>
      </div>
    </footer>
  );
}