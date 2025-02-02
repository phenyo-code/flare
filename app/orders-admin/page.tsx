import { prisma } from "@/lib/db/prisma";
import { updateOrderStatus } from "./actions/updateOrderStatus"; // Importing the server action
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";

export const metadata = {
  title: "Manage Orders | Admin Panel",
};

export default async function ManageOrdersPage() {
  // Fetch all orders and order them by creation date in descending order
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc", // Sort orders by creation date in descending order
    },
    include: {
      items: {
        include: {
          product: true, // Include product details for each item in the order
          size: true,    // Include size details for each item
        },
      },
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
            <div key={order.id} className="mb-6">
              <h3 className="font-semibold">Order ID: {order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total Price: R{order.totalPrice}</p>

              <div className="mt-4">
                <h4 className="font-semibold">Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.productId} className="flex justify-between items-center mb-4">
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
                          {item.quantity} x R{item.price}
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

              <div className="mt-4">
                {/* Form to update the order status */}
                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />

                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
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
