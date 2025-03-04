"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/resetPassword";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import debounce from "lodash/debounce";

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

// Password strength checker
function getPasswordStrength(password: string): { strength: string; criteria: PasswordCriteria; score: number } {
  const criteria = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>[\]-]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length; // 0-5
  let strength = "weak";
  if (score >= 3) strength = "medium";
  if (score === 5) strength = "strong";

  return { strength, criteria, score };
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [strength, setStrength] = useState("weak");
  const [criteria, setCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [score, setScore] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Debounced strength update
  const updateStrength = debounce((pwd: string) => {
    const { strength, criteria, score } = getPasswordStrength(pwd);
    setStrength(strength);
    setCriteria(criteria);
    setScore(score);
    setIsTyping(pwd.length > 0);
  }, 300);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
    updateStrength(password);
    return () => updateStrength.cancel();
  }, [token, password, updateStrength]);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    const result = await resetPassword(formData);
    if (result.success) {
      setMessage("Password reset successfully. You can now log in.");
      setError(null);
    } else {
      setError(result.error || "An error occurred.");
      setMessage(null);
    }
  };

  const progressWidth = `${(score / 5) * 100}%`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <p className="font-semibold text-center mb-2 text-gray-800">Set New Password</p>
        {message && <p className="text-green-500 text-center font-bold">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Password strength feedback */}
          {isTyping && (
            <div className="space-y-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    strength === "weak" ? "bg-red-500" : strength === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: progressWidth }}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Password Strength:{" "}
                <span
                  className={`capitalize ${
                    strength === "weak" ? "text-red-500" : strength === "medium" ? "text-yellow-500" : "text-green-500"
                  }`}
                >
                  {strength}
                </span>
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-1">
                  {criteria.length ? <FaCheck className="text-green-500" /> : <FaTimes className="text-gray-500" />}
                  <span className={criteria.length ? "text-green-500" : "text-gray-500"}>At least 12 characters</span>
                </li>
                <li className="flex items-center gap-1">
                  {criteria.uppercase ? <FaCheck className="text-green-500" /> : <FaTimes className="text-gray-500" />}
                  <span className={criteria.uppercase ? "text-green-500" : "text-gray-500"}>One uppercase letter</span>
                </li>
                <li className="flex items-center gap-1">
                  {criteria.lowercase ? <FaCheck className="text-green-500" /> : <FaTimes className="text-gray-500" />}
                  <span className={criteria.lowercase ? "text-green-500" : "text-gray-500"}>One lowercase letter</span>
                </li>
                <li className="flex items-center gap-1">
                  {criteria.number ? <FaCheck className="text-green-500" /> : <FaTimes className="text-gray-500" />}
                  <span className={criteria.number ? "text-green-500" : "text-gray-500"}>One number</span>
                </li>
                <li className="flex items-center gap-1">
                  {criteria.special ? <FaCheck className="text-green-500" /> : <FaTimes className="text-gray-500" />}
                  <span className={criteria.special ? "text-green-500" : "text-gray-500"}>One special character</span>
                </li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Reset Password
          </button>
        </form>
        <p className="text-center text-sm">
          Back to <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}