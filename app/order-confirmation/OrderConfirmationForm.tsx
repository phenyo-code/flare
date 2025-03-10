"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { startCheckout } from "@/actions/startCheckout";
import { FaCreditCard, FaApple } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import HomeSkeleton from "@/components/HomeSkeleton";

export default function OrderConfirmationForm({ cart, latestOrder, userId, orderId }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isCartValid = cart && Array.isArray(cart.items) && cart.items.length > 0;

  const handleSubmit = async () => {
    if (!isCartValid) {
      toast.error("Cart is empty or invalid.");
      return;
    }

    setIsLoading(true);
    try {
      // Assuming orderId is passed from parent or created elsewhere
      if (!orderId) {
        throw new Error("No order ID available to start checkout.");
      }
      await startCheckout(orderId);
    } catch (err) {
      toast.error("Failed to start payment. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  if (!isCartValid) return <HomeSkeleton />;

  const subtotal = cart.items.reduce((sum: number, item: any) => {
    const price = item.product?.price || 0;
    const quantity = Number.isInteger(item.quantity) && item.quantity >= 0 ? item.quantity : 0;
    return sum + price * quantity;
  }, 0);
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
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <IoIosArrowBack onClick={() => router.back()} className="text-3xl cursor-pointer" />
          <h2 className="text-xl font-semibold text-center">Order Confirmation</h2>
          <div className="w-20" />
        </div>

        {/* Latest Shipping Details Preview */}
        {latestOrder && (
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Latest Shipping Details</h3>
            <div className="mb-4 p-4 bg-gray-50 border border-gray-100">
              <p className="text-gray-600">
                <strong>{latestOrder.shippingName} </strong>| {latestOrder.shippingPhoneNumber || "Not provided"}
              </p>
              <p className="text-gray-600 mt-1"><strong>Address:</strong> {latestOrder.shippingAddress}</p>
            </div>
            <p className="text-sm text-gray-500">
              You will confirm or update your shipping address after payment is successful.
            </p>
          </div>
        )}
        {!latestOrder && (
          <div className="px-6 py-4">
            <p className="text-sm text-gray-500">
              You will enter your shipping address after payment is successful.
            </p>
          </div>
        )}

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Items */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Items</h3>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {cart.items.map((item: any) => (
              <div key={item.productId} className="flex-shrink-0 w-[150px] overflow-hidden">
                <div className="w-full h-[180px] relative">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={150}
                    height={180}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-800 font-medium whitespace-nowrap text-ellipsis">{item.product.name}</p>
                  <p className="text-gray-500 text-sm">
                    Size: {item.size?.size || "N/A"} x {item.quantity}
                  </p>
                  <p className="text-orange-500 font-semibold mt-2">R{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Delivery Method */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Delivery Method</h3>
          <p className="text-gray-700 text-sm">Standard Shipping (3-5 business days)</p>
          <p className="text-gray-500 text-sm">
            Cost: {deliveryFee > 0 ? <span className="text-orange-500">R{deliveryFee.toFixed(2)}</span> : <span className="text-green-600">Free (Order over R1000)</span>}
          </p>
        </div>

        <span className="w-full block bg-gray-100 h-2"></span>

        {/* Payment Options */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Payment Options</h3>
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

        {/* Order Summary */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Order Summary</h3>
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
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}