"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlaceOrder } from "@/actions/PlaceOrder"; // Adjust import path if needed

export default function CheckoutForm({ shippingAddress }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // State to manage editable form fields, prefilled with latest shipping address if available
  const [formData, setFormData] = useState({
    shippingName: shippingAddress?.name || "",
    shippingEmail: shippingAddress?.email || "",
    shippingAddress: shippingAddress?.address || "",
    shippingPhoneNumber: shippingAddress?.phoneNumber || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("shippingName", formData.shippingName);
    form.append("shippingEmail", formData.shippingEmail);
    form.append("shippingAddress", formData.shippingAddress);
    form.append("shippingPhoneNumber", formData.shippingPhoneNumber);

    try {
      await PlaceOrder(form);
      // Redirect handled by PlaceOrder, but we can ensure it here if needed
      router.push("/order-success?status=completed&success=true");
    } catch (error) {
      console.error("Order placement failed", error);
      toast.error("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Complete Checkout</h2>

      {/* Note about post-payment */}
      <p className="mb-4 text-sm text-gray-500">
        Please confirm or update your shipping details below after successful payment.
      </p>

      {/* Show message if no previous shipping address */}
      {!shippingAddress && (
        <p className="mb-4 text-gray-600">
          No previous shipping address found. Please enter your details below.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="shippingName"
            name="shippingName"
            value={formData.shippingName}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shippingEmail" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="shippingEmail"
            name="shippingEmail"
            value={formData.shippingEmail}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
            Shipping Address
          </label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shippingPhoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="shippingPhoneNumber"
            name="shippingPhoneNumber"
            value={formData.shippingPhoneNumber}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}