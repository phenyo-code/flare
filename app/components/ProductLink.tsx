"use client";

import Link from "next/link";
import { storeProductView } from "@/utils/cookies";

interface ProductLinkProps {
  productId: string;
  children: React.ReactNode;
}

export default function ProductLink({ productId, children }: ProductLinkProps) {
  function handleProductClick() {
    storeProductView(productId); // Use your existing function to store views
  }

  return (
    <Link href={`/product/${productId}`} onClick={handleProductClick}>
      {children}
    </Link>
  );
}

