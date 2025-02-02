import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function updateOrderStatus(formData: FormData) {
  "use server";

  const orderId = formData.get("orderId")?.toString();
  const status = formData.get("status")?.toString();

  if (!orderId || !status) {
    throw new Error("Order ID and status are required.");
  }

  // Update the order status in the database
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // Redirect after the update
  redirect("/orders-admin?success=true");
}
