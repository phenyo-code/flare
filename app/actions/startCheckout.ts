"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export async function startCheckout(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("You must be logged in.");

  // Get the order from the database
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { 
      user: true, 
      items: { 
        include: { 
          product: true 
        } 
      } 
    },
  });

  if (!order) throw new Error("Order not found.");

  // Recalculate the total price based on the current cart items
  let updatedTotalPrice = order.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity); // Calculate total price dynamically
  }, 0);

  // Add the delivery fee (R100 if the total is less than R1000)
  const deliveryFee = updatedTotalPrice < 1000 ? 100 : 0;  // Adjusted to R100
  const finalPrice = updatedTotalPrice + deliveryFee;  // Include delivery fee

  // Create a Stripe Checkout session with the updated total price (including delivery fee)
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
          product_data: { name: "Your Order" },
          unit_amount: finalPrice * 100, // Send the total including the delivery fee
        },
        quantity: 1,
      },
    ],
  });

  // Redirect user to Stripe payment page
  redirect(checkoutSession.url!);
}
