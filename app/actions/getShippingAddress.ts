// src/actions/getShippingAddress.ts
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";

export async function getShippingAddress(userId: string) {
  try {
    // Fetch the shipping address for the authenticated user
    const address = await prisma.shippingAddress.findFirst({
      where: { userId },
    });
    return address || null;
  } catch (error) {
    console.error("Error fetching shipping address:", error);
    throw new Error("Failed to fetch shipping address");
  }
}
