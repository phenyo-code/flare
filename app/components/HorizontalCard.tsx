import { Product } from "@prisma/client";
import Image from "next/image";
import ProductLink from "./ProductLink"; // Import the ProductLink component
import SoldCount from "./ItemsSold";

interface ProductCardProps {
  product: Product;
}

export default function HorintantalCard({ product }: ProductCardProps) {
  const firstImage = product.images[0];

  return (
    <div className=" overflow-hidden w-[150px] flex-shrink-0">
      <ProductLink productId={product.id} filter={product.filter}>
        <div className="w-full h-[180px]">
          <Image
            src={firstImage}
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
            <SoldCount productId={product.id} /> 
          </div>
        </div> 
      </ProductLink>
    </div>
  );
}
