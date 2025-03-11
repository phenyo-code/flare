"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResendVerificationSentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => router.push("/login"), 3000); // Redirect after 3s
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {status === "success"
            ? "Verification Email Sent"
            : status === "already_verified"
            ? "Email Already Verified"
            : "Something Went Wrong"}
        </h2>
        <p className="text-center text-sm text-gray-500">
          {status === "success"
            ? "Check your inbox for the verification email."
            : status === "already_verified"
            ? "Your email is already verified. You can sign in."
            : "There was an issue resending the verification email."}
        </p>

        {/* Status Message */}
        <div
          className={`p-3 rounded-lg text-center text-sm ${
            status === "success"
              ? "bg-green-50 border border-green-200 text-green-600"
              : status === "already_verified"
              ? "bg-yellow-50 border border-yellow-200 text-yellow-600"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {status === "success" && "Redirecting to login in a moment..."}
          {status === "already_verified" && "Please sign in to continue."}
          {status === "error" && "Please try again later or contact support."}
        </div>

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-600">
          <a href="/login" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}