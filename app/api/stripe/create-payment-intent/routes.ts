import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Debugging: Log the total price to verify it is correct
    console.log("Order Total Price:", order.totalPrice);

    const unitAmount = Math.round(order.totalPrice * 100); // Ensure it's in cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: order.user.email,
      metadata: { orderId: order.id },
      line_items: [
        {
          price_data: {
            currency: "zar",  // ZAR is South African Rand
            product_data: { name: "Your Order" },
            unit_amount: unitAmount, // In cents
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ clientSecret: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
