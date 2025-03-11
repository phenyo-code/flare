"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [timeLeft, setTimeLeft] = useState(30);
  const [isChecking, setIsChecking] = useState(true);

  // Redirect to signup if no email
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Check verification status every 5 seconds
  useEffect(() => {
    if (!email || !isChecking) return;

    const checkVerification = async () => {
      try {
        const response = await fetch(`/api/check-verification?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.verified) {
          setIsChecking(false);
          router.push("/login?verified=true");
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      }
    };

    checkVerification();
    const interval = setInterval(checkVerification, 5000);

    return () => clearInterval(interval);
  }, [email, router, isChecking]);

  // Resend verification email
  const handleResend = async () => {
    try {
      await fetch(`/api/resend-verification?email=${encodeURIComponent(email || "")}`);
      setTimeLeft(30);
    } catch (error) {
      console.error("Error resending verification:", error);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-800">Verify Your Email</h1>
        <p className="text-center text-sm text-gray-500">
          We’ve sent a verification email to{" "}
          <span className="font-medium text-gray-700">{email}</span>. Check your inbox (and spam/junk folder) to verify your account.
        </p>
        <p className="text-center text-sm text-gray-500">
          Once verified, you’ll be redirected to sign in automatically.
        </p>

        {/* Resend Timer/Button */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-600">
              Resend available in{" "}
              <span className="font-semibold text-red-500">{timeLeft}</span> seconds
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200"
            >
              Resend Verification Email
            </button>
          )}
        </div>

        {/* Spinner */}
        {isChecking && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-t-red-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Back to Signup */}
        <div className="text-center text-sm text-gray-600">
          Not your email?{" "}
          <a href="/signup" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Sign up again
          </a>
        </div>
      </div>
    </div>
  );
}