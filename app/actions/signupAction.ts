"use server";

import { prisma } from "@/lib/db/prisma"; // Adjust path if needed
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // Install uuid: npm install uuid
import { sendVerificationEmail } from "@/lib/email"; // Import from your email lib

export async function signUp(formData: FormData) {
  // Collect form data
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Validate form data
  if (!name || !email || !password) {
    throw new Error("Please fill in all fields.");
  }

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

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique verification token
  const verificationToken = uuidv4();

  // Create the new user with the token and unverified status
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "user",
      verificationToken, // Store the token
      emailVerified: false, // Default to false
    },
  });

  // Send verification email
  try {
    await sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Registration succeeded, but email verification failed. Please try again.");
  }

  // Redirect to a page informing the user to verify their email
  redirect("/verify-email?email=" + encodeURIComponent(email));
}