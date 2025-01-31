// app/product/[id]/page.tsx
import { prisma } from "../../lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import SearchHeader from "../../components/SearchHeader";

export default async function ProductDetails({ params }: { params: { id: string } }) {
    // Fetch the product from the database
    const product = await prisma.product.findUnique({
        where: { id: params.id },
    });

    if (!product) {
        return <p>Product not found.</p>;
    }

    // Fetch or create a cart for the user
    let cart = await prisma.cart.findFirst();
    if (!cart) {
        cart = await prisma.cart.create({ data: {} });
    }

    return (
        <div>
            <SearchHeader />
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-cover w-full"
                        />
                    </div>

                    <div className="w-full lg:w-1/2 lg:pl-8 mx-4 mt-4">
                        <h2 className="text-3xl font-semibold">{product.name}</h2>
                        <p className="text-lg text-red-500 mt-2">R{product.price}</p>

                        {/* Pass the correct cartId to the button */}
                        <AddToCartButton productId={product.id} cartId={cart.id} />

                        <div className="mt-4">
                            <Link href="/products" className="text-blue-500 inline-block">
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
