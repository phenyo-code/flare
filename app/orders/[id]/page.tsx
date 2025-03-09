// app/order/[id]/page.tsx
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import ShippingForm from "./ShippingForm";
import { IoIosArrowBack } from "react-icons/io";

interface OrderPageParams {
  id: string;
}

export async function generateMetadata({ params }: { params: Promise<OrderPageParams> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} | FLARE South Africa`,
    description: `View and manage your order #${id} at FLARE South Africa. Track your shipment and update shipping details.`,
  };
}

export default async function OrderPage({ params }: { params: Promise<OrderPageParams> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || !session.user) {
    redirect("/login");
  }

  console.log("Session User ID:", session.user.id);
  console.log("Order ID from params:", id);

  const orderData = await prisma.order.findUnique({
    where: { id: id, userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
          size: true,
        },
      },
    },
  });

  console.log("Order Data:", orderData);

  if (!orderData) {
    console.log(`Order with ID ${id} not found for user ${session.user.id}`);
    return notFound();
  }

  const statusSteps = [
    { id: "order submitted", label: "Order Submitted", color: "bg-yellow-500" },
    { id: "preparing", label: "Preparing", color: "bg-blue-500" },
    { id: "packaged", label: "Packaged", color: "bg-purple-500" },
    { id: "shipped", label: "Shipped", color: "bg-green-500" },
    { id: "delivered", label: "Delivered", color: "bg-teal-500" },
    { id: "canceled", label: "Canceled", color: "bg-red-500" },
  ];
  const currentStepIndex = statusSteps.findIndex((step) => step.id === orderData.status);
  const isCanceled = orderData.status === "canceled";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Order",
    "orderNumber": orderData.id,
    "orderStatus": `https://schema.org/Order${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}`,
    "orderDate": orderData.createdAt.toISOString(),
    "customer": {
      "@type": "Person",
      "name": session.user.name,
      "email": session.user.email,
    },
    "acceptedOffer": orderData.items.map((item) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": item.product.name,
        "sku": item.productId,
        "image": item.product.images[0] || "/default-product-image.png",
      },
      "price": item.price.toString(),
      "priceCurrency": "ZAR",
    })),
    "orderTotal": {
      "@type": "MonetaryAmount",
      "value": orderData.totalPrice.toString(),
      "currency": "ZAR",
    },
    "shippingDetails": {
      "@type": "ParcelDelivery",
      "deliveryAddress": {
        "@type": "PostalAddress",
        "name": orderData.shippingName,
        "streetAddress": orderData.shippingAddress,
        "email": orderData.shippingEmail,
        "telephone": orderData.shippingPhoneNumber || undefined,
      },
      "trackingNumber": orderData.trackingNumber || undefined,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <Link href="/orders">
          <IoIosArrowBack className="text-3xl cursor-pointer" aria-label="Back to Orders" />
        </Link>
        <h1 className="text-xl font-semibold text-center">#{orderData.trackingNumber}</h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="px-6 py-4">
        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Order Status</h2>
          <div className="relative">
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                        isCanceled && step.id !== "canceled"
                          ? "bg-gray-300"
                          : index <= currentStepIndex || (isCanceled && step.id === "canceled")
                          ? step.color
                          : "bg-gray-200"
                      }`}
                    >
                      {index <= currentStepIndex || (isCanceled && step.id === "canceled") ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : index + 1}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-full ${
                          isCanceled && step.id !== "canceled"
                            ? "bg-gray-300"
                            : index < currentStepIndex
                            ? "bg-gradient-to-b from-current to-gray-300"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-800">{step.label}</p>
                    <p className="text-xs text-gray-500">
                      {index === currentStepIndex && !isCanceled ? "Current Status" : index < currentStepIndex ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {orderData.trackingNumber && (
            <p className="text-sm text-gray-600 mt-4">
              Tracking Number: <span className="font-medium text-red-500">{orderData.trackingNumber}</span>
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Placed on {new Date(orderData.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className="w-full block bg-gray-100 h-2" />

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-6 my-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Items</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {orderData.items.map((item) => (
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
                      <p className="text-gray-500 text-sm">Size: {item.size?.size || "N/A" }  x {item.quantity} </p>
                    </div>
                    <p className="text-orange-500 font-semibold mt-2">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center border-t pt-4">
            <p className="text-sm font-medium text-gray-700">Total Price:</p>
            <p className="text-lg font-bold text-red-500">R{orderData.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <span className="w-full block bg-gray-100 h-2" />

        {/* Shipping Details */}
        <div className="bg-white rounded-2xl p-6 my-4 border border-gray-100">
          <ShippingForm orderData={orderData} />
        </div>
      </div>
    </div>
  );
}