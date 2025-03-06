"use server";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function deleteOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;

  if (!orderId) {
    console.error("No orderId provided in formData");
    throw new Error("No order ID provided"); // Throw error instead of returning
  }

  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    console.log(`Deleted order with ID: ${orderId}`);
    redirect("/admin/orders"); // Redirect ends the response
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error; // Throw error to be handled by the caller or Next.js
  }
}