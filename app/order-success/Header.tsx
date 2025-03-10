"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export default function SuccessHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
      <IoIosArrowBack onClick={() => router.back()} className="text-3xl cursor-pointer" />
      <h2 className="text-xl font-semibold text-center">Order Success</h2>
      <div className="w-20" />
    </div>
  );
}