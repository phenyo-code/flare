"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions/updateOrderStatus";
import { deleteOrder } from "./actions/deleteOrder";
import Link from "next/link";
import Image from "next/image";

interface Order {
  id: string;
  totalPrice: number;
  createdAt: Date;
  status: string;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingPhoneNumber?: string;
  items: {
    id?: string;
    productId: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; images: string[] };
    size?: { size: string };
  }[];
  user: { id: string };
}

interface StatusFilterProps {
  initialOrders: Order[];
  statuses: string[];
}

export default function StatusFilter({ initialOrders, statuses }: StatusFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredOrders = selectedStatus
    ? initialOrders.filter((order) => order.status.toLowerCase() === selectedStatus)
    : initialOrders;

  console.log("StatusFilter - Selected status:", selectedStatus);
  console.log("StatusFilter - Filtered orders count:", filteredOrders.length);
  console.log("StatusFilter - Filtered order statuses:", filteredOrders.map((o) => o.status));

  return (
    <div>
      {/* Status Filter Row */}
      <div className="filter-row uppercase flex font-bold shadow-md mb-6 items-center py-2 px-4 overflow-x-auto space-x-2">
        <button
          className={`filter-tab flex-none text-center px-4 py-2 rounded-full border border-gray-300 whitespace-nowrap text-sm sm:text-base ${
            !selectedStatus ? "text-red-500 border-red-500" : "text-black bg-transparent"
          } hover:text-red-500 transition-colors duration-200`}
          onClick={() => setSelectedStatus(null)}
        >
          ALL
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            className={`filter-tab flex-none text-center px-4 py-2 rounded-full border border-gray-300 whitespace-nowrap text-sm sm:text-base ${
              selectedStatus === status ? "text-red-500 border-red-500" : "text-black bg-transparent"
            } hover:text-red-500 transition-colors duration-200`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p>No orders found for status: &quot;{selectedStatus || "All"}&quot;</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order, index) => (
            <div
              key={`${order.id}-${index}`}
              className={`bg-white p-6 rounded-lg shadow-md border transition-shadow ${
                order.id === "67a3b5e40bf5fee862f00653" ? "border-red-500 shadow-lg" : "border-gray-200 hover:shadow-lg"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Order ID: {order.id}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status.toLowerCase() === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status.toLowerCase() === "canceled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600">
                <strong>Total Price:</strong> R{order.totalPrice.toFixed(2)}
              </p>
              <p className="text-gray-600">
                <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Shipping Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {order.shippingName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {order.shippingEmail}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {order.shippingAddress}
                </p>
                {order.shippingPhoneNumber && (
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {order.shippingPhoneNumber}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Items</h4>
                <ul className="space-y-4">
                  {order.items.map((item) => (
                    <li
                      key={item.id || `${order.id}-${item.productId}`}
                      className="flex items-center gap-4 border-b py-2 last:border-b-0"
                    >
                      {item.product.images && item.product.images.length > 0 ? (
                        <Link href={`/product/${item.product.id}`}>
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="object-cover rounded-md border border-gray-200"
                          />
                        </Link>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="text-gray-800 font-medium hover:text-blue-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x R{item.price.toFixed(2)}
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-500">Size: {item.size.size}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-4">
                <form action={updateOrderStatus} className="space-y-4">
                  <input type="hidden" name="orderId" value={order.id} />
                  <div>
                    <label
                      htmlFor={`status-${order.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Update Status
                    </label>
                    <select
                      id={`status-${order.id}`}
                      name="status"
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                      defaultValue={order.status}
                    >
                      <option value="order submitted">Order Submitted</option>
                      <option value="preparing">Preparing</option>
                      <option value="packaged">Packaged</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Update Status
                  </button>
                </form>

                {order.id === "67a3b5e40bf5fee862f00653" && (
                  <form action={deleteOrder} className="mt-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Remove Duplicate Order
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}