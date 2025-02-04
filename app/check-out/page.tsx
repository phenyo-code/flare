"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation"; // To access query params
import { PlaceOrder } from "../actions/PlaceOrder"; // Importing server action
import SearchHeader from "../components/SearchHeader";
import CheckoutButton from "./PlaceOrderButton";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const success = searchParams?.get("success");
  const status = searchParams?.get("status");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    // Call the PlaceOrder server action
    try {
      await PlaceOrder(formData);
      // On success, redirect with query params
      window.location.href = "/order-success?status=completed&success=true";
    } catch (error) {
      console.error("Order placement failed", error);
      // Show an error message to the user
    }
  };

  return (
    <div>
      <SearchHeader />
      <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {/* Display success message */}
        {success && (
          <p className="mb-4 p-2 text-center text-white bg-green-500 rounded-md">
            ✅ Order placed successfully!
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="shippingName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="shippingName"
              name="shippingName"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="shippingEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="shippingEmail"
              name="shippingEmail"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="shippingAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* New phone number field */}
          <div className="mb-4">
            <label
              htmlFor="shippingPhoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="shippingPhoneNumber"
              name="shippingPhoneNumber"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          <CheckoutButton status={status} />

        </form>
      </div>
    </div>
  );
}