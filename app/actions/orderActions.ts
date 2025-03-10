// app/actions/orderActions.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";

export async function updateShippingDetails(formData: FormData, orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();
  const shippingPhoneNumber = formData.get("shippingPhoneNumber")?.toString();

  if (!shippingName || !shippingEmail || !shippingAddress) {
    throw new Error("Please fill in all required fields.");
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId, userId: session.user.id },
      data: {
        shippingName,
        shippingEmail,
        shippingAddress,
        shippingPhoneNumber: shippingPhoneNumber || null,
        // trackingNumber is excluded to prevent updates
      },
    });
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating shipping details:", error);
    throw new Error("Failed to update shipping details");
  }
}