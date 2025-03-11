"use client";

import { useRouter } from "next/navigation";

const Unauthorized = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-xl text-center">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">Unauthorized Access</h1>
        <p className="text-sm text-gray-500">
          It looks like you don’t have permission to view this page.
        </p>

        {/* Details */}
        <div className="space-y-4">
          <p className="text-gray-600">
            This could happen if your account lacks the necessary privileges or if you’re not signed in with the correct credentials. If you believe this is an error, here’s what you can do:
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium text-gray-700">Check Your Login:</span> Ensure you’re signed in with the right account.{" "}
              <a href="/login" className="text-red-500 hover:text-red-600 transition-colors duration-200">
                Sign in here
              </a>.
            </li>
            <li>
              <span className="font-medium text-gray-700">Contact Support:</span> Reach out to our team at{" "}
              <a href="mailto:support@flare.com" className="text-red-500 hover:text-red-600 transition-colors duration-200">
                support@flare.com
              </a>{" "}
              with your account details and the page you’re trying to access.
            </li>
            <li>
              <span className="font-medium text-gray-700">Permissions:</span> If you’re part of a team, ask your administrator to review your access level.
            </li>
          </ul>
        </div>

        {/* Call-to-Action */}
        <button
          onClick={handleBackToHome}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200"
        >
          Return to Home
        </button>

        {/* Additional Help */}
        <p className="text-xs text-gray-500">
          Need immediate assistance? Visit our{" "}
          <a href="/help" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Help Center
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;