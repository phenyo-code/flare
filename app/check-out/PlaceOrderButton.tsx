import { useState } from "react";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";

function CheckoutButton({ status }: { status: string | null }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 3000); // Reset after animation
  };

  return (
    <button
      type="submit"
      className={`w-full text-white p-2 rounded-md mt-4 flex justify-center items-center gap-2
        ${clicked ? "bg-blue-500 scale-90" : "bg-blue-500 hover:bg-blue-600"}
        transition-all duration-300`}
      disabled={status === "pending"}
      onClick={handleClick}
    >
      {clicked ? (
        <>
          <FaCheckCircle className="animate-bounce" />
          Placing Order....
        </>
      ) : status === "pending" ? (
        "Processing..."
      ) : (
        <>
          Place Order
        </>
      )}
    </button>
  );
}

export default CheckoutButton;
