// Import necessary libraries
import Header from "../components/Header";

export default function OrderSuccessPage() {
  return (
    <div>
      <Header />
      <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Order Success</h2>

        {/* Success message */}
        <p className="mb-4 p-2 font-semibold text-center text-white bg-green-500 rounded-md">
        Your order has been placed successfully!
        </p>

        {/* Order summary */}
        <div className="mb-4 text-center">
          <p>Your order is being processed. You will receive an email confirmation shortly.</p>
        </div>
      </div>
    </div>
  );
}
