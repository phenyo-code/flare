"use server";

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email";
import { subscribeToNewsletter } from "./newsletterAction";

export async function signUp(formData: FormData) {
  console.log("signUp: Starting with formData:", Object.fromEntries(formData));

  // Collect form data
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const subscribeToNewsletterOptIn = formData.get("subscribeToNewsletter") === "on";
  const acceptTerms = formData.get("acceptTerms") === "on";

  // Validate form data
  if (!name || !email || !password) {
    console.error("signUp: Missing required fields");
    throw new Error("Please fill in all fields.");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    console.error("signUp: Invalid email format");
    throw new Error("Invalid email format.");
  }

  if (!acceptTerms) {
    console.error("signUp: Terms and conditions not accepted");
    throw new Error("You must accept the Terms and Conditions.");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("signUp: Email already in use:", email);
    throw new Error("User with this email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("signUp: Password hashed successfully");

  // Generate a unique verification token
  const verificationToken = uuidv4();
  console.log("signUp: Generated verification token:", verificationToken);

  // Create the new user with the token and unverified status
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "user",
      verificationToken,
      emailVerified: false,
    },
  });
  console.log("signUp: User created:", { id: user.id, email: user.email, name: user.name });

  // Subscribe to newsletter if opted in
  if (subscribeToNewsletterOptIn) {
    console.log("signUp: User opted into newsletter, subscribing...");
    try {
      const newsletterResult = await subscribeToNewsletter(formData);
      if (!newsletterResult.success) {
        console.error("signUp: Newsletter subscription failed:", newsletterResult.error);
        // Log but don’t fail signup— user can still verify email
      } else {
        console.log("signUp: Newsletter subscription successful:", newsletterResult.message);
      }
    } catch (error: any) {
      console.error("signUp: Error during newsletter subscription:", error);
    }
  }

  // Send verification email
  try {
    await sendVerificationEmail(email, verificationToken);
    console.log("signUp: Verification email sent to:", email);
  } catch (error) {
    console.error("signUp: Failed to send verification email:", error);
    throw new Error("Registration succeeded, but email verification failed. Please try again.");
  }

  // Redirect to verification page
  console.log("signUp: Redirecting to verify-email page");
  redirect("/verify-email?email=" + encodeURIComponent(email));
}