import { prisma } from "../lib/db/prisma";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import SearchHeader from "../components/SearchHeader";
import { Suspense } from "react";
import BottomNavWrapper from "@/components/BottomNavWrapper";

const RemoveFromCartButton = dynamic(() => import("../product/[id]/RemoveFromCartButton"));
const CartTotal = dynamic(() => import("@/components/CartTotal"));
const CheckoutButton = dynamic(() => import("./CheckOutButton"));
const CartQuantityUpdater = dynamic(() => import("../components/CartQuantityUpdater"));
const AvailableStock = dynamic(() => import("@/components/AvailableStock"));

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700 mb-4">You need to log in to view your cart.</p>
        <Link href="/login">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6">
            Login
          </button>
        </Link>
        <BottomNavWrapper cartItems={[]} />
      </div>
    );
  }

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
        <div className="text-center text-gray-500 mt-10">
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

    // Recalculate total price from cart items
    const updatedTotalPrice = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const deliveryFee = updatedTotalPrice < 1000 ? 100 : 0;
    const totalWithDelivery = updatedTotalPrice + deliveryFee;

    // Fetch or create/update the order
    let order = await prisma.order.findFirst({
      where: { userId: session.user.id, status: "PENDING" },
      include: { items: true }, // Include items to compare
    });

    if (order) {
      // Compare cart items with order items and update if necessary
      const cartItemsMap = new Map(cart.items.map(item => [item.id, item]));
      const orderItemsMap = new Map(order.items.map(item => [item.id, item]));

      const itemsNeedUpdate = cart.items.some(cartItem => {
        const orderItem = orderItemsMap.get(cartItem.id);
        return !orderItem || orderItem.quantity !== cartItem.quantity || orderItem.price !== cartItem.product.price;
      });

      if (itemsNeedUpdate || order.totalPrice !== totalWithDelivery) {
        // Update order items and total price
        await prisma.order.update({
          where: { id: order.id },
          data: {
            totalPrice: totalWithDelivery,
            items: {
              deleteMany: {}, // Clear existing items
              create: cart.items.map((item) => ({
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        });
      }
    } else {
      // Create new order if none exists
      order = await prisma.order.create({
        data: {
          userId: session.user.id,
          totalPrice: totalWithDelivery,
          status: "PENDING",
          shippingName: "",
          shippingEmail: "",
          shippingAddress: "",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              sizeId: item.sizeId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          shippingAddress: true,
          shippingName: true,
          shippingEmail: true,
          shippingPhoneNumber: true,
          status: true,
          totalPrice: true,
          stripeSessionId: true,
          shippingAddressId: true,
          items: true,
        },
      });
    }

    return (
      <div>
        <SearchHeader placeholder="Search products" />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

          <div className="bg-white shadow-md rounded-lg p-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4">
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
                    <p className="text-red-500 font-semibold">R{item.product.price}</p>
                    {item.size && (
                      <span className="ml-1 bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs">
                        Size / {item.size.size}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-0">
                    <Suspense fallback={<span>Checking stock...</span>}>
                      <AvailableStock sizeId={item.sizeId} />
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
            {order && (
              <Suspense fallback={<button className="bg-gray-500 text-white px-4 py-2">Loading...</button>}>
                <CheckoutButton orderId={order.id} />
              </Suspense>
            )}
          </div>
        </div>
        <BottomNavWrapper cartItems={cart.items} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching cart or order data", error);
    return (
      <div>
        <p className="text-red-500 text-center mt-6">Error loading cart.</p>
        <BottomNavWrapper cartItems={[]} />
      </div>
    );
  }
}