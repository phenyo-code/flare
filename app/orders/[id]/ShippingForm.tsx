// app/order/[id]/ShippingForm.tsx
"use client";

import { useState, useTransition } from "react";
import { Order } from "@prisma/client";
import { toast } from "react-toastify";
import { updateShippingDetails } from "@/actions/orderActions";

interface ShippingFormProps {
  orderData: Order & {
    items: {
      product: { id: string; name: string; images: string[] };
      size: { size: string } | null;
      productId: string;
      quantity: number;
      price: number;
    }[];
  };
}

export default function ShippingForm({ orderData }: ShippingFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateShippingDetails(formData, orderData.id);
        setIsEditing(false);
        setIsUpdated(true);
        toast.success("Shipping details updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Submission error:", err);
        toast.error(err instanceof Error ? err.message : "An unexpected error occurred", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Shipping Details</h2>
        
      </div>
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="shippingName"
              defaultValue={orderData.shippingName}
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required
            />
          ) : (
            <p className="mt-2 text-gray-600">{orderData.shippingName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="shippingEmail"
              defaultValue={orderData.shippingEmail}
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required
            />
          ) : (
            <p className="mt-2 text-gray-600">{orderData.shippingEmail}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          {isEditing ? (
            <textarea
              name="shippingAddress"
              defaultValue={orderData.shippingAddress}
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              rows={4}
              required
            />
          ) : (
            <p className="mt-2 text-gray-600 whitespace-pre-wrap">{orderData.shippingAddress}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
          {isEditing ? (
            <input
              type="tel"
              name="shippingPhoneNumber"
              defaultValue={orderData.shippingPhoneNumber || ""}
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          ) : (
            <p className="mt-2 text-gray-600">{orderData.shippingPhoneNumber || "Not provided"}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
          <input
            type="text"
            name="trackingNumber"
            value={orderData.trackingNumber || ""}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            disabled
          />
          <p className="mt-1 text-xs text-gray-500">Tracking number cannot be edited.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setIsUpdated(false);
            }}
            className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
          >
            Edit Shipping Details
          </button>
        )}
        {isEditing && (
          <button
            type="submit"
            disabled={isPending}
            className={`w-full bg-red-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 ${
              isPending || isUpdated ? "opacity-75 cursor-not-allowed" : "hover:bg-red-600 hover:shadow-md"
            }`}
          >
            {isPending ? "Saving" : isUpdated ? "Updated" : "Save Shipping Details"}
          </button>
        )}

      </form>
    </div>
  );
}