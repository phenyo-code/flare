import SearchHeader from "@/components/SearchHeader";

export default function CartSkeleton() {
  return (
    <div>
      <SearchHeader placeholder="Search..." />
    <div className="space-y-6 m-6">
      {/* Top Lines */}
      

      <h1 className=" text-3xl font-semibold mb-6 text-gray-300">Shopping Cart</h1>
    
      <div className="flex items-center justify-between border-b py-4">
      {/* Image Skeleton */}
      <div className="w-20 h-20 bg-gray-300 animate-pulse rounded-md"></div>

      {/* Product Details Skeleton */}
      <div className="flex-1 ml-3">
        {/* Product Name Skeleton */}
        <div className="w-32 h-2 bg-gray-300 animate-pulse rounded-md mb-2"></div>

        {/* Price and Size Skeleton */}
        <div className="flex items-center">
          <div className="w-16 h-2 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="ml-2 w-12 h-2 bg-gray-300 animate-pulse rounded-md"></div>
        </div>

        {/* Stock & Quantity Skeleton */}
        <div className="flex justify-between items-center mt-2">
          <div className="w-24 h-2 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-20 h-2 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>

      </div>
      
    </div>

  );
}
