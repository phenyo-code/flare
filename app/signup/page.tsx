// app/auth/signup/page.tsx

import { prisma } from "../lib/db/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import PasswordStrength from "./PasswordStrength";

export const metadata = {
  title: "Sign Up | FLARE",
};

// This function will be triggered when the form is submitted
export async function SignUp(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Validate inputs
  if (!name || !email || !password) {
    redirect("/signup?error=Please fill in all fields.");
    return;
  }

  // Basic email validation (can be extended with a regex if needed)
  if (!/\S+@\S+\.\S+/.test(email)) {
    redirect("/signup?error=Invalid email format.");
    return;
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    redirect("/signup?error=User with this email already exists.");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "user" },
  });

  // Redirect to login page after successful registration
  redirect("/login?success=true");
}

export default function SignUpPage({ searchParams }: { searchParams: { error?: string; success?: string } }) {
  const errorMessage = searchParams?.error;
  const success = searchParams?.success === "true";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <p className="font-semibold text-center mb-2 text-gray-800">Create Account</p>

      {/* Show success message if redirected with ?success=true */}
      {success && (
        <p className="mb-4 p-2 text-center text-white bg-green-500 rounded-md">
          ✅ Account created successfully! Please log in.
        </p>
      )}

      {/* Show error message if redirected with ?error=... */}
      {errorMessage && (
        <p className="mb-4 p-2 text-center text-white bg-red-500 rounded-md">
          {errorMessage}
        </p>
      )}

      <form action={SignUp}>
        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          required
        />

        {/* Use the PasswordStrength Client Component here */}
        <PasswordStrength />

        <button
          type="submit"
          className="mt-4 w-full bg-green-500 text-white p-2 rounded-md"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">Already have an account?</p>
        <a href="/login" className="text-blue-500">Login here</a>
      </div>

    </div>
    </div>
  );
}
