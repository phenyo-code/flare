"use client";

import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";

type SearchHeaderProps = {
  placeholder: string;
};

export default function SearchHeader({ placeholder = "Search..." }: SearchHeaderProps) {

  const router = useRouter();

  function handleSearchClick() {
    router.push("/search");
  }

  return (
    <div className="left-0 w-full z-50 flex items-center gap-2 bg-white overflow-hidden p-2">
      {/* Back Arrow */}
      <IoIosArrowBack
        onClick={() => router.back()}
        className="text-3xl text-gray-800 cursor-pointer"
      />

      {/* Search Bar */}
      <div className="flex flex-grow items-center border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder={placeholder} // Now uses the passed prop
          className="w-full p-2 text-gray-800 outline-none"
          onClick={handleSearchClick} // Navigates to /search on click
          readOnly // Prevents typing (since we navigate away)
        />
        <button className="bg-black h-10 text-white p-2">
          <FiSearch className="text-xl" />
        </button>
      </div>
    </div>
  );
}
