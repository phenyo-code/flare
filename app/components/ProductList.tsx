import ProductCard from "./ProductCard";
import { Product } from "@prisma/client";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2">
      {products.map((product) => (
        <div key={product.id} className="mb-2 break-inside-avoid">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
