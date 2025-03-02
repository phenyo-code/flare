"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { storeUserSearch, getCookie } from "@/utils/cookies";
import BottomNavWrapper from "@/components/BottomNavWrapper";
import { useSession } from "next-auth/react";

interface ProductWithSizes {
  id: string;
  name: string;
  price: number;
  Originalprice: number;
  category: string;
  filter: string;
  images: string[];
  isRecommended: boolean;
  reviews: any[];
  createdAt: Date;
  updatedAt: Date;
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
  style: string;
  type: string;
  matchesWith: string[];
}

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
  const { data: session } = useSession();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [products, setProducts] = useState<ProductWithSizes[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const popularSearches = ["Dress", "T-shirt", "Vintage", "Jacket", "Cargo"];
  const recentSearches = getCookie("user_searches") ? JSON.parse(getCookie("user_searches")!) : [];
  const [hasScrolled, setHasScrolled] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [cartId, setCartId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/cart")
        .then((res) => res.json())
        .then((data) => setCartId(data.cartId))
        .catch((err) => console.error("Error fetching cartId:", err));
    }
  }, [session]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery && !initialLoad) {
      fetchProducts(debouncedQuery);
    } else {
      setInitialLoad(false);
    }
  }, [debouncedQuery, initialLoad]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && !hasScrolled) {
        setHasScrolled(true);
        if (debouncedQuery && debouncedQuery.trim() !== "") {
          storeUserSearch(debouncedQuery);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [debouncedQuery, hasScrolled]);

  async function fetchProducts(query: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}`);
      const data: ProductWithSizes[] = await res.json();
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
      storeUserSearch(query);
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
        <form
          onSubmit={handleSearch}
          className="flex flex-grow items-center border border-gray-300 rounded-lg overflow-hidden"
        >
          <input
            ref={inputRef}
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
      {recentSearches.length > 0 && !query && (
        <div className="mt-14 pb-4">
          <h3 className="text-xl font-bold mt-6 mb-4">Recently Searched</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {recentSearches.map((search: string, index: number) => (
              <button
                key={index}
                onClick={() => handlePopularSearch(search)}
                className="bg-gray-200 p-2 text-xs font-medium text-gray-500 hover:bg-gray-300 transition"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
      {query === "" && (
        <div className={`mt-12 ${recentSearches.length === 0 ? "mt-14" : ""} pb-60`}>
          <h4 className="text-xl font-bold mt-12 mb-4">Popular Searches</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => handlePopularSearch(search)}
                className="bg-gray-200 p-2 text-xs font-medium text-gray-500 hover:bg-gray-300 transition"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
      {query && (
        <div className="mt-14">
          <h3 className="text-xl font-bold mt-6 mb-6">Search Results</h3>
          {loading && <p>Loading...</p>}
          <ProductList products={products} cartId={cartId} />
        </div>
      )}
      <BottomNavWrapper cartItems={products.slice(0, 5)} />
    </div>
  );
}