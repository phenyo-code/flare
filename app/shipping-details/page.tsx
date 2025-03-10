"use server"; // Server component

import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { UpdateOrderShipping } from "@/actions/UpdateOrderShipping";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export default async function ShippingDetailsPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/signin");

  const orderId = searchParams.orderId;
  if (!orderId) redirect("/cart");

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
  });
  if (!order || order.status !== "pending") redirect("/cart");

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id, status: "order submitted" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Shipping Details</h2>
      <form action={async (formData) => {
        "use server";
        await UpdateOrderShipping(formData, orderId);
      }}>
        {latestOrder && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-100">
            <h3 className="text-sm font-semibold text-red-500 mb-2">Last Confirmed Shipping Details</h3>
            <p className="text-gray-600">
              <strong>{latestOrder.shippingName} </strong>| {latestOrder.shippingPhoneNumber || "Not provided"}
            </p>
            <p className="text-gray-600 mt-1"><strong>Address:</strong> {latestOrder.shippingAddress}</p>
          </div>
        )}
        <input
          type="text"
          name="shippingName"
          defaultValue={latestOrder?.shippingName || ""}
          placeholder="Full Name"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="email"
          name="shippingEmail"
          defaultValue={latestOrder?.shippingEmail || ""}
          placeholder="Email"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
          required
        />
        <textarea
          name="shippingAddress"
          defaultValue={latestOrder?.shippingAddress || ""}
          placeholder="Shipping Address"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
          rows={4}
          required
        />
        <input
          type="tel"
          name="shippingPhoneNumber"
          defaultValue={latestOrder?.shippingPhoneNumber || ""}
          placeholder="Phone Number"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200"
        >
          Confirm Shipping Details
        </button>
      </form>
    </div>
  );
}