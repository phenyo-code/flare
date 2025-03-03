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

  // Apply discounts based on total price
  let discountPercentage = 0;
  if (updatedTotalPrice >= 3000) {
    discountPercentage = 15;
  } else if (updatedTotalPrice >= 2500) {
    discountPercentage = 10;
  } else if (updatedTotalPrice >= 2000) {
    discountPercentage = 5;
  }

  const discountAmount = (updatedTotalPrice * discountPercentage) / 100;
  updatedTotalPrice -= discountAmount; // Apply discount

  const deliveryFee = updatedTotalPrice < 1000 ? 100 : 0;
  const finalPrice = updatedTotalPrice + deliveryFee;

  // Update the order with the recalculated total price
  await prisma.order.update({
    where: { id: orderObjectId.toString() },
    data: { totalPrice: finalPrice },
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
            description: discountAmount > 0 ? `Saved: R${discountAmount.toFixed(2)}` : undefined,
          },
          unit_amount: Math.round(finalPrice * 100), // Ensure it's an integer for Stripe
        },
        quantity: 1,
      },
    ],
  });

  redirect(checkoutSession.url!);
}
