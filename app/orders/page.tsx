import { prisma } from "../lib/db/prisma";
import Link from "next/link";
import SearchHeader from "../components/SearchHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function OrdersPage() {
  // Get session to identify the user
  const session = await getServerSession(authOptions);

  // Fetch orders only if the user is logged in
  const orders = session
    ? await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: {
          createdAt: "desc", // Sort orders by creation date (newest first)
        },
        include: {
          items: {
            include: {
              product: true, // Include product details
              size: true,    // Include size details for each item
            },
          },
        },
      })
    : [];

  return (
    <div>
      <SearchHeader placeholder={"Search products"} /> {/* Always visible */}

      {/* Show login prompt if user is not logged in */}
      {!session || !session.user ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl text-gray-700 mb-4">You need to log in to view your orders.</p>
          <Link href="/login">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="container mx-auto mt-6">
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
                        : "bg-gray-500" // For any other status
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                        {item.product.images ? (
                          <Link href={`/product/${item.product.id}`} className="mr-4">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                            />
                          </Link>
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mr-4 bg-gray-200 rounded-md"></div>
                        )}

                        {/* Product Name, Price, and Size */}
                        <div className="flex-1 sm:flex-row flex-col">
                          <span className="text-gray-600 font-semibold text-sm sm:text-base">
                            {item.product.name}
                          </span>
                          <div className="text-gray-600 text-xs sm:text-sm">
                            {item.quantity} x R{item.price}
                          </div>

                          {/* Show the size if available */}
                          {item.size && (
                            <div className="text-gray-700 mt-1 text-sm">
                              Size: {item.size.size}
                            </div>
                          )}
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
                  {order.shippingPhoneNumber && (
                    <p className="text-gray-700">Phone Number: {order.shippingPhoneNumber}</p>
                  )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
