// components/RequestPasswordReset.tsx

"use client";

import { useState } from "react";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the server action to request the reset
    await fetch("/auth/password-reset-request", {
      method: "POST",
      body: new FormData(e.target as HTMLFormElement),
    });

    alert("Password reset email sent!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Rest</button>
    </form>
  );
}
