// actions/checkout.ts (assuming this is the file path)
"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

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
      coupon: true, // Include coupon details
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
      discountApplied: tieredDiscountAmount + couponDiscountAmount, // Store total discount
    },
  });

  // Create Stripe Checkout session with updated total
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/check-out?success=true&status=completed&orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    customer_email: order.user.email,
    metadata: { orderId: order.id },
    line_items: [
      {
        price_data: {
          currency: "zar",
          product_data: {
            name: "Your Order",
            description:
              tieredDiscountAmount > 0 || couponDiscountAmount > 0
                ? `Saved: R${(tieredDiscountAmount + couponDiscountAmount).toFixed(2)}`
                : undefined,
          },
          unit_amount: Math.round(finalPrice * 100), // Ensure it's an integer for Stripe
        },
        quantity: 1,
      },
    ],
  });

  redirect(checkoutSession.url!);
}