// orders.tsx - Buyer orders page
import { prisma } from "../lib/db/prisma";
import Link from "next/link";
import SearchHeader from "../components/SearchHeader";

export default async function OrdersPage() {
  // Fetch orders for the logged-in user (you can add user identification here if needed)
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true, // Include product details for each item in the order
        },
      },
    },
  });

  return (
    <div>
      <SearchHeader />
      <div className="max-w-5xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found. Please make a purchase.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="mb-8 p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-md text-white font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-500"
                      : order.status === "canceled"
                      ? "bg-red-500"
                      : order.status === "shipped"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Summary */}
              <div className="flex justify-between mb-4">
                <p className="text-gray-700">Total Price:</p>
                <p className="text-xl font-semibold">R{order.totalPrice}</p>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Product Image and Link */}
                      {item.product.image ? (
                        <Link href={`/product/${item.product.id}`} className="mr-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                          />
                        </Link>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mr-4 bg-gray-200 rounded-md"></div>
                      )}

                      {/* Product Name and Price */}
                      <div className="flex-1 sm:flex-row flex-col">
                        <span className="text-gray-600 font-semibold text-sm sm:text-base">
                          {item.product.name}
                        </span>
                        <div className="text-gray-600 text-xs sm:text-sm">
                          {item.quantity} x R{item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Information */}
              <div className="">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800">Shipping Details</h5>
                  <p className="text-gray-700">Name: {order.shippingName}</p>
                  <p className="text-gray-700">Email: {order.shippingEmail}</p>
                  <p className="text-gray-700">Address: {order.shippingAddress}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
