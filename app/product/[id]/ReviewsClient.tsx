"use client";

import React, { useState } from "react";
import { AddReview } from "./AddReview";

interface Review {
  id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string; // `createdAt` is now a string
}

export default function ReviewsClient({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const [showAll, setShowAll] = useState(false);

  // Calculate average rating
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  // Limit the number of reviews shown initially
  const initialReviews = showAll ? reviews : reviews.slice(0, 2); // Show more or show the first 3 reviews
  const hasMoreReviews = reviews.length > initialReviews.length;

  return (
    <div>
      <div className="mt-4 mx-4  mb-2 ">
        <div className="flex justify-between items-center mb-2 pb-4 border-b">
          <span className="text-lg">Reviews({reviews.length})</span>
          <span className="text-yellow-500">
            {averageRating.toFixed(2)}{" "}
            {"★".repeat(Math.round(averageRating))}{" "}
            {"☆".repeat(5 - Math.round(averageRating))}
          </span>
        </div>

        {reviews.length === 0 ? (
          <p>No reviews yet for this product. Be the first to leave a review!</p>
        ) : (
          <>
            {initialReviews.map((review) => (
              <div key={review.id} className="border-b py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                  <span className="font-semibold mr-2">{review.user.name}</span>
                  <span className="text-yellow-500">
                    {"★".repeat(review.rating)}{" "}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  </div>
                  <span className="text-gray-500 right ">
                    {review.createdAt} {/* Now it's a string */}
                  </span>
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))}

            {/* Show "Show More" link if there are more reviews */}
            {hasMoreReviews && !showAll && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll(true)} // Show all reviews
                  className="text-blue-500"
                >
                  Show More
                </button>
              </div>
            )}

            {/* Hide "Show More" link once all reviews are shown */}
            {hasMoreReviews && showAll && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll(false)} // Hide all reviews again
                  className="text-blue-500"
                >
                  Show Less
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Render the client-side component for review submission */}
      <AddReview productId={productId} />
    </div>
  );
}
