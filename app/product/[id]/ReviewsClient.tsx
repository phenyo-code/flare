"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"; // Import authentication session
import { AddReview } from "./AddReview";

enum FitFeedback {
  SMALL = "SMALL",
  TRUE_TO_SIZE = "TRUE_TO_SIZE",
  LARGE = "LARGE",
}

interface Review {
  id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string; // `createdAt` is now a string
  fitFeedback: FitFeedback | null; // Fit feedback can be null if not provided
}

interface FitPercentages {
  small: number;
  trueToSize: number;
  large: number;
}

export default function ReviewsClient({
  productId,
  reviews,
  fitPercentages,
}: {
  productId: string;
  reviews: Review[];
  fitPercentages: FitPercentages;
}) {
  const { data: session } = useSession(); // Get authentication session
  const isAuthenticated = !!session; // Check if user is authenticated

  const [showAll, setShowAll] = useState(false);

  // Calculate average rating
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  // Limit the number of reviews shown initially
  const initialReviews = showAll ? reviews : reviews.slice(0, 1); // Show first review by default
  const hasMoreReviews = reviews.length > initialReviews.length;

  // Round percentages to whole numbers
  const roundedFitPercentages = {
    small: Math.round(fitPercentages.small),
    trueToSize: Math.round(fitPercentages.trueToSize),
    large: Math.round(fitPercentages.large),
  };

  return (
    <div>
      <div className="mt-4 mx-4 mb-2">
        {/* Header with total reviews and average rating */}
        <div className="flex justify-between items-center mb-2 pb-4 border-b">
          <span className="text-sm">Reviews ({reviews.length})</span>
          <p className="text-lg font-semibold">
            {averageRating.toFixed(1)} <span className="text-yellow-500">★</span>
          </p>
        </div>

        {/* Fit Feedback Summary with flex layout */}
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="text-xs font-medium mb-4 text-gray-500">Feedback Summary: </p>
          <div className="flex justify-between items-center mb-2 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-xs">Small</span>
              <div className="w-24 h-1 bg-gray-300 rounded-full mt-2">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${roundedFitPercentages.small}%` }}
                />
              </div>
              <span className="text-xs">{roundedFitPercentages.small}%</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs">True to Size</span>
              <div className="w-24 h-1 bg-gray-300 rounded-full mt-2">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${roundedFitPercentages.trueToSize}%` }}
                />
              </div>
              <span className="text-xs">{roundedFitPercentages.trueToSize}%</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs">Large</span>
              <div className="w-24 h-1 bg-gray-300 rounded-full mt-2">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${roundedFitPercentages.large}%` }}
                />
              </div>
              <span className="text-xs">{roundedFitPercentages.large}%</span>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p>No reviews yet for this product. Be the first to leave a review!</p>
        ) : (
          <>
            {initialReviews.map((review) => (
              <div key={review.id} className="border-b py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2 text-sm">{review.user.name}</span>
                    <span className="text-yellow-500 text-sm">
                      {"★".repeat(review.rating)}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">{review.createdAt}</span>
                </div>
                <p className="mt-2">{review.comment}</p>

                {/* Display Fit Feedback */}
                <p className="text-xs">
                  Fit:{" "}
                  <span className="font-semibold">
                    {review.fitFeedback ? review.fitFeedback.replace("_", " ") : "No fit feedback"}
                  </span>
                </p>
              </div>
            ))}

            {/* Show More / Show Less Button */}
            {hasMoreReviews && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-blue-500"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Show AddReview only if the user is authenticated */}
      {isAuthenticated && <AddReview productId={productId} />}
    </div>
  );
}
