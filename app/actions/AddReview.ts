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

  if (!rating || !comment) {
    throw new Error("Please provide both a rating and a comment.");
  }

  // Create the review
  await prisma.review.create({
    data: {
      productId,
      userId, // Correct userId from the session
      rating,
      comment,
    },
  });

  // Redirect after successful review submission
  redirect(`/product/${productId}?reviewSubmitted=true`);
}
