"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductCardStatic from "./ProductCardStatic";
import SlidingSizes from "./SlidingSizes";

interface ProductWithSizes extends Product {
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
}

interface ProductCardProps {
  product: ProductWithSizes | null;
  cartId?: string;
}

export default function ProductCard({ product, cartId }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!product) {
    return <ProductCardSkeleton />;
  }

  const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <ProductCardStatic product={product} cartId={cartId} onCartClick={handleCartClick} />
      <SlidingSizes
        productId={product.id}
        sizes={product.sizes}
        images={product.images} // Pass images array
        cartId={cartId}
        isOpen={isOpen}
        onCloseAction={() => setIsOpen(false)}
        isLoggedIn={!!cartId}
      />
    </>
  );
}