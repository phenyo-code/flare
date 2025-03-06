// components/HorizontalCard.tsx (fixed)
"use client";

import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import SoldCount from "./ItemsSold";
import { Suspense } from "react";

interface HorizontalCardProps {
  product: Product;
}

export default function ReviewCard({ product }: HorizontalCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="w-40">
      <div className="bg-white p-0">
        <div className="relative w-full h-32">
        <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            width={100}
            height={130}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col ml-2 mb-2">
          <div className="flex items-center">
            <p className="text-sm font-semibold text-red-500 mr-1">
              R{product.price.toFixed(2)}
            </p>
            <Suspense fallback={<span className="text-xs text-gray-400">Loading...</span>}>

            </Suspense>
          </div>
        </div>
      </div>
    </Link>
  );
}