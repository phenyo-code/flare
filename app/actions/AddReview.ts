"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export async function AddReview(formData: FormData, productId: string) {
  // Get the authenticated user session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  // Retrieve the user ID from the session
  const userId = session.user.id; // Ensure you're getting the correct user ID from the session

  const rating = Number(formData.get("rating") || 0);
  const comment = formData.get("comment")?.toString();
  const fitFeedback = formData.get("fitFeedback")?.toString(); // Get the fit feedback

  if (!rating || !comment || !fitFeedback) {
    throw new Error("Please provide a rating, comment, and fit feedback.");
  }

  // Ensure fitFeedback is a valid enum value
  const validFitFeedback: "SMALL" | "TRUE_TO_SIZE" | "LARGE" = 
    ["SMALL", "TRUE_TO_SIZE", "LARGE"].includes(fitFeedback.toUpperCase()) 
      ? fitFeedback.toUpperCase() as "SMALL" | "TRUE_TO_SIZE" | "LARGE" 
      : "TRUE_TO_SIZE";

  // Create the review
  await prisma.review.create({
    data: {
      productId,
      userId, // Correct userId from the session
      rating,
      comment,
      fitFeedback: validFitFeedback, // Ensure fitFeedback matches the enum value
    },
  });

  // Redirect after successful review submission
  redirect(`/product/${productId}?reviewSubmitted=true`);
}
