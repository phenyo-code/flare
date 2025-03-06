"use server";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const status = formData.get("status")?.toString();
  const statusFilter = formData.get("statusFilter")?.toString();
  const sortOrder = formData.get("sortOrder")?.toString();

  if (!orderId || !status) {
    throw new Error("Order ID and status are required.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // Build redirect URL preserving filter state
  const redirectUrl = `/orders-admin?success=true${
    statusFilter ? `&status=${statusFilter}` : ""
  }${sortOrder ? `&sort=${sortOrder}` : ""}`;
  redirect(redirectUrl);
}