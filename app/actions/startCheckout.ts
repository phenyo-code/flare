"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import crypto from "crypto"; // For generating PayFast signature

// PayFast configuration (replace with your actual credentials in .env)
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID as string;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY as string;
const PAYFAST_URL = process.env.PAYFAST_SANDBOX === "true"
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

export async function startCheckout(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("You must be logged in.");

  console.log("Received orderId:", orderId, "Type:", typeof orderId);

  if (!orderId || typeof orderId !== "string") {
    console.error("Invalid orderId: orderId is missing or not a string", { orderId });
    throw new Error("Invalid orderId: Must provide a valid string.");
  }

  const trimmedOrderId = orderId.trim();
  if (!ObjectId.isValid(trimmedOrderId)) {
    console.error("Invalid orderId format:", trimmedOrderId);
    throw new Error("Invalid orderId format.");
  }

  const orderObjectId = new ObjectId(trimmedOrderId);

  const order = await prisma.order.findUnique({
    where: { id: orderObjectId.toString() },
    include: {
      user: true,
      items: { include: { product: true } },
      coupon: true,
    },
  });

  if (!order) {
    console.error("Order not found for orderId:", trimmedOrderId);
    throw new Error("Order not found.");
  }

  // Recalculate total price from order items
  let updatedTotalPrice = order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Apply tiered discounts based on subtotal
  let tieredDiscountPercentage = 0;
  if (updatedTotalPrice >= 3000) {
    tieredDiscountPercentage = 15;
  } else if (updatedTotalPrice >= 2500) {
    tieredDiscountPercentage = 10;
  } else if (updatedTotalPrice >= 2000) {
    tieredDiscountPercentage = 5;
  }

  const tieredDiscountAmount = tieredDiscountPercentage > 0
    ? Math.round((updatedTotalPrice * tieredDiscountPercentage) / 100)
    : 0;
  updatedTotalPrice -= tieredDiscountAmount;

  // Apply coupon discount if present
  let couponDiscountAmount = 0;
  if (order.coupon) {
    couponDiscountAmount =
      order.coupon.discountType === "percentage"
        ? Math.round((updatedTotalPrice * order.coupon.discountValue) / 100)
        : order.coupon.discountValue;
    updatedTotalPrice -= couponDiscountAmount;
  }

  // Add delivery fee based on final total after discounts
  const deliveryFee = updatedTotalPrice < 1000 ? 100 : 0;
  const finalPrice = Math.max(updatedTotalPrice + deliveryFee, 0); // Ensure no negative total

  // Update the order with the recalculated total price and discount details
  await prisma.order.update({
    where: { id: orderObjectId.toString() },
    data: {
      totalPrice: finalPrice,
      discountApplied: tieredDiscountAmount + couponDiscountAmount,
    },
  });

  // Prepare PayFast payment data
  const paymentData: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/check-out?success=true&status=completed&orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payfast/notify`, // You’ll need to create this endpoint
    name_first: order.user.name?.split(" ")[0] || "",
    email_address: order.user.email,
    m_payment_id: order.id, // Unique order ID for your reference
    amount: finalPrice.toFixed(2), // PayFast expects 2 decimal places
    item_name: "Your Order",
    item_description:
      tieredDiscountAmount > 0 || couponDiscountAmount > 0
        ? `Saved: R${(tieredDiscountAmount + couponDiscountAmount).toFixed(2)}`
        : "",
  };

  // Generate PayFast signature
  const generateSignature = (data: Record<string, string>) => {
    const sortedData = Object.keys(data)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
      .join("&");
    return crypto.createHash("md5").update(sortedData).digest("hex");
  };

  paymentData.signature = generateSignature(paymentData);

  // Construct the PayFast payment URL with query parameters
  const queryString = Object.keys(paymentData)
    .map((key) => `${key}=${encodeURIComponent(paymentData[key])}`)
    .join("&");
  const paymentUrl = `${PAYFAST_URL}?${queryString}`;

  // Redirect user to PayFast payment page
  redirect(paymentUrl);
}