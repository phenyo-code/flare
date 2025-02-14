export default function ProductListSkeleton() {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <div className="product-card shadow-md rounded-md overflow-hidden bg-gray-100 animate-pulse"> {/* Lighten the gray */}
              <div className="relative w-full h-48 bg-gray-100"> {/* Lighter gray for the image */}
                <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xl bg-gray-300 bg-opacity-50">
                  FLARE {/* Overlay "FLARE" text in the center */}
                </div>
              </div>
  
              <div className="p-4 space-y-2">
                {/* Title Skeleton */}
                <div className="w-full h-2 bg-gray-300 "></div>
  
                {/* Price Skeleton */}
                <div className="flex items-center">
                  <div className="w-20 h-4 bg-gray-300 "></div>
                </div>
  
                {/* Discount Skeleton */}
                <div className="w-16 h-2 bg-gray-300  mt-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  