"use client";

import { useState } from "react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { AddReview as SubmitReviewAction } from "@/actions/AddReview";

export function AddReview({ productId }: { productId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [fitFeedback, setFitFeedback] = useState<string>("");
  const [reviewPosted, setReviewPosted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating: number) => setSelectedRating(rating);
  const handleFitFeedbackChange = (feedback: string) => setFitFeedback(feedback);

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRating || !comment || !fitFeedback) {
      alert("Please provide a rating, comment, and fit feedback.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", selectedRating.toString());
    formData.append("comment", comment);
    formData.append("fitFeedback", fitFeedback);

    try {
      setIsSubmitting(true);
      await SubmitReviewAction(formData, productId);
      setShowForm(false);
      setReviewPosted(true);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {!reviewPosted && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-red-600 mt-4 mx-4 bg-red-300 py-3 px-4 mb-2 rounded-full"
        >
          Write a Review
        </button>
      )}

      {showForm && !reviewPosted && (
        <form onSubmit={handleSubmitReview} className="bg-white p-6 shadow-lg rounded-lg mt-4">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Rate this Product</h2>

          {/* Star Rating */}
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-2xl cursor-pointer transition ${
                  star <= selectedRating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </div>

          {/* Comment Box */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-red-200"
            placeholder="Write your review here..."
          />

          {/* Fit Feedback */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">How does it fit?</label>
            <div className="flex justify-between">
              {["true_to_size", "small", "large"].map((fit) => (
                <label
                  key={fit}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    fitFeedback === fit ? "bg-red-300 text-red-600 " : "border-gray-300 text-gray-600"
                  }`}
                  onClick={() => handleFitFeedbackChange(fit)}
                >
                  {fit.replace("_", " ").toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="w-1/2 text-red-600 mt-4 mx-4 bg-red-300 py-3 px-4 mb-2 rounded-full hover:bg-red-300 transition flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : "Submit Review"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-1/3 text-gray-500 py-2 px-4 text-sm flex items-center justify-center hover:text-gray-700"
            >
              <IoIosArrowUp className="text-lg" />
              <span className="ml-2">Cancel</span>
            </button>
          </div>
        </form>
      )}

      {reviewPosted && (
        <p className="mt-4 text-green-600 font-semibold text-center">
          ✅ Thank you for your review!
        </p>
      )}
    </div>
  );
}
