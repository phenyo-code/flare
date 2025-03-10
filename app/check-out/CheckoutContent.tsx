"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlaceOrder } from "@/actions/PlaceOrder";
import { IoIosArrowBack } from "react-icons/io";

export default function CheckoutContent({ shippingAddress, success, orderId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    shippingName: shippingAddress?.shippingName || "",
    shippingEmail: shippingAddress?.shippingEmail || "",
    shippingAddress: shippingAddress?.shippingAddress || "",
    shippingPhoneNumber: shippingAddress?.shippingPhoneNumber || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("shippingName", formData.shippingName);
    form.append("shippingEmail", formData.shippingEmail);
    form.append("shippingAddress", formData.shippingAddress);
    form.append("shippingPhoneNumber", formData.shippingPhoneNumber);
    form.append("orderId", orderId); // Pass orderId from startCheckout

    try {
      await PlaceOrder(form);
      router.push("/order-success?status=completed&success=true");
    } catch (error) {
      console.error("Order placement failed", error);
      toast.error("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <IoIosArrowBack onClick={() => router.back()} className="text-3xl cursor-pointer" />
          <h2 className="text-xl font-semibold text-center">Complete Checkout</h2>
          <div className="w-20" />
        </div>

        {success && (
          <div className="px-6 py-4">
            <p className="p-2 text-center text-white bg-green-500 rounded-md">
              Your Payment Was Successful!
            </p>
          </div>
        )}

        {shippingAddress && (
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Last Confirmed Shipping Details</h3>
            <div className="mb-4 p-4 bg-gray-50 border border-gray-100">
              <p className="text-gray-600">
                <strong>{shippingAddress.shippingName} </strong>| {shippingAddress.shippingPhoneNumber || "Not provided"}
              </p>
              <p className="text-gray-600 mt-1"><strong>Address:</strong> {shippingAddress.shippingAddress}</p>
            </div>
            <p className="text-sm text-gray-500">
              Please confirm or update your shipping details below.
            </p>
          </div>
        )}
        {!shippingAddress && (
          <div className="px-6 py-4">
            <p className="text-sm text-gray-500">
              No previous shipping address found. Please enter your details below.
            </p>
          </div>
        )}

        <span className="w-full block bg-gray-100 h-2"></span>

        <div className="px-6 py-4">
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
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
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
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
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
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
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
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        <div className="px-6 py-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}