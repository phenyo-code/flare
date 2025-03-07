"use client";

import { useRouter } from "next/navigation";
import { IoMdHome } from "react-icons/io";
import Header from "./components/Header";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div>
      <Header />
<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-indigo-500 to-purple-600 text-white">
  <div className="text-center px-4 sm:px-6 md:px-8">
    <div className="mb-6">
      <span className="inline-block text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-pulse">404</span>
    </div>
    <p className="text-lg sm:text-xl mb-6 animate-fadeIn">Oops! The page you&apos;re looking for cannot be found.</p>

    <button
      onClick={() => router.push("/")}
      className="flex items-center justify-center mx-auto bg-white text-gray-800 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition"
    >
      <IoMdHome className="mr-0 text-2xl" />
    </button>
  </div>
</div>
</div>

  );
}
