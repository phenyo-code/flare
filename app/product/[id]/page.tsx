import { prisma } from "../../lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import SearchHeader from "../../components/SearchHeader";
import Footer from "../../components/Footer";
import Sizes from "./Sizes"; // Import Sizes component

export default async function ProductDetails({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
            sizes: true, // Include sizes for the product
        },
    });

    if (!product) {
        return <p>Product not found.</p>;
    }

    let cart = null;
    if (session?.user) {
        cart = await prisma.cart.findFirst({
            where: { userId: session.user.id },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.user.id, createdAt: new Date() },
            });
        }
    }

    return (
        <div className="overflow-hidden">
            <SearchHeader />

            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-cover w-full"
                        />
                    </div>

                    <div className="w-full lg:w-1/2 lg:pl-8 mx-4 mt-4">
                        <h2 className="text-3xl font-semibold">{product.name}</h2>
                        <p className="text-lg text-red-500 mt-2">R{product.price}</p>

                        {/* Sizes Component - Pass product sizes and cart ID */}
                        <Sizes productId={product.id} sizes={product.sizes} cartId={cart?.id} />

                        {/* Show Login Button if user is not logged in */}
                        {!session?.user && (
                            <div className="text-center mt-10">
                                <p className="text-lg text-gray-600">You need to log in to add items to the cart.</p>
                                <Link href="/login">
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 mt-4">
                                        Login
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
