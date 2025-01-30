import { Product } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
    product: Product;
}

export default function HeroSection({ product }: HeroSectionProps) {
    return (
        <div className="flex mt-[-20]  w-screen h-screen flex-col items-center justify-center">
        <div className="relative mt-0 pt-0 flex items-center justify-center overflow-hidden w-full h-[500px] md:h-[600px]">
            {/* Hero Image */}
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
                <h2 className="text-6xl font-bold mb-4 ">New Arrival</h2>
                <p className="mb-6 text-xl">Explore the latest trends in fashion</p>
                <Link href="/products" className="bg-red-600 text-white px-6 py-3  text-lg">
                    Shop Now
                </Link>
            </div>
        </div>
        </div>
    );
}
