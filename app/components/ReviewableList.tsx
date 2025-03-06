// components/Horizontal.tsx
import ReviewCard from "./ReviewCard";
import { Product } from "@prisma/client";
import { IoMdSad } from "react-icons/io";

interface ProductListProps {
  products: Product[];
}

export default function ReviewableList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-10">
        <IoMdSad className="text-4xl text-gray-500 mb-2" />
        <h3 className="text-xl font-regular text-gray-600">No products found</h3>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-4 px-2 sm:px-0">
      {products.map((product) => (
        <div key={product.id} className="flex-shrink-0">
          <ReviewCard product={product} />
        </div>
      ))}
    </div>
  );
}