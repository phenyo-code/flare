// app/settings/page.tsx
import { getServerSession } from "next-auth";
import { FaTrash, FaEnvelope, FaBell, FaSun } from "react-icons/fa";
import Link from "next/link";
import BottomNavWrapper from "@/components/BottomNavWrapper";

export default async function SettingsPage() {
  const session = await getServerSession();

  return (
    <div className="container mt-6 max-w-3xl">
      {/* Settings Header */}
      <h1 className="text-3xl font-bold mx-4 text-red-500 mb-6">Settings</h1>
      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Privacy Settings */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaEnvelope className="mr-2 text-red-500" size={20} /> Privacy Settings
        </h2>
        <p className="text-sm text-gray-600 mb-4">Manage your email visibility.</p>
        <Link href="/settings/privacy" className="text-red-500 hover:text-red-700 text-sm font-medium">
          Edit Privacy
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Notification Preferences */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaBell className="mr-2 text-red-500" size={20} /> Notifications
        </h2>
        <p className="text-sm text-gray-600 mb-4">Configure email and app notifications.</p>
        <Link href="/settings/notifications" className="text-red-500 hover:text-red-700 text-sm font-medium">
          Manage Notifications
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Theme Selection */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaSun className="mr-2 text-red-500" size={20} /> Theme
        </h2>
        <p className="text-sm text-gray-600 mb-4">Choose your preferred app theme.</p>
        <Link href="/settings/theme" className="text-red-500 hover:text-red-700 text-sm font-medium">
          Select Theme
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Account Deletion */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaTrash className="mr-2 text-red-500" size={20} /> Delete Account
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {session?.user
            ? "Permanently remove your account."
            : "Log in to delete your account."}
        </p>
        <Link href="/settings/delete-account" className="text-red-500 hover:text-red-700 text-sm font-medium">
          Delete Account
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      {/* Conditional Login/Logout */}
      <div className="p-6 text-center">
        {session?.user ? (
          <Link
            href="/signout"
            className="w-full inline-block bg-red-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-red-600 transition-colors"
          >
            Logout
          </Link>
        ) : (
          <Link
            href="/login"
            className="w-full inline-block bg-gray-800 text-white font-semibold py-3 px-6 rounded-full hover:bg-red-600 transition-colors"
          >
            Login
          </Link>
        )}
      </div>

      <BottomNavWrapper cartItems={[]} />
    </div>
  );
}