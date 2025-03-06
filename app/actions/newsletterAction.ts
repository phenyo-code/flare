// actions/newsletter.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { sendNewsletterWelcomeEmail, sendNewsletterUnsubscribeEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { generateCouponForNewsletter } from "./couponUtils";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string | null; // Optional name from form

  console.log("subscribeToNewsletter: Starting with email:", email, "name:", name);

  if (!email || !email.includes("@")) {
    console.error("subscribeToNewsletter: Invalid email provided");
    return { success: false, error: "Please enter a valid email." };
  }

  try {
    // Check for existing subscriber
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (existingSubscriber) {
      console.log("subscribeToNewsletter: Email already subscribed:", email);
      return { success: false, error: "You’re already subscribed!" };
    }

    // Get session to link userId if authenticated
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    console.log("subscribeToNewsletter: Session userId:", userId);

    // If authenticated, fetch user’s name if not provided in form
    let subscriberName = name;
    if (userId && !subscriberName) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      subscriberName = user?.name || null;
      console.log("subscribeToNewsletter: Fetched name from User:", subscriberName);
    }

    // Create subscriber in newsletter_subscribers
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name: subscriberName,
        userId, // Link to User if authenticated
      },
    });
    console.log("subscribeToNewsletter: Created subscriber:", subscriber);

    // Generate welcome coupon
    const coupon = await generateCouponForNewsletter(userId, email);
    console.log("subscribeToNewsletter: Generated welcome coupon:", coupon);

    // Send welcome email with coupon
    await sendNewsletterWelcomeEmail(email, subscriberName, coupon.code, coupon.discountValue, coupon.expiresAt);
    console.log("subscribeToNewsletter: Welcome email sent to:", email);

    return { 
      success: true, 
      message: `Thanks for subscribing! Check your email for a ${coupon.discountValue}% off coupon.`,
      coupon 
    };
  } catch (error: any) {
    console.error("subscribeToNewsletter: Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  console.log("unsubscribeFromNewsletter: Starting with email:", email);

  if (!email || !email.includes("@")) {
    console.error("unsubscribeFromNewsletter: Invalid email provided");
    return { success: false, error: "Invalid email provided." };
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (!subscriber) {
      console.log("unsubscribeFromNewsletter: Email not subscribed:", email);
      return { success: false, error: "You’re not subscribed." };
    }

    await prisma.newsletterSubscriber.delete({
      where: { email },
    });
    console.log("unsubscribeFromNewsletter: Deleted subscriber:", email);

    await sendNewsletterUnsubscribeEmail(email);
    console.log("unsubscribeFromNewsletter: Unsubscribe email sent to:", email);

    return { success: true, message: "You’ve been unsubscribed successfully." };
  } catch (error: any) {
    console.error("unsubscribeFromNewsletter: Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}