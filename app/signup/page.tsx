// app/auth/signup/page.tsx

"use client";

import React from "react";
import { signUp } from "@/actions/signupAction";
import PasswordStrength from "./PasswordStrength"; // Assuming this is your existing PasswordStrength component



export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <p className="font-semibold text-center mb-2 text-gray-800">Create Account</p>

        {/* The form to collect user data */}
        <form action={signUp}>
          <input
            name="name"
            placeholder="Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          {/* Password strength indicator */}
          <PasswordStrength />

          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white p-2 rounded-md"
          >
            Sign Up
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