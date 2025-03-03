"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribeFromNewsletter } from "../actions/newsletterAction";

export default function UnsubscribePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (email) {
      handleUnsubscribe(email);
    } else {
      setError("No email provided. Please use the link from your newsletter email.");
    }
  }, [email]);

  const handleUnsubscribe = async (emailToUnsubscribe: string) => {
    const result = await unsubscribeFromNewsletter(emailToUnsubscribe);
    if (result.success) {
      setMessage(result.message || "You’ve been unsubscribed successfully.");
    } else {
      setError(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">Unsubscribe</h1>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!message && !error && <p className="text-gray-600">Processing your request...</p>}
      </div>
    </div>
  );
}