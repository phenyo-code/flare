// app/auth/signup/signupAction.ts

"use server";

import { prisma } from "../lib/db/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Server action to handle sign-up process
export async function signUp(formData: FormData) {
  // Collect form data
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Validate form data
  if (!name || !email || !password) {
    throw new Error("Please fill in all fields.");
  }

  // Basic email validation (can be extended with a regex if needed)
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Invalid email format.");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "user" },
  });

  // Redirect to login page after successful registration
  redirect("/login?success=true");
}
