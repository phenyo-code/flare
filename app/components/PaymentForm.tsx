"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const success = searchParams.get("success"); // Check if payment was successful

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (success) {
      setErrorMessage(null); // Clear errors if redirected after success
    }
  }, [success]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success?status=completed&success=true&orderId=${orderId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
    } else if (paymentIntent?.status === "succeeded") {
      window.location.href = `/order-success?status=completed&success=true&orderId=${orderId}`;
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Success Message */}
      {success && (
        <p className="mb-4 p-2 text-center text-white bg-green-500 rounded-md">
          ✅ Payment successful! Your order has been placed.
        </p>
      )}

      <h3 className="text-lg font-semibold mb-4">Enter Payment Details</h3>
      
      {/* Stripe Payment Fields */}
      <PaymentElement />

      {/* Display Errors */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
