import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product; // Make sure this matches your Prisma schema for Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Fetch the first image from the images array
  const firstImage = product.images[0];

  // Calculate the discount percentage
  const discount = product.Originalprice
    ? ((product.Originalprice - product.price) / product.Originalprice) * 100
    : 0;

  return (
    <div className="product-card shadow-md rounded-md overflow-hidden">
      <Link href={`/product/${product.id}`}>
        {/* Display only the first image */}
        <Image
          src={firstImage}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-auto object-cover"
        />
        <p className="mt-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
          {product.name}
        </p>

        {/* Price row with original price and discounted price */}
        <div className="flex items-center gap-2 px-2 mt-1">

          {/* Display the discounted price */}
          <p className="font-semibold text-sm text-red-500">
            R{product.price.toFixed(2)}
          </p>

          {/* Display the original price with line-through */}
          {product.Originalprice && (
            <p className="font-medium text-sm text-gray-400 line-through">
              R{product.Originalprice.toFixed(2)}
            </p>
          )}

          
        </div>

        {/* Display discount percentage */}
        {product.Originalprice && discount > 0 && (
          <p className="font-semibold text-sm px-2 text-red-400 mt-1 mb-2">
            {discount.toFixed(0)}% OFF FLARE WIDE
          </p>
        )}
      </Link>
    </div>
  );
}
