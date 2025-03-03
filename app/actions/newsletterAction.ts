"use server";

import { prisma } from "@/lib/db/prisma";
import { sendNewsletterWelcomeEmail, sendNewsletterUnsubscribeEmail } from "@/lib/email";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email." };
  }

  try {
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (existingSubscriber) {
      return { success: false, error: "You’re already subscribed!" };
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    await sendNewsletterWelcomeEmail(email);
    return { success: true, message: "Thanks for subscribing!" };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email provided." };
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (!subscriber) {
      return { success: false, error: "You’re not subscribed." };
    }

    await prisma.newsletterSubscriber.delete({
      where: { email },
    });

    await sendNewsletterUnsubscribeEmail(email); // Now uses the imported function
    return { success: true, message: "You’ve been unsubscribed successfully." };
  } catch (error: any) {
    console.error("Newsletter unsubscribe error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}