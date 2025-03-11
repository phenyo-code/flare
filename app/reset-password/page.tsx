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

function getPasswordStrength(password: string): { strength: string; criteria: PasswordCriteria; score: number } {
  const criteria = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>[\]-]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    const result = await resetPassword(formData);
    setIsSubmitting(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">Set New Password</h2>
        <p className="text-center text-sm text-gray-500">Create a strong password to secure your account</p>

        {/* Messages */}
        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm text-green-600">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* Password Strength Feedback */}
            {isTyping && (
              <div className="space-y-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      strength === "weak" ? "bg-red-500" : strength === "medium" ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: progressWidth }}
                  />
                </div>
                <div className="text-sm text-gray-700">
                  <span>Password Strength: </span>
                  <span
                    className={`font-medium capitalize ${
                      strength === "weak" ? "text-red-500" : strength === "medium" ? "text-yellow-500" : "text-green-500"
                    }`}
                  >
                    {strength}
                  </span>
                </div>
                <ul className="text-xs text-gray-600 grid grid-cols-1 gap-1">
                  <li className="flex items-center gap-2">
                    {criteria.length ? <FaCheck className="text-green-500" size={12} /> : <FaTimes className="text-gray-400" size={12} />}
                    <span className={criteria.length ? "text-green-500" : "text-gray-500"}>12+ characters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {criteria.uppercase ? <FaCheck className="text-green-500" size={12} /> : <FaTimes className="text-gray-400" size={12} />}
                    <span className={criteria.uppercase ? "text-green-500" : "text-gray-500"}>Uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {criteria.lowercase ? <FaCheck className="text-green-500" size={12} /> : <FaTimes className="text-gray-400" size={12} />}
                    <span className={criteria.lowercase ? "text-green-500" : "text-gray-500"}>Lowercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {criteria.number ? <FaCheck className="text-green-500" size={12} /> : <FaTimes className="text-gray-400" size={12} />}
                    <span className={criteria.number ? "text-green-500" : "text-gray-500"}>Number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {criteria.special ? <FaCheck className="text-green-500" size={12} /> : <FaTimes className="text-gray-400" size={12} />}
                    <span className={criteria.special ? "text-green-500" : "text-gray-500"}>Special character</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-600">
          Back to{" "}
          <a href="/login" className="text-red-500 hover:text-red-600 transition-colors duration-200">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}