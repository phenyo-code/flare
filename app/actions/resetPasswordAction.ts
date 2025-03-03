"use server";

import { prisma } from "@/lib/db/prisma";
import { randomBytes } from "crypto";
import { sendResetEmail } from "@/lib/email";


export async function requestPasswordReset(formData: FormData) {
    const email = formData.get("email") as string;
  
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "No account found with this email." };
    }
  
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);
  
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expires },
    });
  
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    try {
      await sendResetEmail(email, resetLink);
      return { success: true };
    } catch (error: any) {
      console.error("Reset action error:", error.message || error);
      return { success: false, error: `Failed to send email: ${error.message || "Unknown error"}` };
    }
  }
  
  