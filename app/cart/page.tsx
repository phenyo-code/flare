import { prisma } from "../lib/db/prisma";
import Image from "next/image";
import RemoveFromCartButton from "../product/[id]/RemoveFromCartButton";
import SearchHeader from "../components/SearchHeader";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import PersonalizedProductList from "../components/PersonalizedProductList"; // Import your personalized list component
import { Product } from "@prisma/client";
import CartTotal from "@/components/CartTotal";

export default async function CartPage() {
  // Get session to identify the user
  const session = await getServerSession(authOptions);

  // Fetch user's cart, including size details for each cart item
  const cart = session
    ? await prisma.cart.findFirst({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: true,
              size: true, // Include the size relation to get the selected size details
            },
          },
        },
      })
    : null;

  // Fetch all products for personalized recommendations
  const allProducts: Product[] = await prisma.product.findMany();

  return (
    <div>
      <SearchHeader /> {/* Always visible */}

      {/* Show login prompt if user is not logged in */}
      {!session || !session.user ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl text-gray-700 mb-4">You need to log in to view your cart.</p>
          <Link href="/login">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

            {/* Check if cart is empty */}
            {!cart || cart.items.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>Your cart is empty.</p>
                <Link href="/">
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 mt-4">
                    Shop Now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-4">
                {/* Cart items */}
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b py-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 relative">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 ml-3">
                      <div className="flex items-center justify-between">
                        {/* Product Name & Remove Button */}
                        <p className="text-lg font-medium truncate max-w-[170px]">
                          {item.product.name}
                        </p>
                        <RemoveFromCartButton cartItemId={item.id} />
                      </div>

                      {/* Price & Size */}
                      <div className="flex items-center mt-1">
                        <p className="text-red-500 font-semibold">R{item.product.price}</p>
                        {item.size && (
                          <span className="ml-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                            Size / {item.size.size}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <p className="text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Price and Checkout Button */}
            {cart && cart.items.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <CartTotal
              total={cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)}
            />
            <Link href="/check-out">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
          </div>

          {/* Personalized Recommendations below the checkout button */}
          {cart && cart.items.length > 0 && (
            <div className="mt-10 bg-slate-50 p-0">
              <div className="container mx-auto">
                <h3 className="text-1xl font-semibold p-6 text-center">You Might Also Like:</h3>
                <PersonalizedProductList allProducts={allProducts} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
