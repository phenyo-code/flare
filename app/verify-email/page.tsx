"use client"; // Make it a client component for state and effects

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [timeLeft, setTimeLeft] = useState(30); // Start with 30 seconds
  const [isChecking, setIsChecking] = useState(true);

  // Redirect to signup if no email is provided
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

    return () => clearInterval(timer); // Cleanup on unmount
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

    checkVerification(); // Check immediately
    const interval = setInterval(checkVerification, 5000); // Then every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [email, router, isChecking]);

  // Reset timer when it hits 0
  const handleResend = async () => {
    try {
      await fetch(`/api/resend-verification?email=${encodeURIComponent(email || "")}`);
      setTimeLeft(30); // Reset timer
    } catch (error) {
      console.error("Error resending verification:", error);
    }
  };

  if (!email) return null; // Render nothing while redirecting

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
        <p className="text-gray-600">
          We’ve sent a verification email to{" "}
          <strong className="text-gray-800">{email}</strong>. Please check your inbox (and spam/junk folder) and click the link to verify your account.
        </p>
        <p className="text-gray-500">
          Once verified, you’ll be automatically redirected to the login page.
        </p>
        <div className="mt-4">
          {timeLeft > 0 ? (
            <p className="text-gray-500">
              Resend available in <span className="font-semibold text-gray-700">{timeLeft}</span> seconds
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Resend Verification Email
            </button>
          )}
        </div>
        {isChecking && (
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}