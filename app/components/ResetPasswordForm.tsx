// components/ResetPasswordForm.tsx

"use client";

import { useState } from "react";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the server action to reset the password
    await fetch("/auth/password-reset", {
      method: "POST",
      body: new FormData(e.target as HTMLFormElement),
    });

    alert("Password reset successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        name="newPassword"
        placeholder="Enter your new password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}
