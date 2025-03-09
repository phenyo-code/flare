import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import Header from "../components/Header";
import Link from "next/link";
import { redirect } from "next/navigation";

// Define the proper type for searchParams
type SearchParams = {
  status?: string;
};

// Update the prop type to match Next.js expectations
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

  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;
  
  if (!latestOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <Header />
        <div className="max-w-md mt-16 mx-auto bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Order Success</h2>
          <p className="mb-4 p-3 font-medium text-center text-red-600 bg-red-100 rounded-md">
            No recent order found. Please try again or contact support.
          </p>
        </div>
      </div>
    );
  }

  const orderStatus = resolvedSearchParams.status || latestOrder.status;

  // Rest of your component remains the same
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <Header />
      <div className="max-w-md mt-16 mx-auto p-6 bg-white shadow-md rounded-lg animate-fade-in">
        {/* Success Icon */}
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

        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Order Confirmed!</h2>

        {/* Success Message */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-center">
          <p className="font-medium text-green-700">Your order has been placed successfully!</p>
          <p className="mt-2 text-sm text-gray-600">Thank you for shopping with FLARE.</p>
        </div>

        {/* Order Summary */}
        <div className="mb-8 text-center space-y-3 text-gray-700">
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

        {/* Track Order Button */}
        <div className="text-center">
          <Link href={`/orders/${latestOrder.id}`}>
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-full transition-all duration-200 hover:shadow-md">
              Track Your Order
            </button>
          </Link>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 text-center text-sm text-gray-600">
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
    </div>
  );
}