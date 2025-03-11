"use client";

import React, { useTransition } from "react";
import { signUp } from "@/actions/signupAction";
import PasswordStrength from "./PasswordStrength";

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await signUp(formData);
        // Redirects to /verify-email on success
      } catch (err: any) {
        setError(err.message || "Something went wrong during signup.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Your FLARE Account</h2>
        <p className="text-center text-sm text-gray-500">Join us and start shopping</p>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Sign-Up Form */}
        <form action={handleSubmit} className="space-y-5">
          <div>
            <input
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <input
              name="email"
              placeholder="Email"
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
              disabled={isPending}
            />
          </div>

          <PasswordStrength />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="subscribeToNewsletter"
              id="subscribeToNewsletter"
              className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50"
              disabled={isPending}
            />
            <label htmlFor="subscribeToNewsletter" className="text-sm text-gray-700">
              Subscribe to newsletter
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50"
              required
              disabled={isPending}
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700">
              I accept the{" "}
              <a href="/terms" className="text-red-500 hover:text-red-600 transition-colors duration-200">
                Terms and Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
}