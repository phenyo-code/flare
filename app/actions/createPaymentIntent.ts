"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";

export async function createPaymentIntent(orderId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("You must be logged in to proceed.");
  }

  // Fetch order from DB with its items to calculate total dynamically
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { 
      user: true,
      items: { include: { product: true } } // Include items for total calculation
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  // Recalculate the total price dynamically
  const updatedTotalPrice = order.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity); // Sum total based on current items
  }, 0);

  try {
    // Create a PaymentIntent for Stripe Elements with the dynamically calculated total
    const paymentIntent = await stripe.paymentIntents.create({
      amount: updatedTotalPrice * 100, // Convert to cents
      currency: "zar",
      payment_method_types: ["card"], // Enables card payments & Apple Pay
      metadata: { orderId: order.id },
      receipt_email: order.user.email, // Email receipt
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    throw new Error("Failed to create payment intent.");
  }
}
