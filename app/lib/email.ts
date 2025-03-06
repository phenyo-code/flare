// lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseOptions = {
  from: `"FLARE" <${process.env.EMAIL_USER}>`,
  replyTo: "no-reply@flare-shop.vercel.app",
};

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`;
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
          If you didn’t sign up for FLARE, please ignore this email. For support, contact us at <a href="mailto:support@flare-shop.vercel.app" style="color: #ff4444;">support@flare-shop.vercel.app</a>.
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>FLARE, 123 Example St, City, Country</p>
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      ...baseOptions,
      to: email,
      subject: "Verify Your FLARE Account",
      html: htmlContent,
      text: `Verify your email here: ${verificationLink}. This link expires in 24 hours. If you didn’t sign up, ignore this email or contact support@flare-shop.vercel.app.`,
      headers: {
        "X-Entity-Type": "transactional",
        "Precedence": "bulk",
      },
    });
    console.log("Verification email sent:", info.messageId, info.response);
    return info;
  } catch (error: any) {
    console.error("Failed to send verification email:", error.response || error);
    throw new Error("Unable to send verification email. Please try again later.");
  }
}

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
          Hello! We received a request to reset your FLARE password. Click the button below to proceed. This link expires in 1 hour.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #777; font-size: 14px; line-height: 1.5;">
          If you didn’t request this, please ignore this email. For support, contact us at <a href="mailto:support@flare-shop.vercel.app" style="color: #ff4444;">support@flare-shop.vercel.app</a>.
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>FLARE, 123 Example St, City, Country</p>
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      ...baseOptions,
      to: email,
      subject: "Password Reset Request - FLARE",
      html: htmlContent,
      text: `Reset your password here: ${resetLink}. This link expires in 1 hour. If you didn’t request this, ignore this email or contact support@flare-shop.vercel.app.`,
      headers: {
        "X-Entity-Type": "transactional",
        "Precedence": "bulk",
      },
    });
    console.log("Reset email sent:", info.messageId, info.response);
    return info;
  } catch (error: any) {
    console.error("Failed to send reset email:", error.response || error);
    throw new Error("Unable to send password reset email. Please try again later.");
  }
}

export async function sendNewsletterWelcomeEmail(
  email: string,
  name: string | null,
  couponCode: string,
  discountValue: number,
  expiresAt: string | Date
) {
  const unsubscribeLink = `${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  const expiresDate = new Date(expiresAt).toLocaleDateString();
  const greetingName = name || "Subscriber";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <div style="padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 4px; color: transparent; background: linear-gradient(to bottom right, #000000, #ff0000); -webkit-background-clip: text; background-clip: text;">
          FLARE
        </h1>
      </div>
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Hi ${greetingName}, Welcome to Our Newsletter!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Thanks for subscribing! As a welcome gift, here’s a special coupon just for you. Enjoy ${discountValue}% off your next purchase!
        </p>
        <div style="text-align: center; margin: 20px 0; background-color: #ffe6e6; padding: 15px; border-radius: 5px;">
          <p style="color: #ff4444; font-size: 18px; font-weight: bold; margin: 0;">${couponCode}</p>
          <p style="color: #555; font-size: 14px; margin: 5px 0 0;">Expires: ${expiresDate}</p>
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          You’ll receive more exclusive coupons and updates via email. Shop now and save!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.NEXTAUTH_URL}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Shop Now
          </a>
        </div>
        <p style="color: #777; font-size: 14px; line-height: 1.5;">
          Don’t want these emails? <a href="${unsubscribeLink}" style="color: #ff4444;">Unsubscribe here</a>.
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>FLARE, 123 Example St, City, Country</p>
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    console.log(`Preparing to send welcome email to ${email} with code ${couponCode}`);
    const info = await transporter.sendMail({
      ...baseOptions,
      to: email,
      subject: "Welcome to FLARE’s Newsletter – Your Coupon Awaits!",
      html: htmlContent,
      text: `Hi ${greetingName},\nThanks for subscribing! Use code ${couponCode} for ${discountValue}% off your next purchase. Expires: ${expiresDate}. Shop now: ${process.env.NEXTAUTH_URL}. Unsubscribe: ${unsubscribeLink}.`,
      headers: {
        "List-Unsubscribe": `<${unsubscribeLink}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Entity-Type": "promotional",
        "Precedence": "bulk",
      },
    });
    console.log("Newsletter welcome email sent:", info.messageId, info.response);
    return info;
  } catch (error: any) {
    console.error("Failed to send newsletter welcome email:", error.response || error);
    throw new Error("Unable to send newsletter welcome email. Please try again later.");
  }
}

export async function sendAdminGeneratedCouponEmail(
  email: string,
  name: string | null,
  couponCode: string,
  discountValue: number,
  discountType: "percentage" | "fixed",
  expiresAt: string | Date
) {
  const unsubscribeLink = `${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  const expiresDate = new Date(expiresAt).toLocaleDateString();
  const greetingName = name || "Valued Subscriber";
  const discountText = discountType === "percentage" ? `${discountValue}% off` : `R${discountValue} off`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <div style="padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 4px; color: transparent; background: linear-gradient(to bottom right, #000000, #ff0000); -webkit-background-clip: text; background-clip: text;">
          FLARE
        </h1>
      </div>
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Hi ${greetingName}, A Special Offer Just For You!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Great news! We’ve created an exclusive coupon for our newsletter subscribers. Enjoy ${discountText} your next order!
        </p>
        <div style="text-align: center; margin: 20px 0; background-color: #ffe6e6; padding: 15px; border-radius: 5px;">
          <p style="color: #ff4444; font-size: 18px; font-weight: bold; margin: 0;">${couponCode}</p>
          <p style="color: #555; font-size: 14px; margin: 5px 0 0;">Expires: ${expiresDate}</p>
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Don’t miss out—shop now and use your coupon at checkout. Stay tuned for more exclusive offers!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.NEXTAUTH_URL}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Shop Now
          </a>
        </div>
        <p style="color: #777; font-size: 14px; line-height: 1.5;">
          Don’t want these emails? <a href="${unsubscribeLink}" style="color: #ff4444;">Unsubscribe here</a>.
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>FLARE, 123 Example St, City, Country</p>
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    console.log(`Preparing to send admin-generated coupon email to ${email} with code ${couponCode}`);
    const info = await transporter.sendMail({
      ...baseOptions,
      to: email,
      subject: "New Exclusive Coupon from FLARE!",
      html: htmlContent,
      text: `Hi ${greetingName},\nWe’ve created an exclusive coupon for you! Use code ${couponCode} for ${discountText} your next order. Expires: ${expiresDate}. Shop now: ${process.env.NEXTAUTH_URL}. Unsubscribe: ${unsubscribeLink}.`,
      headers: {
        "List-Unsubscribe": `<${unsubscribeLink}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Entity-Type": "promotional",
        "Precedence": "bulk",
      },
    });
    console.log("Admin-generated coupon email sent:", info.messageId, info.response);
    return info;
  } catch (error: any) {
    console.error("Failed to send admin-generated coupon email:", error.response || error);
    throw new Error("Unable to send admin-generated coupon email. Please try again later.");
  }
}

export async function sendNewsletterUnsubscribeEmail(email: string) {
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
          We’re sorry to see you go! You’ve been successfully unsubscribed from FLARE’s newsletter. If this was a mistake, you can resubscribe anytime.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.NEXTAUTH_URL}" style="background-color: #ff4444; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Resubscribe
          </a>
        </div>
      </div>
      <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
        <p>FLARE, 123 Example St, City, Country</p>
        <p>© 2025 FLARE. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      ...baseOptions,
      to: email,
      subject: "Unsubscribed from FLARE’s Newsletter",
      html: htmlContent,
      text: `You’ve unsubscribed from FLARE’s newsletter. Resubscribe anytime at ${process.env.NEXTAUTH_URL}.`,
      headers: {
        "X-Entity-Type": "transactional",
        "Precedence": "bulk",
      },
    });
    console.log("Newsletter unsubscribe email sent:", info.messageId, info.response);
    return info;
  } catch (error: any) {
    console.error("Failed to send unsubscribe email:", error.response || error);
    throw new Error("Unable to send unsubscribe confirmation email. Please try again later.");
  }
}