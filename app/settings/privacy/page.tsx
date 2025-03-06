// app/settings/privacy/page.tsx
import { getServerSession } from "next-auth";
import { FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import BottomNavWrapper from "@/components/BottomNavWrapper";

export default async function PrivacyPage() {
  const session = await getServerSession();

  return (
    <div className="container mt-6 max-w-3xl">
      <h1 className="text-3xl font-bold mx-4 text-red-500 mb-6">Privacy Settings</h1>
      <span className="w-full block bg-gray-100 h-2"></span>
      <section className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaEnvelope className="mr-2 text-red-500" size={20} /> Privacy Options
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          {session?.user
            ? "Control your email visibility and data sharing preferences."
            : "Log in to manage your privacy settings."}
        </p>
        {session?.user ? (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">Privacy settings are under development.</p>
            <Link
              href="/settings"
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Back to Settings
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full inline-block bg-red-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-red-600 transition-colors text-center"
          >
            Login
          </Link>
        )}
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>
      <BottomNavWrapper cartItems={[]} />
    </div>
  );
}