// lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Your existing functions (sendResetEmail, etc.) remain here


export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`; // Changed from /verify to /api/verify
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <div style="padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 4px; color: transparent; background: linear-gradient(to bottom right, #000000, #ff0000); -webkit-background-clip: text; background-clip: text;">
          FLARE
        </h1>
      </div>
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Verify Your Email</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Welcome to FLARE! Please verify your email by clicking the button below. This link expires in 24 hours.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #777; font-size: 14px; line-height: 1.5;">
          If you didn’t sign up, please ignore this email.
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;
  const info = await transporter.sendMail({
    from: `"FLARE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your FLARE Account",
    html: htmlContent,
    text: `Verify your email here: ${verificationLink}. This link expires in 24 hours.`,
  });
  console.log("Verification email sent:", info.response);
  return info;
}
// Keep your other email functions (sendResetEmail, etc.) below
export async function sendResetEmail(email: string, resetLink: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <div style="padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 4px; color: transparent; background: linear-gradient(to bottom right, #000000, #ff0000); -webkit-background-clip: text; background-clip: text;">
          FLARE
        </h1>
      </div>
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Hello! We received a request to reset your password. Click the button below to proceed. This link expires in 1 hour.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #777; font-size: 14px; line-height: 1.5;">
          If you didn’t request this, please ignore this email.
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;
  const info = await transporter.sendMail({
    from: `"FLARE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: htmlContent,
    text: `Reset your password here: ${resetLink}. This link expires in 1 hour.`,
  });
  console.log("Reset email sent:", info.response);
  return info;
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <div style="padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 4px; color: transparent; background: linear-gradient(to bottom right, #000000, #ff0000); -webkit-background-clip: text; background-clip: text;">
          FLARE
        </h1>
      </div>
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Welcome to Our Newsletter!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Thanks for subscribing! You’ll get the latest news, offers, and updates from FLARE. We’re excited to have you on board!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.NEXTAUTH_URL}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Visit FLARE
          </a>
        </div>
        <p style="color: #777; font-size: 14px; line-height: 1.5;">
          Want to unsubscribe? Click <a href="${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #ff4444;">here</a>.
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;
  const info = await transporter.sendMail({
    from: `"FLARE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "FLARE’s Newsletter!",
    html: htmlContent,
    text: `Thanks for subscribing! Visit us at ${process.env.NEXTAUTH_URL}. Unsubscribe: ${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(email)}.`,
  });
  console.log("Newsletter welcome email sent:", info.response);
  return info;
}

export async function sendNewsletterUnsubscribeEmail(email: string) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <div style="padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 4px; color: transparent; background: linear-gradient(to bottom right, #000000, #ff0000); -webkit-background-clip: text; background-clip: text;">
            FLARE
          </h1>
        </div>
        <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; font-size: 20px; margin-top: 0;">You’ve Unsubscribed</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            We’re sorry to see you go! You’ve been successfully unsubscribed from FLARE’s newsletter. If this was a mistake, you can resubscribe anytime via our website.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXTAUTH_URL}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
              Visit FLARE
            </a>
          </div>
        </div>
        <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
          <p>© 2025 FLARE. All rights reserved.</p>
        </div>
      </div>
    `;
    const info = await transporter.sendMail({
      from: `"FLARE" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Unsubscribed from FLARE’s Newsletter",
      html: htmlContent,
      text: `You’ve unsubscribed from FLARE’s newsletter. Visit us at ${process.env.NEXTAUTH_URL} to resubscribe if desired.`,
    });
    console.log("Newsletter unsubscribe email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Nodemailer failed to send unsubscribe email:", error);
    throw error;
  }
}