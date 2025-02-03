"use client";

import Link from "next/link";
import { storeProductView } from "@/utils/cookies"; // Assuming you have this utility for storing filters

interface ProductLinkProps {
  productId: string;
  filter: string; // Add filter prop
  children: React.ReactNode;
}

export default function ProductLink({ productId, filter, children }: ProductLinkProps) {
  function handleProductClick() {
    storeProductView(filter); // Store the filter of the viewed product
  }

  return (
    <Link href={`/product/${productId}`} onClick={handleProductClick}>
      {children}
    </Link>
  );
}
