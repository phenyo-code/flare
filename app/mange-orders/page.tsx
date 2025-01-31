// manage-orders.tsx - Admin order management page
import { prisma } from "../lib/db/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Orders | Admin Panel",
};

export async function updateOrderStatus(formData: FormData) {
  "use server";

  const orderId = formData.get("orderId")?.toString();
  const status = formData.get("status")?.toString();

  if (!orderId || !status) {
    throw new Error("Order ID and status are required.");
  }

  // Update the order status in the database
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // Redirect after the update
  redirect(`/manage-orders?success=true`);
}

export default async function ManageOrdersPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const success = searchParams?.success === "true";

  // Fetch all orders
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
    <div className="max-w-4xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {/* Success message */}
      {success && (
        <p className="mb-4 p-2 text-center text-white bg-green-500 rounded-md">
          ✅ Order status updated successfully!
        </p>
      )}

      {orders.length === 0 ? (
        <p>No orders to manage.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-6">
            <h3 className="font-semibold">Order ID: {order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Total Price: ${order.totalPrice}</p>

            <div className="mt-4">
              <h4 className="font-semibold">Items:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between">
                    <span>{item.product.name}</span>
                    <span>{item.quantity} x ${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

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
                  <option value="pending">Pending</option>
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
  );
}
