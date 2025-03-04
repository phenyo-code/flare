"use client";

import React, { useTransition } from "react";
import { signUp } from "@/actions/signupAction"; // Adjust path if needed
import PasswordStrength from "./PasswordStrength";

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition(); // Add useTransition hook
  const [error, setError] = React.useState<string | null>(null); // Optional: Show errors from the action

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await signUp(formData); // Call the server action
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

        {/* The form to collect user data */}
        <form action={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
            disabled={isPending} // Disable input while pending
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
            disabled={isPending} // Disable input while pending
          />

          {/* Password strength indicator */}
          <PasswordStrength />

          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white p-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isPending} // Disable button while pending
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