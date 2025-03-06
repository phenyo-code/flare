"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaSort } from "react-icons/fa";
import { useEffect } from "react";

export default function FilterBar({
  initialSort,
}: {
  initialSort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("FilterBar - Initial sort:", initialSort);
    console.log("FilterBar - Current URL sort:", searchParams.get("sort"));
  }, [initialSort, searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(name, value);
    } else {
      url.searchParams.delete(name);
    }
    console.log(`FilterBar - Updating URL with ${name}=${value}`);
    router.push(url.toString(), { scroll: false });
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md flex justify-end">
      <div className="flex items-center gap-2">
        <FaSort className="text-gray-600" />
        <select
          name="sort"
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={searchParams.get("sort") || initialSort || "desc"}
          onChange={handleSortChange}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
}