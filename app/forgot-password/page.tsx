"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/actions/resetPasswordAction";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);

    const result = await requestPasswordReset(formData);
    setIsSubmitting(false);

    if (result.success) {
      setMessage("A password reset link has been sent to your email.");
    } else {
      setError(result.error || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Your Password</h2>
        <p className="text-center text-sm text-gray-500">Enter your email to receive a reset link</p>

        {/* Messages */}
        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm text-green-600">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-600">
          Back to{" "}
          <a href="/login" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}