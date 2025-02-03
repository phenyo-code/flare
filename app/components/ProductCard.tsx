import { Product } from "@prisma/client";
import Image from "next/image";
import ProductLink from "./ProductLink"; // Import the updated ProductLink component

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images[0];

  const discount = product.Originalprice
    ? ((product.Originalprice - product.price) / product.Originalprice) * 100
    : 0;

  return (
    <div className="product-card shadow-md rounded-md overflow-hidden">
      <ProductLink productId={product.id} filter={product.filter}> {/* Pass both ID and filter */}
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

        <div className="flex items-center gap-2 px-2 mt-1">
          <p className="font-semibold text-sm text-red-500">
            R{product.price.toFixed(2)}
          </p>
          {product.Originalprice && (
            <p className="font-medium text-sm text-gray-400 line-through">
              R{product.Originalprice.toFixed(2)}
            </p>
          )}
        </div>

        {product.Originalprice && discount > 0 && (
          <p className="font-semibold text-sm px-2 text-red-400 mt-1 mb-2">
            {discount.toFixed(0)}% OFF FLARE WIDE
          </p>
        )}
      </ProductLink>
    </div>
  );
}
