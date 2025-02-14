"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<string | null>(null);

  const handleTestEmail = async () => {
    try {
      // Call the server action to test email sending
      const response = await fetch("/test", {
        method: "POST",
      });

      if (response.ok) {
        setStatus("Test email sent successfully.");
      } else {
        setStatus("Failed to send test email.");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      setStatus("Error sending test email.");
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Test Email Sending</h1>
      <button onClick={handleTestEmail} className="test-email-button">
        Send Test Email
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}
