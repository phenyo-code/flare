import { prisma } from "../lib/db/prisma";
import Image from "next/image";
import RemoveFromCartButton from "../product/[id]/RemoveFromCartButton";
import SearchHeader from "../components/SearchHeader";
import Link from 'next/link';

export default async function CartPage() {
    // Fetch cart with items
    const cart = await prisma.cart.findFirst({
        include: {
            items: {
                include: { product: true },
            },
        },
    });

    return (
        <div>
            <SearchHeader /> {/* Always visible */}
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

                {/* Check if cart is empty */}
                {(!cart || cart.items.length === 0) ? (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Your cart is empty.</p>
                        <Link href="/">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-4">
                                Add Products to Cart
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-4">
                        {/* Cart items */}
                        {cart.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b py-4">
                                {/* Product Image */}
                                <div className="flex items-center space-x-4">
                                    <Image src={item.product.image} alt={item.product.name} width={80} height={80} className="object-cover rounded-md" />
                                    <div>
                                        <p className="text-lg font-medium">{item.product.name}</p>
                                        <p className="text-red-500">R{item.product.price}</p>
                                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <RemoveFromCartButton cartItemId={item.id} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Total Price and Checkout Button */}
                {cart && cart.items.length > 0 && (
                    <div className="mt-6 flex justify-between items-center">
                        <p className="text-xl font-semibold">Total: R{cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)}</p>
                        <Link href="/check-out">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
                            Proceed to Checkout
                        </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
