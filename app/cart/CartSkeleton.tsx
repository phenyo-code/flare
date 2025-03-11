import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { FiSearch, FiHeart, FiClock } from "react-icons/fi";

export default function CartSkeleton() {
  return (
    <div>
    <div className="space-y-6 m-6">
      {/* Top Lines */}
      

      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b mb-20 border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
        {/* Left: Back Button and Cart */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <IoIosArrowBack className="text-2xl text-gray-300" /> {/* Actual Back Arrow */}
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-300">Cart (.)</span> {/* Actual "Cart" Text */}
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" /> {/* Cart Count Placeholder */}
          </div>
        </div>



        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <FiSearch className="text-xl text-gray-300" /> {/* Actual Search Icon */}
          <FiHeart className="text-xl text-gray-300" /> {/* Actual Heart Icon */}
          <FiClock className="text-xl text-gray-300" /> {/* Actual Clock Icon */}
        </div>
      </div>
    </header>

    <div className="">
    
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
      
    </div>

  );
}
