"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "../components/ProductList";
import { Product } from "@prisma/client";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // To track if it's the first page load
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input element

  const popularSearches = ["Dress", "T-shirt", "Shoes", "Jacket", "Hat"]; // Example popular searches

  useEffect(() => {
    // Automatically focus the search input when the page is loaded
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (query && !initialLoad) {
      fetchProducts(query);
    } else {
      setInitialLoad(false); // Stop loading after first mount
    }
  }, [query]);

  async function fetchProducts(query: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  }

  // Handle clicking on a popular search suggestion
  function handlePopularSearch(search: string) {
    setQuery(search); // Update the query with the clicked popular search
  }

  return (
    <div className="container mx-auto p-4">
      {/* Search Header */}
      <div className="fixed top-0 left-0 w-full z-50 flex items-center gap-2 bg-white p-2">
        {/* Back Arrow */}
        <IoIosArrowBack
          onClick={() => router.back()}
          className="text-3xl text-gray-800 cursor-pointer"
        />

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-grow items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            ref={inputRef} // Attach the reference to the input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 text-gray-800 outline-none"
          />
          <button type="submit" className="bg-black h-10 text-white p-2">
            <FiSearch className="text-xl" />
          </button>
        </form>
      </div>

      {/* Conditionally render Popular Searches or Search Results */}
      {query === "" && (
        <div className="mt-14 pb-60">
          <h3 className="text-xl font-bold mt-6 mb-4">Popular Searches</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => handlePopularSearch(search)}
                className="bg-gray-200 p-2 text-sm font-medium text-gray-500 hover:bg-gray-300 transition"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conditionally render Search Results Heading */}
      {query && (
        <div className="mt-14">
          <h3 className="text-xl font-bold mt-6 mb-6">Search Results</h3>
          {/* Search Results */}
          {loading && <p>Loading...</p>}
          <ProductList products={products} />
        </div>
      )}
    </div>
  );
}
