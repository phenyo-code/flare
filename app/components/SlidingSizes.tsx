"use client";

import { useState, useEffect } from "react";
import AddToCartButton from "../product/[id]/AddToCartButton";
import Link from "next/link";
import Image from "next/image";

interface Size {
  id: string;
  size: string;
  quantity: number;
  measurement: string;
}

interface SlidingSizesProps {
  productId: string;
  sizes: Size[];
  images: string[]; // Add images prop
  cartId?: string;
  isOpen: boolean;
  onCloseAction: () => void; 
  isLoggedIn: boolean;
}

export default function SlidingSizes({
  productId,
  sizes,
  images,
  cartId,
  isOpen,
  onCloseAction,
  isLoggedIn,
}: SlidingSizesProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  useEffect(() => {
    if (!isOpen) setSelectedSize(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    onCloseAction();
  };

  const handleSizeClick = (size: Size) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (size.quantity > 0) setSelectedSize(size);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div
        className={`w-full max-w-md bg-white rounded-t-xl p-4 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={handleContainerClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Size</h2>
          <button onClick={handleClose} className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Horizontally Scrollable Images */}
        <div className="flex header-categories-row gap-2 overflow-x-auto mb-6">
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Size Selection */}
        <div className="flex gap-2 flex-wrap mb-6">
          {sizes.length > 0 ? (
            sizes.map((size) => {
              const isOutOfStock = size.quantity === 0;
              return (
                <button
                  key={size.id}
                  onClick={handleSizeClick(size)}
                  disabled={isOutOfStock}
                  className={`border px-4 py-2 rounded-lg ${
                    isOutOfStock
                      ? "text-gray-300 cursor-not-allowed"
                      : selectedSize?.id === size.id
                      ? "bg-red-500 text-white"
                      : "hover:bg-red-400 hover:text-white"
                  }`}
                >
                  {size.size}
                </button>
              );
            })
          ) : (
            <p className="text-gray-500">No sizes available</p>
          )}
        </div>
        {selectedSize && (
          <div className="mb-6 bg-gray-100 p-4 rounded">
            <p className="text-gray-500 font-medium text-xs">Measurement:</p>
            <p className="text-gray-400 mt-2 text-xs">{selectedSize.measurement}</p>
          </div>
        )}
        {isLoggedIn && cartId ? (
          <AddToCartButton
            productId={productId}
            cartId={cartId}
            selectedSizeId={selectedSize?.id ?? null}
          />
        ) : (
          <Link href="/login" className="block w-full text-center bg-red-500 text-white p-2 rounded">
            Log in to add to cart
          </Link>
        )}
      </div>
    </div>
  );
}
