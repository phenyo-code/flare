"use server";

import { prisma } from "../lib/db/prisma";
import { redirect } from "next/navigation";

export async function PlaceOrder(formData: FormData) {
  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();

  // Check if all necessary fields are filled
  if (!shippingName || !shippingEmail || !shippingAddress) {
    throw new Error("Please fill in all fields correctly.");
  }

  // Fetch the cart items (without userId filtering for now)
  const cart = await prisma.cart.findFirst({
    include: {
      items: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty. Please add items before placing an order.");
  }

  // Create a new order in the database
  const order = await prisma.order.create({
    data: {
      userId: "someUserId", // Replace with actual userId
      shippingName,
      shippingEmail,
      shippingAddress,
      status: "pending", // Default order status
      totalPrice: 0, // Placeholder for total price, will update later
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
        price: product.price || 0, // Default to 0 if price is not found
      };
    })
  );

  // Insert order items into the database
  await prisma.orderItem.createMany({
    data: orderItems,
  });

  // Calculate total price for the order (sum of item prices * quantity)
  const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Update the order with the calculated total price
  await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  });

  // Clear the cart after placing the order
  await prisma.cart.update({
    where: { id: cart.id },
    data: { items: { deleteMany: {} } },
  });

  // Redirect to a success page or confirmation
  redirect("/order-success");
}
