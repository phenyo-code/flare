// actions/AddReview.tsx
"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { generateCouponForReview } from "./couponUtils";

export async function AddReview(formData: FormData, productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("User not authenticated");
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
    throw new Error("You can only review products you have purchased.");
  }

  // Check if user has already reviewed this product (limit to one review per product)
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product.");
  }

  const rating = Number(formData.get("rating") || 0);
  const comment = formData.get("comment")?.toString();
  const fitFeedback = formData.get("fitFeedback")?.toString();

  if (!rating || !comment || !fitFeedback) {
    throw new Error("Please provide a rating, comment, and fit feedback.");
  }

  const validFitFeedback = ["SMALL", "TRUE_TO_SIZE", "LARGE"].includes(fitFeedback.toUpperCase())
    ? fitFeedback.toUpperCase()
    : null;

  if (!validFitFeedback) {
    throw new Error("Invalid fit feedback value. Use SMALL, TRUE_TO_SIZE, or LARGE.");
  }

  await prisma.review.create({
    data: {
      productId,
      userId,
      rating,
      comment,
      fitFeedback: validFitFeedback as "SMALL" | "TRUE_TO_SIZE" | "LARGE",
    },
  });

  const coupon = await generateCouponForReview(userId, productId);

  return {
    success: true,
    coupon,
    redirectUrl: `/product/${productId}`,
  };
}