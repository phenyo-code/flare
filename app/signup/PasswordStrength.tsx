// app/auth/signup/PasswordStrength.tsx (Client Component)

"use client";

import React, { useState } from "react";

// Helper function to check password strength
function getPasswordStrength(password: string) {
  const lengthCriteria = password.length >= 8;
  const numberCriteria = /\d/.test(password);
  const uppercaseCriteria = /[A-Z]/.test(password);
  const lowercaseCriteria = /[a-z]/.test(password);
  const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = "weak";
  if (lengthCriteria && (numberCriteria || uppercaseCriteria) && lowercaseCriteria) {
    strength = "medium";
  }
  if (
    lengthCriteria &&
    numberCriteria &&
    uppercaseCriteria &&
    lowercaseCriteria &&
    specialCharacterCriteria
  ) {
    strength = "strong";
  }

  return strength;
}

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("weak");
  const [isTyping, setIsTyping] = useState(false); // To track if the user is typing

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPassword(password);
    setIsTyping(password.length > 0); // Show the strength meter only if there's input
    setStrength(getPasswordStrength(password));
  };

  return (
    <div>
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
        value={password}
        onChange={handlePasswordChange}
        required
      />

      {/* Show the password strength bar only if the user starts typing */}
      {isTyping && (
        <div>
          <div className="w-full h-1 mt-[-3] rounded-md bg-gray-200">
            <div
              className={`h-full ${strength === "weak" ? "bg-red-500" : strength === "medium" ? "bg-orange-500" : "bg-green-500"}`}
              style={{
                width: strength === "weak" ? "10%" : strength === "medium" ? "40%" : "95%",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
