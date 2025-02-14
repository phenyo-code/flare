"use server";

import { prisma } from "@/lib/db/prisma";
import { format } from "date-fns"; // Import date-fns for consistent date formatting
import ReviewsClient from "./ReviewsClient"; // Import the client-side component

// Define the FitFeedback enum locally since it's not exported from @prisma/client
enum FitFeedback {
  SMALL = "SMALL",
  TRUE_TO_SIZE = "TRUE_TO_SIZE",
  LARGE = "LARGE",
}

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
    fitFeedback: review.fitFeedback as FitFeedback | null, // Ensure fitFeedback is handled correctly
  }));

  // Filter reviews that have valid fitFeedback
  const reviewsWithFitFeedback = reviews.filter((r) => r.fitFeedback);

  // Count occurrences of each fit type among reviews with fit feedback
  const fitCounts = {
    small: reviewsWithFitFeedback.filter((r) => r.fitFeedback === FitFeedback.SMALL).length,
    trueToSize: reviewsWithFitFeedback.filter((r) => r.fitFeedback === FitFeedback.TRUE_TO_SIZE).length,
    large: reviewsWithFitFeedback.filter((r) => r.fitFeedback === FitFeedback.LARGE).length,
  };

  // Calculate percentages based on reviews that have valid fitFeedback
  const totalFitFeedbackReviews = reviewsWithFitFeedback.length;
  const smallPercentage = totalFitFeedbackReviews > 0 ? Math.round((fitCounts.small / totalFitFeedbackReviews) * 100) : 0;
  const trueToSizePercentage = totalFitFeedbackReviews > 0 ? Math.round((fitCounts.trueToSize / totalFitFeedbackReviews) * 100) : 0;
  const largePercentage = totalFitFeedbackReviews > 0 ? Math.round((fitCounts.large / totalFitFeedbackReviews) * 100) : 0;

  // Pass the fit percentages to the client-side component
  return (
    <div>
      {/* Pass productId, reviews, and fit percentages to the client-side component */}
      <ReviewsClient 
        productId={productId} 
        reviews={reviewsWithFormattedDates} 
        fitPercentages={{
          small: smallPercentage,
          trueToSize: trueToSizePercentage,
          large: largePercentage,
        }}
      />
    </div>
  );
}
