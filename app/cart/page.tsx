import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { Suspense } from "react";
import {  FiSearch, FiHeart, FiClock } from "react-icons/fi";
import BottomNavWrapper from "@/components/BottomNavWrapper";
import { FiBarChart2 } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";

const RemoveFromCartButton = dynamic(() => import("@/product/[id]/RemoveFromCartButton"));
const CartTotal = dynamic(() => import("@/components/CartTotal"));
const CartQuantityUpdater = dynamic(() => import("./CartQuantityUpdater"));
const AvailableStock = dynamic(() => import("@/components/AvailableStock"));

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  // Fetch cart count for header
  const cart = session
    ? await prisma.cart.findFirst({
        where: { userId: session.user.id },
        select: { items: { select: { quantity: true } } },
      })
    : null;
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div>
      {/* Updated Cart Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white  border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
          {/* Left: Back Button and Cart */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <IoIosArrowBack className="text-2xl text-gray-700 hover:text-red-500 transition-colors duration-200" />
            </Link>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
                Cart ({cartCount})
              </h1>
            </div>
          </div>



          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <FiSearch className="text-xl text-gray-700 hover:text-red-500 transition-colors duration-200" />
            </Link>
            <Link href="/wishlist">
              <FiHeart className="text-xl text-gray-700 hover:text-red-500 transition-colors duration-200" />
            </Link>
            <Link href="/recently-viewed">
              <FiClock className="text-xl text-gray-700 hover:text-red-500 transition-colors duration-200" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        {!session ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
            <p className="text-xl text-gray-700 mb-4">You need to log in to view your cart.</p>
            <Link href="/login">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6">
                Login
              </button>
            </Link>
            <BottomNavWrapper cartItems={[]} />
          </div>
        ) : (
          <CartContent session={session} />
        )}
      </div>
    </div>
  );
}

async function CartContent({ session }: { session: any }) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            productId: true,
            sizeId: true,
            quantity: true,
            product: {
              select: {
                name: true,
                price: true,
                images: true,
              },
            },
            size: {
              select: {
                size: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return (
        <div className="text-center text-gray-500 mb-10 bg-slate-100">
          <p>Your cart is empty.</p>
          <Link href="/">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 mt-4">
              Shop Now
            </button>
          </Link>
          <BottomNavWrapper cartItems={[]} />
        </div>
      );
    }

    const updatedTotalPrice = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const deliveryFee = updatedTotalPrice < 1000 ? 100 : 0;
    const totalWithDelivery = updatedTotalPrice + deliveryFee;

    const coupons = await prisma.coupon.findMany({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() },
        uses: { lt: prisma.coupon.fields.maxUses },
      },
    });

    return (
      <div className="container mx-auto px-4 mt-4  pb-6  pt-4 ">
        <div className="bg-white  rounded-lg border p-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b last:border-b-0 py-4">
              <div className="w-20 h-20 relative">
                <Link href={`/product/${item.productId}`}>
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </Link>
              </div>
              <div className="flex-1 ml-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium truncate max-w-[170px]">
                    {item.product.name}
                  </p>
                  <Suspense fallback={<span>...</span>}>
                    <RemoveFromCartButton cartItemId={item.id} />
                  </Suspense>
                </div>
                <div className="flex items-center mt-1">
                  <p className="text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text font-semibold">R{item.product.price}</p>
                  {item.size && (
                    <span className="ml-1 bg-slate-50 border border-slate-100 text-gray-400 px-3 py-1 rounded-full text-xs">
                      Size / {item.size.size}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-0">
                  <Suspense fallback={<span>Checking stock...</span>}>
                  <div className="flex items-center space-x-1">
                    <FiBarChart2 className="text-orange-500" />
                    <AvailableStock sizeId={item.sizeId} />
                    </div>
                  </Suspense>
                  <Suspense fallback={<span>...</span>}>
                    <CartQuantityUpdater
                      cartItemId={item.id}
                      initialQuantity={item.quantity}
                      pricePerItem={item.product.price}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Suspense fallback={<p>Calculating total...</p>}>
            <CartTotal total={totalWithDelivery} />
          </Suspense>
          <Link href="/order-confirmation">
            <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
              CheckOut
            </button>
          </Link>
        </div>
        <BottomNavWrapper cartItems={cart.items} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching cart data", error);
    return (
      <div>
        <p className="text-red-500 text-center mt-6">Error loading cart.</p>
        <BottomNavWrapper cartItems={[]} />
      </div>
    );
  }
}