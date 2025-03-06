// app/settings/delete-account/page.tsx
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import BottomNavWrapper from "@/components/BottomNavWrapper";

export default async function DeleteAccountPage() {
  const session = await getServerSession();

  if (!session?.user) {
    return (
      <div className="container mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold mx-4 text-red-500 mb-6">Delete Account</h1>
        <span className="w-full block bg-gray-100 h-2"></span>
        <section className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-gray-600 text-sm mb-4">Please log in to delete your account.</p>
          <Link
            href="/login"
            className="w-full inline-block bg-red-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-red-600 transition-colors text-center"
          >
            Login
          </Link>
        </section>
        <BottomNavWrapper cartItems={[]} />
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mt-6 max-w-3xl">
      <h1 className="text-3xl font-bold mx-4 text-red-500 mb-6">Delete Account</h1>
      <span className="w-full block bg-gray-100 h-2"></span>
      <section className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaTrash className="mr-2 text-red-500" size={20} /> Confirm Account Deletion
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data, including orders, coupons, and preferences, will be removed.
        </p>
        <form action="/api/delete-account" method="POST" className="space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-red-600 transition-colors"
          >
            Delete My Account
          </button>
          <Link
            href="/settings"
            className="w-full inline-block text-center text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Cancel
          </Link>
        </form>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>
      <BottomNavWrapper cartItems={[]} />
    </div>
  );
}