import ProductCard from "./ProductCard";
import { Product } from "@prisma/client";
import { IoMdSad } from "react-icons/io"; // Sad face icon

interface ProductListProps {
  products: Product[] | null; // Allow null for loading state
}

export default function ProductList({ products }: ProductListProps) {
  if (products === null) {
    // Show skeletons when products are still loading
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <div className="skeleton w-full h-48 rounded-md"></div> {/* Skeleton for product card */}
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-10">
        <IoMdSad className="text-4xl text-gray-500 mb-2" /> {/* Sad face icon */}
        <h3 className="text-xl font-regular text-gray-600">No products found</h3>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2">
      {products.map((product) => (
        <div key={product.id} className="mb-2 break-inside-avoid">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
