"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Get the callbackUrl from the query parameter
  const callbackUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("callbackUrl") : "/";

  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      router.push(callbackUrl || "/"); // Redirect to profile or callbackUrl after login
    }
  }, [session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl || "/"); // Redirect to the page they were on before login
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signIn("google", { redirect: false });

    setLoading(false);

    if (result?.error) {
      setError("Google login failed.");
    } else {
      router.push(callbackUrl || "/"); // Redirect to the page they were on before login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 transition"
            disabled={loading}
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.69 0 6.74 1.46 8.78 3.85l6.46-6.46C34.3 3.3 29.48 1.5 24 1.5 14.85 1.5 7.13 7.28 3.68 15.03l7.65 5.91C12.54 14.08 17.74 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M24 46.5c5.09 0 9.47-1.64 12.61-4.48l-7.17-5.83c-1.46.99-3.32 1.58-5.44 1.58-4.19 0-7.75-2.83-9.03-6.63l-7.76 5.99C10.43 41.46 16.84 46.5 24 46.5z"
              />
              <path
                fill="#4A90E2"
                d="M44.5 24c0-1.48-.16-2.91-.46-4.29H24v8.38h11.48c-.6 3.16-2.47 5.83-5.2 7.66l7.18 5.83C42.4 37.07 44.5 30.97 44.5 24z"
              />
              <path
                fill="#FBBC05"
                d="M3.68 15.03C2.63 17.2 2 19.54 2 22c0 2.48.62 4.82 1.68 6.96l7.76-5.99C11.11 21.33 11 20.68 11 20c0-.68.11-1.33.32-1.97L3.68 15.03z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
        <p className="font-semibold text-center mb-2 text-gray-800">Your Account</p>

        {error && <p className="text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
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
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>
        

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          
          <p className="text-sm">Don't have an account? <a href="/signup" className="text-blue-500">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
}
