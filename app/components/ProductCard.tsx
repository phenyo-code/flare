import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product; // Make sure this matches your Prisma schema for Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card shadow-md">
      <Image
        src={product.image}
        alt={product.name}
        width={200}
        height={200}
        className="w-full h-auto object-cover"
      />
      <p className="mt-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis ">
        {product.name}
      </p>
      <p className="font-semibold text-sm px-2 text-red-400">R{product.price}</p>
      {/* Removed <a> tag, directly using Link */}
      <Link href={`/product/${product.id}`} className="text-blue-500 px-2">
        View Details
      </Link>
    </div>
  );
}
