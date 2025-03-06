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
        // If signUp succeeds, it redirects to /verify-email, so no further action is needed here
      } catch (err: any) {
        setError(err.message || "Something went wrong during signup.");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <p className="font-semibold text-center mb-2 text-gray-800">Create Account</p>

        {error && <p className="text-center text-red-500">{error}</p>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <input
              name="name"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <input
              name="email"
              placeholder="Email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="h-4 w-4 text-red-500 border-gray-300 rounded"
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
              className="h-4 w-4 text-red-500 border-gray-300 rounded"
              required
              disabled={isPending}
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700">
              I accept the{" "}
              <a href="/terms" className="text-blue-500 hover:underline">
                Terms and Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">Already have an account?</p>
          <a href="/login" className="text-blue-500">Login here</a>
        </div>
      </div>
    </div>
  );
}