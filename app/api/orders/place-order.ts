import { prisma } from "../../lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // Fetch user session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "You must be logged in to place an order." }, { status: 401 });
    }

    const formData = new URLSearchParams(await request.text());
    const shippingName = formData.get("shippingName");
    const shippingEmail = formData.get("shippingEmail");
    const shippingAddress = formData.get("shippingAddress");

    if (!shippingName || !shippingEmail || !shippingAddress) {
      return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
    }

    // Fetch the cart items
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id }, // Fetch user's cart
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty. Please add items before placing an order." }, { status: 400 });
    }

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id, // Use the authenticated user ID
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
