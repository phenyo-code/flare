"use client";

import { FormEvent, useState } from "react";
import { PlaceOrder } from "../actions/PlaceOrder"; // Import the action to place the order

export default function CheckoutForm({ shippingAddress }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target as HTMLFormElement);

    try {
      // Call the placeOrder action with form data
      await PlaceOrder(formData);
      // Redirect on success (using Next.js redirection)
      window.location.href = "/order-success?status=completed&success=true";
    } catch (error) {
      console.error("Order placement failed", error);
      // Handle any errors here (e.g., show an error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shippingAddress) {
    return (
      <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p className="text-red-500">⚠ No default shipping address found.</p>
        <p className="mt-2">
          Please{" "}
          <a href="/address-book" className="text-blue-500 underline">
            add a shipping address
          </a>{" "}
          before proceeding.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        {/* Hidden fields to send shipping data with the order */}
        <input type="hidden" name="shippingName" value={shippingAddress.name} />
        <input type="hidden" name="shippingEmail" value={shippingAddress.email} />
        <input type="hidden" name="shippingAddress" value={shippingAddress.address} />
        <input type="hidden" name="shippingPhoneNumber" value={shippingAddress.phoneNumber} />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <p className="p-2 bg-gray-100 rounded-md">{shippingAddress.name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <p className="p-2 bg-gray-100 rounded-md">{shippingAddress.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
          <p className="p-2 bg-gray-100 rounded-md">{shippingAddress.address}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <p className="p-2 bg-gray-100 rounded-md">{shippingAddress.phoneNumber}</p>
        </div>

        {/* Checkout button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
