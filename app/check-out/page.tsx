// Import necessary libraries 
import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";
import SearchHeader from "../components/SearchHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

// Server action function to place an order
export async function PlaceOrder(formData: FormData) {
  "use server";

  // Fetch user session to get logged-in user's details
  const session = await getServerSession(authOptions);

  // If user is not authenticated, throw an error
  if (!session || !session.user) {
    throw new Error("You must be logged in to place an order.");
  }

  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();

  // Check if required fields are provided
  if (!shippingName || !shippingEmail || !shippingAddress) {
    throw new Error("Please fill in all fields.");
  }

  // Fetch cart items for the logged-in user
  const cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id, // Ensure to fetch cart for logged-in user
    },
    include: {
      items: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty. Please add items before placing an order.");
  }

  // Create a new order with the userId from the session
  const order = await prisma.order.create({
    data: {
      userId: session.user.id, // Use the authenticated user's ID
      shippingName,
      shippingEmail,
      shippingAddress,
      status: "pending", // Default status
      totalPrice: 0, // Placeholder for total price, will update later
    },
  });

  // Create order items from the cart items
  const orderItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { price: true },
      });

      if (!product) {
        throw new Error(`Product not found for item: ${item.productId}`);
      }

      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price || 0, // Default to 0 if price is not found
      };
    })
  );

  // Insert the order items into the database
  await prisma.orderItem.createMany({
    data: orderItems,
  });

  // Calculate the total price (sum of item prices * quantity)
  const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Update the order with the total price
  await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  });

  // Clear the cart for the user
  await prisma.cart.update({
    where: { id: cart.id },
    data: { items: { deleteMany: {} } },
  });

  // Redirect to the success page after placing the order
  redirect("/order-success?status=pending");
}

export default function CheckoutPage({ searchParams }: { searchParams: { success?: string, status?: string } }) {
  const success = searchParams?.success === "true";
  const status = searchParams?.status;

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

        <form action={PlaceOrder}>
          <div className="mb-4">
            <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="shippingEmail" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
              Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
            disabled={status === "pending"} // Disable button while processing
          >
            {status === "pending" ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
