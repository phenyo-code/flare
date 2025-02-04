// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import Link from "next/link";  // Import Link from next

// Fetch the user data from the database
export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user) {
    // If no user is found, redirect to login page
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Profile</h1>

      {/* Personal Information Section */}
      <section className="profile-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaUser className="mr-3" /> Personal Information
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              id="name"
              value={user.name}
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled // Make this disabled for now until we implement editing logic
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={user.email}
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled
            />
          </div>
        </div>
      </section>

      {/* Change Password Section */}
      <section className="profile-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaLock className="mr-3" /> Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm text-gray-600">Current Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm text-gray-600">New Password</label>
            <input
              type="password"
              id="new-password"
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm text-gray-600">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </section>

      {/* Address Book Link */}
      <section className="profile-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaCamera className="mr-3" /> Address Book
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Manage your shipping addresses.
        </p>
        <Link
          href="/addresses" // Link to the address book page
          className="text-red-500 hover:text-red-700"
        >
          Go to Address Book
        </Link>
      </section>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button
          // OnClick logic to handle save profile update
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition mb-6"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
