import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import SuccessHeader from "./Header"; // Import the new Client Component

// Define the proper type for searchParams
type SearchParams = {
  status?: string;
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, trackingNumber: true, createdAt: true },
  });

  const resolvedSearchParams = await searchParams;

  if (!latestOrder) {
    return (
      <div className="min-h-screen bg-white">
        <SuccessHeader />
        <div className="px-6 py-4">
          <p className="mb-4 p-3 font-medium text-center text-red-600 bg-red-100 rounded-md">
            No recent order found. Please try again or contact support.
          </p>
        </div>
      </div>
    );
  }

  const orderStatus = resolvedSearchParams.status || latestOrder.status;

  return (
    <div className="min-h-screen bg-white">
      <SuccessHeader />

      {/* Success Icon and Title */}
      <div className="px-6 py-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Confirmed!</h2>
      </div>

      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Success Message */}
      <div className="px-6 py-4">
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-center">
          <p className="font-medium text-green-700">Your order has been placed successfully!</p>
          <p className="mt-2 text-sm text-gray-600">Thank you for shopping with FLARE.</p>
        </div>
      </div>

      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Order Summary */}
      <div className="px-6 py-4 text-center space-y-3 text-gray-700">
        <p>
          Status: <span className="font-medium capitalize text-red-600">{orderStatus}</span>
        </p>
        {latestOrder.trackingNumber && (
          <p>
            Tracking: <span className="font-medium">{latestOrder.trackingNumber}</span>
          </p>
        )}
        <p>
          Ordered:{" "}
          <span className="font-medium">
            {new Date(latestOrder.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          An email confirmation is on its way. Check your inbox (or spam) soon!
        </p>
      </div>

      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Track Order Button */}
      <div className="px-6 py-4 text-center">
        <Link href={`/orders/${latestOrder.id}`}>
          <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200">
            Track Your Order
          </button>
        </Link>
      </div>

      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Additional Actions */}
      <div className="px-6 py-4 text-center text-sm text-gray-600">
        <p>
          Need assistance?{" "}
          <Link href="/contact" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Contact us
          </Link>{" "}
          or{" "}
          <Link href="/for-you" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            keep shopping
          </Link>.
        </p>
      </div>
    </div>
  );
}