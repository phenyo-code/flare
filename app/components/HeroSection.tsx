import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  product: Product | null;
}

export default function HeroSection({ product }: HeroSectionProps) {
  if (!product) {
    return <p>No product available in this category.</p>;
  }

  return (
    <div className="hero-section relative w-full h-[400px] mb-10 sm:h-[500px] md:h-[600px] flex items-center justify-center">
      <Image
        src={product.image}
        alt={product.name}
        width={0}
        height={500}
        sizes="150vw"
        className="w-full h-full object-cover"
      />
      {/* Overlay Content */}
      <div className="absolute top-1/2 transform -translate-y-1/2 text-center text-white w-full">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">New Arrival</h2>
        <p className="mb-6 text-lg sm:text-xl md:text-2xl">Explore the latest trends in fashion</p>
        <Link href={`/product/${product.id}`} className="bg-red-600 text-white px-6 py-3 text-lg sm:text-xl">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
