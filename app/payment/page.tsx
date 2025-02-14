"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPaymentIntent } from "@/actions/createPaymentIntent";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentSuccess = searchParams.get("payment") === "success";
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (orderId && paymentSuccess) {
      createPaymentIntent(orderId)
        .then((data) => {
          if (data?.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => console.error("Error fetching payment intent:", err));
    }
  }, [orderId, paymentSuccess]);

  return (
    <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center">Checkout</h2>

      {paymentSuccess ? (
        clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm orderId={orderId!} />
          </Elements>
        ) : (
          <p className="text-center">Loading Payment...</p>
        )
      ) : (
        <p className="text-center text-red-500">You need to complete payment first.</p>
      )}
    </div>
  );
}
