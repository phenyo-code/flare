"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null | JSX.Element>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const callbackUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("callbackUrl") : "/";

  useEffect(() => {
    if (session) {
      router.push(callbackUrl || "/");
    }
  }, [session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (result?.error) {
      if (result.error === "Please verify your email before signing in") {
        setError(
          <span>
            Please verify your email before signing in.{" "}
            <a href={`/resend-verification?email=${encodeURIComponent(email)}`} className="text-red-500 underline hover:text-red-600">
              Resend verification email
            </a>
          </span>
        );
      } else {
        setError("Invalid email or password.");
      }
    } else {
      router.push(callbackUrl || "/");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signIn("google", { redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Google login failed.");
    } else {
      router.push(callbackUrl || "/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In to FLARE</h2>
        <p className="text-center text-sm text-gray-500">Access your account or continue with Google</p>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.69 0 6.74 1.46 8.78 3.85l6.46-6.46C34.3 3.3 29.48 1.5 24 1.5 14.85 1.5 7.13 7.28 3.68 15.03l7.65 5.91C12.54 14.08 17.74 9.5 24 9.5z" />
            <path fill="#34A853" d="M24 46.5c5.09 0 9.47-1.64 12.61-4.48l-7.17-5.83c-1.46.99-3.32 1.58-5.44 1.58-4.19 0-7.75-2.83-9.03-6.63l-7.76 5.99C10.43 41.46 16.84 46.5 24 46.5z" />
            <path fill="#4A90E2" d="M44.5 24c0-1.48-.16-2.91-.46-4.29H24v8.38h11.48c-.6 3.16-2.47 5.83-5.2 7.66l7.18 5.83C42.4 37.07 44.5 30.97 44.5 24z" />
            <path fill="#FBBC05" d="M3.68 15.03C2.63 17.2 2 19.54 2 22c0 2.48.62 4.82 1.68 6.96l7.76-5.99C11.11 21.33 11 20.68 11 20c0-.68.11-1.33.32-1.97L3.68 15.03z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <span className="absolute px-4 bg-white text-sm text-gray-500">or</span>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
            />
          </div>
          <div className="text-center">
            <a href="/forgot-password" className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign-Up Link */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
}