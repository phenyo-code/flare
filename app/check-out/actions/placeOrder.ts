"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";

// Server action function to place an order
export async function PlaceOrder(formData: FormData): Promise<void> {
  // Fetch user session to get logged-in user's details
  const session = await getServerSession(authOptions);

  // If user is not authenticated, throw an error
  if (!session || !session.user) {
    throw new Error("You must be logged in to place an order.");
  }

  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();
  const shippingPhoneNumber = formData.get("shippingPhoneNumber")?.toString(); // New field

  // Check if required fields are provided
  if (!shippingName || !shippingEmail || !shippingAddress || !shippingPhoneNumber) {
    throw new Error("Please fill in all fields.");
  }

  // Fetch cart items for the logged-in user
  const cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id, // Ensure to fetch cart for logged-in user
    },
    include: {
      items: {
        include: {
          size: true, // Include the size of the product for each cart item
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty. Please add items before placing an order.");
  }

  // Create a new order with the userId from the session
  const order = await prisma.order.create({
    data: {
      userId: session.user.id, // Use the authenticated user's ID
      shippingName,
      shippingEmail,
      shippingAddress,
      shippingPhoneNumber, // Add phone number
      status: "pending", // Default status
      totalPrice: 0, // Placeholder for total price, will update later
    },
  });

  // Create order items from the cart items
  const orderItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { price: true },
      });

      if (!product) {
        throw new Error(`Product not found for item: ${item.productId}`);
      }

      // Return order items with the sizeId linked to each item
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price || 0, // Default to 0 if price is not found
        sizeId: item.sizeId, // Include the sizeId for each item
      };
    })
  );

  // Insert the order items into the database
  await prisma.orderItem.createMany({
    data: orderItems,
  });

  // Calculate the total price (sum of item prices * quantity)
  const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Update the order with the total price
  await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  });

  // Clear the cart for the user
  await prisma.cart.update({
    where: { id: cart.id },
    data: { items: { deleteMany: {} } },
  });

  // Redirect to the success page after placing the order
  redirect("/order-success?status=pending");
}
