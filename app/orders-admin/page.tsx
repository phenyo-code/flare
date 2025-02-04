import { prisma } from "@/lib/db/prisma";
import { updateOrderStatus } from "./actions/updateOrderStatus"; // Importing the server action
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";

export const metadata = {
  title: "Manage Orders | Admin Panel",
};

export default async function ManageOrdersPage() {
  // Fetch all orders including order items and user details
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
          size: true,
        },
      },
      user: true, // Optional: Include user details for reference
    },
  });

  return (
    <div>
      <AdminHeader />
      <div className="max-w-4xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

        {orders.length === 0 ? (
          <p>No orders to manage.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="mb-6 p-4 border-b">
              <h3 className="font-semibold text-lg mb-2">Order ID: {order.id}</h3>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Price:</strong> R{order.totalPrice}</p>

              {/* Shipping Details */}
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700">Shipping Details:</h4>
                <p><strong>Name:</strong> {order.shippingName}</p>
                <p><strong>Email:</strong> {order.shippingEmail}</p>
                <p><strong>Address:</strong> {order.shippingAddress}</p>
                {order.shippingPhoneNumber && (
                  <p><strong>Phone:</strong> {order.shippingPhoneNumber}</p>
                )}
              </div>

              {/* Order Items */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.productId} className="flex justify-between items-center mb-4 border p-2 rounded-md">
                      {/* Product Image and Link */}
                      {item.product.images ? (
                        <Link href={`/product/${item.product.id}`} className="mr-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </Link>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md mr-4"></div>
                      )}

                      <div className="flex-1">
                        <span className="font-semibold">{item.product.name}</span>
                        <div className="text-sm text-gray-600">
                          {item.quantity} x R{item.product.price}
                        </div>

                        {/* Show the size if available */}
                        {item.size && (
                          <div className="text-sm text-gray-700 mt-1">
                            Size: {item.size.size}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Status Update Form */}
              <div className="mt-4">
                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />

                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Update Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    defaultValue={order.status}
                  >
                    <option value="order submitted">Order Submitted</option>
                    <option value="preparing">Preparing</option>
                    <option value="packaged">Packaged</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600 transition duration-300"
                  >
                    Update Status
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
