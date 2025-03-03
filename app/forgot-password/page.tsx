"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/actions/resetPasswordAction";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    const result = await requestPasswordReset(formData);
    if (result.success) {
      setMessage("A password reset link has been sent to your email.");
    } else {
      setError(result.error || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <p className="font-semibold text-center mb-2 text-gray-800">Reset Password</p>
        {message && <p className="text-green-500 text-center font-bold">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-sm">
          Back to <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}