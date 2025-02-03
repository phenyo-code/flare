"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "../components/ProductList";
import { Product } from "@prisma/client";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { storeUserSearch, getCookie } from "../utils/cookies"; // Import getCookie

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = ["Dress", "T-shirt", "Vintage", "Jacket", "Cargo"];

  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Load recent searches from cookies
  const recentSearches = getCookie("user_searches") ? JSON.parse(getCookie("user_searches")!) : [];

  // Scroll tracking state
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Set up the debounce function
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query); // After the user stops typing, update the debounced query
    }, 500); // 500ms debounce delay (you can adjust this)

    // Cleanup function to clear timeout
    return () => clearTimeout(timeoutId);
  }, [query]); // Trigger this effect whenever `query` changes

  // Effect to fetch products based on debounced query
  useEffect(() => {
    if (debouncedQuery && !initialLoad) {
      fetchProducts(debouncedQuery);
    } else {
      setInitialLoad(false);
    }
  }, [debouncedQuery]); // Trigger when `debouncedQuery` changes

  // Effect to store user search after user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && !hasScrolled) { // Change 200 to your desired scroll distance
        setHasScrolled(true);
        if (debouncedQuery && debouncedQuery.trim() !== "") {
          storeUserSearch(debouncedQuery); // Store the debounced query in cookies when the user scrolls
        }
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [debouncedQuery, hasScrolled]); // Run this effect once the user scrolls

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
    if (query.trim() !== "") {
      storeUserSearch(query); // Store search query in cookies immediately on form submission
      router.push(`/search?query=${query}`);
    }
  }

  function handlePopularSearch(search: string) {
    setQuery(search);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="fixed top-0 left-0 w-full z-50 flex items-center gap-2 bg-white p-2">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="text-3xl text-gray-800 cursor-pointer"
        />
        <form onSubmit={handleSearch} className="flex flex-grow items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update query state as user types
            className="w-full p-2 text-gray-800 outline-none"
          />
          <button type="submit" className="bg-black h-10 text-white p-2">
            <FiSearch className="text-xl" />
          </button>
        </form>
      </div>

      {/* Recently Searched Section */}
      {recentSearches.length > 0 && !query && (
        <div className="mt-14 pb-4">
          <h3 className="text-xl font-bold mt-6 mb-4">Recently Searched</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentSearches.map((search: string, index: number) => (
              <button
                key={index}
                onClick={() => handlePopularSearch(search)}
                className="bg-gray-200 p-2 text-sm font-medium text-gray-500 hover:bg-gray-300 transition"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches Section */}
      {query === "" && (
        <div className={`mt-12 ${recentSearches.length === 0 ? "mt-14" : ""} pb-60`}>
          <h3 className="text-xl font-bold mt-12 mb-4">Popular Searches</h3>
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

      {/* Search Results */}
      {query && (
        <div className="mt-14">
          <h3 className="text-xl font-bold mt-6 mb-6">Search Results</h3>
          {loading && <p>Loading...</p>}
          <ProductList products={products} />
        </div>
      )}
    </div>
  );
}
