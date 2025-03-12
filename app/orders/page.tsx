import { prisma } from "../lib/db/prisma";
import Link from "next/link";
import SearchHeader from "../components/SearchHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  // Define the statuses you want to show
  const allowedStatuses = [
    "order submitted",
    "preparing",
    "packaged",
    "shipped",
    "delivered",
    "canceled",
  ];

  const orders = session
    ? await prisma.order.findMany({
        where: {
          userId: session.user.id,
          status: {
            in: allowedStatuses, // Only include orders with these statuses
          },
        },
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <Link href="/">
          <IoIosArrowBack className="text-3xl cursor-pointer" aria-label="Back to Home" />
        </Link>
        <h2 className="text-xl font-semibold text-center">Your Orders</h2>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {!session || !session.user ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          <p className="text-lg font-semibold text-gray-800 mb-6">Please log in to view your orders</p>
          <Link href="/login">
            <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-200">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="px-6 py-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-600 text-sm">No orders yet. Start shopping to see your purchases here!</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <Link href={`/orders/${order.id}`}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
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
                    <p className="text-xs text-gray-500">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Items</h4>
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex-shrink-0 w-[150px] overflow-hidden">
                          <Link href={`/product/${item.product.id}`} className="block">
                            <div className="w-full h-[180px] relative">
                              <Image
                                src={item.product.images?.[0] || "/fallback-image.jpg"}
                                alt={item.product.name}
                                width={150}
                                height={180}
                                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-200"
                              />
                            </div>
                            <div className="p-4">
                              <p className="text-gray-800 font-medium whitespace-nowrap text-ellipsis">{item.product.name}</p>
                              <div className="flex items-center mt-1">
                                <p className="text-gray-500 text-sm">Size: {item.size?.size || "N/A"} x {item.quantity}</p>
                              </div>
                              <p className="text-orange-500 font-semibold mt-2">R{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="w-full block bg-gray-100 h-1 mb-4" />

                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Shipping Details</h5>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p><strong>{order.shippingName}</strong> | {order.shippingPhoneNumber || "Not provided"}</p>
                      <p>{order.shippingAddress}</p>
                      {order.trackingNumber && (
                        <p><span className="text-red-500 font-medium">{order.trackingNumber}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Total Price:</p>
                    <p className="text-lg font-bold text-red-500">R{order.totalPrice.toFixed(2)}</p>
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