// components/AddReview.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaSpinner, FaStar, FaTimes, FaCopy, FaCheck } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { AddReview as SubmitReviewAction } from "@/actions/AddReview";
import { checkReviewEligibility } from "@/actions/checkReviewEligibility";
import { useRouter } from "next/navigation";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  maxUses: number;
  copied?: boolean;
}

export function AddReview({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [fitFeedback, setFitFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canReview, setCanReview] = useState<boolean | null>(null);
  const [eligibilityMessage, setEligibilityMessage] = useState<string>("");

  // Check eligibility when component mounts or productId changes
  useEffect(() => {
    if (session?.user) {
      checkReviewEligibility(productId).then((result) => {
        setCanReview(result.canReview);
        setEligibilityMessage(result.message);
      });
    }
  }, [session, productId]);

  const handleRatingChange = (rating: number) => setSelectedRating(rating);
  const handleFitFeedbackChange = (feedback: string) => setFitFeedback(feedback);

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRating || !comment || !fitFeedback) {
      setErrorMessage("Please provide a rating, comment, and fit feedback.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", selectedRating.toString());
    formData.append("comment", comment);
    formData.append("fitFeedback", fitFeedback);

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const response = await SubmitReviewAction(formData, productId);
      if (response.success && response.coupon) {
        setCoupons([{ ...response.coupon, expiresAt: response.coupon.expiresAt?.toISOString() || "", copied: false }]);
        setShowCoupons(true);
        setShowForm(false);
        setSelectedRating(null);
        setComment("");
        setFitFeedback("");
        setTimeout(() => router.push(response.redirectUrl), 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (couponId: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCoupons(coupons.map(c => 
        c.id === couponId ? { ...c, copied: true } : c
      ));
      setTimeout(() => {
        setCoupons(coupons.map(c => ({ ...c, copied: false })));
      }, 2000);
    }).catch(err => console.error("Failed to copy:", err));
  };

  return (
    <div className="max-w-lg mx-auto relative">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full  text-white py-3 px-4 mb-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 "
        >
          Write a Review
        </button>
      )}

      {showForm && canReview === null && (
        <div className="bg-white p-6 shadow-lg rounded-lg mt-4 text-center">
          <FaSpinner className="animate-spin text-red-600 mx-auto" size={24} />
          <p className="mt-2 text-gray-600">Checking eligibility...</p>
        </div>
      )}

      {showForm && canReview === false && (
        <div className="bg-white p-6 shadow-lg rounded-lg mt-4 text-center">
          <p className="text-blue-400 text-lg">{eligibilityMessage}</p>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="mt-4 text-gray-500 py-2 px-4 text-sm flex items-center justify-center mx-auto hover:text-gray-700"
          >
            <IoIosArrowUp className="text-lg" />
            <span className="ml-2">Close</span>
          </button>
        </div>
      )}

      {showForm && canReview === true && (
        <form onSubmit={handleSubmitReview} className="bg-white p-6 shadow-lg rounded-lg mt-4">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Rate this Product</h2>

          {errorMessage && (
            <p className="text-red-600 text-sm text-center mb-4">{errorMessage}</p>
          )}

          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-2xl cursor-pointer transition ${
                  star <= (selectedRating || 0) ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-red-200"
            placeholder="Write your review here..."
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">How does it fit?</label>
            <div className="flex justify-between">
              {["true_to_size", "small", "large"].map((fit) => (
                <label
                  key={fit}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    fitFeedback === fit ? "bg-red-300 text-red-600" : "border-gray-300 text-gray-600"
                  }`}
                  onClick={() => handleFitFeedbackChange(fit)}
                >
                  {fit.replace("_", " ").toUpperCase()}
                </label>
              ))}
            </div>
          </div>

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

      {showCoupons && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowCoupons(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div
            className="w-full max-w-md bg-white rounded-t-xl p-6 transform transition-transform duration-300 translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Coupons</h2>
              <button onClick={() => setShowCoupons(false)} className="text-gray-600 hover:text-gray-800">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-gradient-to-r from-red-50 to-pink-50 shadow-lg overflow-hidden"
                  style={{
                    border: "2px solid transparent",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q 5 5 10 0 T 20 0 Q 15 5 10 0 T 0 0 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
                    backgroundPosition: "top, bottom, left, right",
                    backgroundSize: "20px 10px, 20px 10px, 10px 20px, 10px 20px",
                    padding: "2px",
                  }}
                >
                  <div className="p-4 bg-white m-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-left">
                        <p className="text-3xl font-extrabold text-red-600">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `$${coupon.discountValue}`}{" "}
                          <span className="text-xs uppercase tracking-wide text-red-500 font-semibold">
                            {coupon.discountType === "percentage" ? "Off" : "Discount"}
                          </span>
                        </p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{coupon.code}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {coupon.maxUses > 1 ? `${coupon.maxUses} uses remaining` : "Single use"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(coupon.id, coupon.code)}
                        className="text-gray-600 hover:text-red-600 transition-colors ml-4"
                        title={coupon.copied ? "Copied!" : "Copy code"}
                      >
                        {coupon.copied ? (
                          <FaCheck className="w-5 h-5 text-green-500" />
                        ) : (
                          <FaCopy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="h-10 bg-red-500/10 text-center flex items-center justify-center border-t border-dashed border-gray-300">
                    <p className="text-sm text-gray-600">
                      Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}