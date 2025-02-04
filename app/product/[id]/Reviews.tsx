"use server";

import { prisma } from "@/lib/db/prisma"; 
import { format } from "date-fns"; // Import date-fns for consistent date formatting
import ReviewsClient from "./ReviewsClient"; // Import the client-side component

export default async function Reviews({ productId }: { productId: string }) {
  // Fetch all reviews for the product
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { name: true } }, // Include user name who left the review
    },
  });

  // Convert createdAt to a consistent string format using date-fns
  const reviewsWithFormattedDates = reviews.map((review) => ({
    ...review,
    createdAt: format(review.createdAt, "yyyy-MM-dd"), // Format date consistently
  }));

  return (
    <div>
      {/* Pass productId and reviews to the client-side component */}
      <ReviewsClient productId={productId} reviews={reviewsWithFormattedDates} />
    </div>
  );
}
