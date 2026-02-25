"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

// Initialize Stripe (server-side only – never expose secret key to client)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",   // or use "2025-01-01" / latest stable version you prefer
});

export async function startCheckout(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("You must be logged in.");
  }

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
  let subtotal = order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Apply tiered discount based on subtotal
  let tieredDiscountPercentage = 0;
  if (subtotal >= 3000) {
    tieredDiscountPercentage = 15;
  } else if (subtotal >= 2500) {
    tieredDiscountPercentage = 10;
  } else if (subtotal >= 2000) {
    tieredDiscountPercentage = 5;
  }

  const tieredDiscountAmount = tieredDiscountPercentage > 0
    ? Math.round((subtotal * tieredDiscountPercentage) / 100)
    : 0;

  let amountAfterTiered = subtotal - tieredDiscountAmount;

  // Apply coupon discount if present
  let couponDiscountAmount = 0;
  if (order.coupon) {
    couponDiscountAmount =
      order.coupon.discountType === "percentage"
        ? Math.round((amountAfterTiered * order.coupon.discountValue) / 100)
        : order.coupon.discountValue;
    amountAfterTiered -= couponDiscountAmount;
  }

  // Delivery fee
  const deliveryFee = amountAfterTiered < 1000 ? 100 : 0;

  const finalAmountCents = Math.round((amountAfterTiered + deliveryFee) * 100); // Stripe uses cents

  // Update order in database
  await prisma.order.update({
    where: { id: orderObjectId.toString() },
    data: {
      totalPrice: Number((finalAmountCents / 100).toFixed(2)),
      discountApplied: tieredDiscountAmount + couponDiscountAmount,
    },
  });

  // ────────────────────────────────────────────────
  //               Create Stripe Checkout Session
  // ────────────────────────────────────────────────

  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/check-out?success=true&orderId=${order.id}`;
  const cancelUrl  = `${process.env.NEXT_PUBLIC_APP_URL}/cart`;

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],           // add "paypal" etc. if you want
    mode: "payment",                          // one-time payment (use "subscription" if needed later)
    line_items: [
      {
        price_data: {
          currency: "zar",                    // South African Rand
          product_data: {
            name: "Your Order",
            description:
              (tieredDiscountAmount > 0 || couponDiscountAmount > 0)
                ? `Saved: R${(tieredDiscountAmount + couponDiscountAmount).toFixed(2)}`
                : undefined,
          },
          unit_amount: finalAmountCents,
        },
        quantity: 1,
      },
      // Optional: add separate delivery line item
      ...(deliveryFee > 0
        ? [{
            price_data: {
              currency: "zar",
              product_data: { name: "Delivery Fee" },
              unit_amount: deliveryFee * 100,
            },
            quantity: 1,
          }]
        : []),
    ],
    customer_email: order.user.email ?? undefined,
    metadata: {
      orderId: order.id,
      // You can add more internal reference data here
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (!stripeSession.url) {
    throw new Error("Failed to create Stripe Checkout session");
  }

  // Redirect user to Stripe hosted checkout page
  redirect(stripeSession.url);
}
