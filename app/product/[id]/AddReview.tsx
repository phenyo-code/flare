"use client"; // This marks the component as a client component

import { useState } from "react";
import { AddReview as SubmitReviewAction } from "@/actions/AddReview";

export function AddReview({ productId }: { productId: string }) {
  const [showForm, setShowForm] = useState(false); // Form is initially hidden
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [reviewPosted, setReviewPosted] = useState(false); // Track if review is posted

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedRating || !comment) {
      alert("Please select a rating and provide a comment.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", selectedRating.toString());
    formData.append("comment", comment);

    try {
      // Submit the review
      await SubmitReviewAction(formData, productId); // Call the server-side action

      // Hide the form immediately and show the "Thank you" message
      setShowForm(false);
      setReviewPosted(true);

    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div>
      {/* Show the "Write a Review" button if no review has been posted yet */}
      {!reviewPosted && !showForm && (
        <button
          onClick={() => setShowForm(true)} // Allow form to show when clicked
          className=" text-red-500 mt-4 mx-4  mb-2 "
        >
          Write a Review
        </button>
      )}

      {/* Show the form if it is visible and the review has not been posted */}
      {showForm && !reviewPosted && (
        <form onSubmit={handleSubmitReview} className="mt-8 mx-4  mb-2 ">
          <div className="mb-4">
            <label className="block text-lg font-medium text-center ">Rating</label>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-xl ${star <= selectedRating ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-lg font-medium">Comment</label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-6 rounded"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Display the thank you message once the review is posted */}
      {reviewPosted && <p className="mt-4 text-green-500">Thank you for your review!</p>}
    </div>
  );
}
