// app/product/[id]/page.tsx
import { prisma } from "../../lib/db/prisma";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

// This is a server component in Next.js 13+
export default async function ProductDetails({ params }: { params: { id: string } }) {
  // Fetching the product based on the dynamic id
  const product: Product | null = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="container mx-auto ">
      <div className="flex flex-col lg:flex-row">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full"  
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 lg:pl-8 mx-4 mt-4 lg:mt-0">
          <h2 className="text-3xl font-semibold">{product.name}</h2>
          <p className="text-lg text-red-500 mt-2">R{product.price}</p>

          {/* Link back to product list */}
          <Link href="/products" className="text-blue-500 mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
