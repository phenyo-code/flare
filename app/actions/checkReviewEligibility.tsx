// actions/checkReviewEligibility.tsx
"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";

export async function checkReviewEligibility(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { canReview: false, message: "User not authenticated" };
  }

  const userId = session.user.id;

  // Check if user has purchased the product
  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId,
      items: {
        some: {
          productId,
        },
      },
    },
  });

  if (!hasPurchased) {
    return { canReview: false, message: "You can only review products you have purchased." };
  }

  // Check if user has already reviewed this product
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existingReview) {
    return { canReview: false, message: "You have already reviewed this product." };
  }

  return { canReview: true, message: "You can submit a review." };
}