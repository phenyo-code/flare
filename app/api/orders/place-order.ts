import { prisma } from "../../lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = new URLSearchParams(await request.text());
    const shippingName = formData.get("shippingName");
    const shippingEmail = formData.get("shippingEmail");
    const shippingAddress = formData.get("shippingAddress");

    if (!shippingName || !shippingEmail || !shippingAddress) {
      return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
    }

    // Fetch the cart items
    const cart = await prisma.cart.findFirst({
      include: {
        items: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty. Please add items before placing an order." }, { status: 400 });
    }

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId: "someUserId", // Replace with actual user ID
        shippingName,
        shippingEmail,
        shippingAddress,
        status: "pending",
        totalPrice: 0,
      },
    });

    // Create order items based on cart items
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { price: true },
        });
        if (!product) {
          throw new Error(`Product not found for item: ${item.productId}`);
        }
        return {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price || 0,
        };
      })
    );

    // Insert the order items into the database
    await prisma.orderItem.createMany({
      data: orderItems,
    });

    // Calculate total price
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Update the order with total price
    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice },
    });

    // Clear the cart after placing the order
    await prisma.cart.update({
      where: { id: cart.id },
      data: { items: { deleteMany: {} } },
    });

    return NextResponse.json({ message: "Order placed successfully." }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
