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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link
              href="/orders"
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center transition-colors duration-200"
            >
              <span className="mr-2">←</span> Back to Orders
            </Link>
            <h1 className="text-5xl font-bold text-gray-900 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-gray-800 animate-fade-in">
              {orderData.trackingNumber}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Placed on {new Date(orderData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Order Status Tracker - Vertical */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Status</h2>
          <div className="relative">
            <div className="space-y-6">
              {statusSteps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                        isCanceled && step.id !== "canceled"
                          ? "bg-gray-300"
                          : index <= currentStepIndex || (isCanceled && step.id === "canceled")
                          ? step.color
                          : "bg-gray-200"
                      }`}
                    >
                      {index <= currentStepIndex || (isCanceled && step.id === "canceled") ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-full ${
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
                    <p className="text-lg font-medium text-gray-800">{step.label}</p>
                    <p className="text-sm text-gray-500">
                      {index === currentStepIndex && !isCanceled ? "Current Status" : index < currentStepIndex ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {orderData.trackingNumber && (
            <p className="text-sm text-gray-600 mt-6">
              Tracking Number: <span className="font-medium text-gray-800">{orderData.trackingNumber}</span>
            </p>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Items</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {orderData.items.map((item) => (
              <div
                key={item.productId}
                className="overflow-hidden w-[150px] flex-shrink-0 rounded-xl transition-all duration-200"
              >
                <Link href={`/product/${item.product.id}`} className="block">
                  <div className="w-full h-[130px]">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={100}
                        height={130}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 opacity-75" />
                    )}
                  </div>
                  <div className="flex flex-col ml-2 mb-2 mt-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm font-semibold text-red-500 mr-1">R{item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500">Size: {item.size.size}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <p className="text-lg font-medium text-gray-700">Total Price:</p>
            <p className="text-3xl font-bold text-gray-900">R{orderData.totalPrice}</p>
          </div>
        </div>

        {/* Shipping Details */}
        <ShippingForm orderData={orderData} />
      </div>
    </div>
  );
}