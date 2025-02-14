"use client";

import Link from "next/link";
import { useCallback } from "react";
import { storeProductView } from "@/utils/cookies"; // Assuming this function exists

interface ProductLinkProps {
  productId: string;
  filter: string;
  children: React.ReactNode;
}

export default function ProductLink({ productId, filter, children }: ProductLinkProps) {
  const handleProductClick = useCallback(() => {
    storeProductView(filter);
  }, [filter]);

  return (
    <Link href={`/product/${productId}`} prefetch onClick={handleProductClick}>
      {children}
    </Link>
  );
}
