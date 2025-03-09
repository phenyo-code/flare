"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createOrderAndCheckout } from "@/actions/orderActions";
import { FaCreditCard, FaApple } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";

export default function OrderConfirmationForm({ cart, latestOrder, userId }) {
  const [usePrevious, setUsePrevious] = useState(!!latestOrder);
  const [shippingDetails, setShippingDetails] = useState({
    shippingName: latestOrder?.shippingName || "",
    shippingEmail: latestOrder?.shippingEmail || "",
    shippingAddress: latestOrder?.shippingAddress || "",
    shippingPhoneNumber: latestOrder?.shippingPhoneNumber || "",
  });
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    if (usePrevious && latestOrder) {
      formData.set("shippingName", latestOrder.shippingName);
      formData.set("shippingEmail", latestOrder.shippingEmail);
      formData.set("shippingAddress", latestOrder.shippingAddress);
      formData.set("shippingPhoneNumber", latestOrder.shippingPhoneNumber || "");
    }

    const shippingName = formData.get("shippingName")?.toString();
    const shippingEmail = formData.get("shippingEmail")?.toString();
    const shippingAddress = formData.get("shippingAddress")?.toString();
    const shippingPhoneNumber = formData.get("shippingPhoneNumber")?.toString();

    if (!shippingName || !shippingEmail || !shippingAddress || !shippingPhoneNumber) {
      toast.error("Please fill in all required shipping details.");
      return;
    }

    try {
      await createOrderAndCheckout(formData);
    } catch (err) {
      toast.error("Failed to proceed to payment. Please try again.");
      console.error(err);
    }
  };

  // Pricing calculations
  const subtotal = cart.items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
  let totalPrice = subtotal;
  let tieredDiscountPercentage = 0;
  if (totalPrice >= 3000) tieredDiscountPercentage = 15;
  else if (totalPrice >= 2500) tieredDiscountPercentage = 10;
  else if (totalPrice >= 2000) tieredDiscountPercentage = 5;
  const tieredDiscountAmount = tieredDiscountPercentage > 0 ? Math.round((totalPrice * tieredDiscountPercentage) / 100) : 0;
  totalPrice -= tieredDiscountAmount;
  const deliveryFee = totalPrice < 1000 ? 100 : 0;
  const totalWithDiscount = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-white">
      <form action={handleSubmit}>
        {/* Header with Back Button and Title */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <IoIosArrowBack
            onClick={() => router.back()}
            className="text-3xl cursor-pointer"
          />
          <h2 className="text-xl font-semibold text-center">Order Confirmation</h2>
          <div className="w-20" />
        </div>

        {/* Shipping Details */}
        <div className="px-6 py-4">
          <label className="block text-sm  font-semibold text-gray-800 mb-2">Shipping Details</label>
          {latestOrder && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-100">
              <h3 className="text-sm font-semibold text-red-500 mb-2">Latest Shipping Details</h3>
              <p className="text-gray-600">
                <strong>{latestOrder.shippingName} </strong>| {latestOrder.shippingPhoneNumber || "Not provided"}
              </p>
              <p className="text-gray-600 mt-1"><strong>Address:</strong> {latestOrder.shippingAddress}</p>
            </div>
          )}
          {latestOrder && (
            <div className="mb-4">
              <label className="flex items-center text-sm text-gray-700">
                <input type="radio" checked={usePrevious} onChange={() => setUsePrevious(true)} className="mr-2 accent-red-500" />
                Use Previous Shipping Details
              </label>
              <label className="flex items-center text-sm mt-2 text-gray-700">
                <input type="radio" checked={!usePrevious} onChange={() => setUsePrevious(false)} className="mr-2 accent-red-500" />
                Enter New Shipping Details
              </label>
            </div>
          )}
          {!usePrevious && (
            <>
              <input
                type="text"
                name="shippingName"
                value={shippingDetails.shippingName}
                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingName: e.target.value })}
                placeholder="Full Name"
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="email"
                name="shippingEmail"
                value={shippingDetails.shippingEmail}
                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingEmail: e.target.value })}
                placeholder="Email"
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
                required
              />
              <textarea
                name="shippingAddress"
                value={shippingDetails.shippingAddress}
                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: e.target.value })}
                placeholder="Shipping Address"
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
                rows={4}
                required
              />
              <input
                type="tel"
                name="shippingPhoneNumber"
                value={shippingDetails.shippingPhoneNumber}
                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingPhoneNumber: e.target.value })}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </>
          )}
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Items in Horizontal Scroll View */}
        <div className="px-6 py-4">
          <h3 className="text-sm  font-semibold text-gray-800 mb-2">Items</h3>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {cart.items.map((item: any) => (
              <div key={item.productId} className="flex-shrink-0 w-[150px] overflow-hidden">
                <div className="w-full h-[180px] relative">
                  <Image
                    src={item.product.images[0]} // Assuming images is an array on product
                    alt={item.product.name}
                    width={150}
                    height={180}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-800 font-medium whitespace-nowrap text-ellipsis">{item.product.name}</p>
                  <div className="flex items-center mt-1">
                  <p className="text-gray-500 text-sm">Size: {item.size?.size || "N/A" }  x {item.quantity}</p>
                  
                  </div>
                  <p className="text-orange-500 font-semibold mt-2">R{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Delivery Methods and Details */}
        <div className="px-6 py-4">
          <h3 className="text-sm  font-semibold text-gray-800 mb-2">Delivery Method</h3>
          <p className="text-gray-700 text-sm">Standard Shipping (3-5 business days)</p>
          <p className="text-gray-500 text-sm">
            Cost: {deliveryFee > 0 ? <span className="text-orange-500">R{deliveryFee.toFixed(2)}</span> : <span className="text-green-600">Free (Order over R1000)</span>}
          </p>
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Payment Options */}
        <div className="px-6 py-4">
          <h3 className="text-sm  font-semibold text-gray-800 mb-2">Payment Options</h3>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <FaCreditCard className="text-red-500" size={20} />
              <span className="text-gray-700">Card</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <FaApple className="text-red-500" size={20} />
              <span className="text-gray-700">Apple Pay</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Processed securely via Stripe</p>
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Price Breakdown */}
        <div className="px-6 py-4">
          <h3 className="text-sm  font-semibold text-gray-800 mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Price:</span>
              <span className="text-gray-600">R{subtotal.toFixed(2)}</span>
            </div>
            {tieredDiscountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Savings ({tieredDiscountPercentage}%):</span>
                <span className="text-green-600">-R{tieredDiscountAmount.toFixed(2)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="text-orange-500">R{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span className="text-gray-800">Final Total:</span>
              <span className="text-red-500">R{totalWithDiscount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Submit Button */}
        <div className="px-6 py-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}