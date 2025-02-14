import CategoryHeader from "./CategoryHeader";
import FreeDeliveryBanner from "./FreeDelivery";
import Header from "./Header";

export default function HomeSkeleton() {
  return (
    <div>
      {/* Top Lines */}
      <FreeDeliveryBanner />
      <Header />
      <CategoryHeader activeCategory="" />

      <div className="container bg-white mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section Skeleton */}
          <div className="w-full lg:w-1/2 flex justify-center items-center relative">
            <div className="w-full h-72 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="text-white text-4xl font-bold uppercase">FLARE</span>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 mt-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <div className="product-card shadow-md rounded-md overflow-hidden bg-gray-100 animate-pulse">
                  <div className="relative w-full h-48 bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xl bg-gray-300 bg-opacity-50">
                      FLARE
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    {/* Title Skeleton */}
                    <div className="w-full h-2 bg-gray-200"></div>

                    {/* Price Skeleton */}
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200"></div>
                    </div>

                    {/* Discount Skeleton */}
                    <div className="w-16 h-2 bg-gray-200 mt-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>  
      </div>  
    </div>
  );
}
