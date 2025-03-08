// app/orders/page.tsx
import { prisma } from "../lib/db/prisma";
import Link from "next/link";
import SearchHeader from "../components/SearchHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import Image from "next/image";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  const orders = session
    ? await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true,
              size: true,
            },
          },
        },
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader placeholder="Search products" />

      {!session || !session.user ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
          <p className="text-2xl font-semibold text-gray-800 mb-6 animate-fade-in">
            Please log in to view your orders
          </p>
          <Link href="/login">
            <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all hover:scale-105">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-gray-800">
            Your Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-center text-gray-600 text-lg animate-fade-in">
              No orders yet. Start shopping to see your purchases here!
            </p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-6">
                    <Link href={`/orders/${order.id}`}>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
                          order.status === "order submitted"
                            ? "bg-yellow-500"
                            : order.status === "preparing"
                            ? "bg-blue-500"
                            : order.status === "packaged"
                            ? "bg-purple-500"
                            : order.status === "shipped"
                            ? "bg-green-500"
                            : order.status === "delivered"
                            ? "bg-teal-500"
                            : order.status === "canceled"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Items</h4>
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex-shrink-0 w-64   p-3  duration-300"
                        >
                          <Link href={`/product/${item.product.id}`} className="block">
                            {item.product.images && item.product.images.length > 0 ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={100}
                        height={130}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-200"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 rounded-md mb-2" />
                            )}
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {item.product.name}
                            </p>
                          </Link>
                          <p className="text-xs text-gray-600">
                            {item.quantity} x R{item.price}
                          </p>
                          {item.size && (
                            <p className="text-xs text-gray-500 mt-1">Size: {item.size.size}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-700 font-medium">Total Price:</p>
                    <p className="text-2xl font-bold text-gray-900">R{order.totalPrice}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Shipping Details</h5>
                    <div className="text-gray-700 space-y-1">
                      <p>
                        <span className="font-medium">Name:</span> {order.shippingName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {order.shippingEmail}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {order.shippingAddress}
                      </p>
                      {order.shippingPhoneNumber && (
                        <p>
                          <span className="font-medium">Phone:</span> {order.shippingPhoneNumber}
                        </p>
                      )}
                      {order.trackingNumber && (
                        <p>
                          <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}