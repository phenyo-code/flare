"use server";

import { prisma } from "@/lib/db/prisma";
import { sendAdminGeneratedCouponEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid"; // Add uuid for unique codes

export async function generateCouponForReview(userId: string, productId: string) {
  console.log("generateCouponForReview: Starting for userId:", userId, "productId:", productId);
  const code = `FLARE-REV${userId.slice(-6)}-${productId.slice(-6)}`;
  const discountType = "percentage";
  const discountValue = 5;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    console.log(`generateCouponForReview: Coupon ${code} already exists for user ${userId} and product ${productId}`);
    return existing;
  }

  const coupon = await prisma.coupon.create({
    data: {
      userId,
      code,
      discountType,
      discountValue,
      maxUses: 1,
      expiresAt,
    },
  });

  console.log(`generateCouponForReview: Generated coupon ${code} for user ${userId} due to review on product ${productId}`);
  return coupon;
}

export async function generateCouponForOrder(userId: string) {
  console.log("generateCouponForOrder: Starting for userId:", userId);
  const code = `FLARE-USER${userId.slice(-6)}-ORD10`;
  const discountType = "percentage";
  const discountValue = 10;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    console.log(`generateCouponForOrder: Coupon ${code} already exists for user ${userId}`);
    return existing;
  }

  const coupon = await prisma.coupon.create({
    data: {
      userId,
      code,
      discountType,
      discountValue,
      maxUses: 1,
      expiresAt,
    },
  });

  console.log(`generateCouponForOrder: Generated coupon ${code} for user ${userId} due to order completion`);
  return coupon;
}

export async function generateCouponForNewsletter(userId: string | null, email: string) {
  console.log("generateCouponForNewsletter: Starting for userId:", userId, "email:", email);
  const identifier = userId ? userId.slice(-6) : email.split("@")[0].slice(-6);
  const code = `FLARE-${identifier}-NEWS5`;
  const discountType = "percentage";
  const discountValue = 5;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    console.log(`generateCouponForNewsletter: Coupon ${code} already exists for ${userId || email}`);
    return existing;
  }

  const coupon = await prisma.coupon.create({
    data: {
      userId,
      code,
      discountType,
      discountValue,
      maxUses: 1,
      expiresAt,
    },
  });

  console.log(`generateCouponForNewsletter: Generated coupon ${code} for ${userId || email} due to newsletter subscription`);
  return coupon;
}

export async function generateGeneralCouponForNewsletterSubscribers(
  discountValue: number = 10,
  discountType: "percentage" | "fixed" = "percentage",
  monthsValid: number = 1
) {
  console.log("generateGeneralCouponForNewsletterSubscribers: Function invoked with discountValue:", discountValue, "discountType:", discountType, "monthsValid:", monthsValid);

  // Test database connection
  console.log("generateGeneralCouponForNewsletterSubscribers: Testing Prisma connection");
  const testCount = await prisma.newsletterSubscriber.count();
  console.log("generateGeneralCouponForNewsletterSubscribers: Total subscribers in DB:", testCount);

  console.log("generateGeneralCouponForNewsletterSubscribers: Starting coupon generation");
  const uniqueSuffix = uuidv4().slice(0, 8); // Use first 8 chars of UUID for uniqueness
  const code = `FLARE-NEWS-GEN-${Date.now().toString().slice(-6)}-${uniqueSuffix}`;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + monthsValid);
  console.log("generateGeneralCouponForNewsletterSubscribers: Generated base code:", code, "expiresAt:", expiresAt);

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    console.log(`generateGeneralCouponForNewsletterSubscribers: General coupon ${code} already exists`);
    return existing;
  }

  let generalCoupon;
  try {
    generalCoupon = await prisma.coupon.create({
      data: {
        userId: null,
        code,
        discountType,
        discountValue,
        maxUses: 9999,
        expiresAt,
      },
    });
    console.log("generateGeneralCouponForNewsletterSubscribers: Created general coupon:", generalCoupon);
  } catch (error: any) {
    console.error("generateGeneralCouponForNewsletterSubscribers: Failed to create general coupon due to unique constraint:", error);
    throw error; // Rethrow to be caught by the caller
  }

  console.log("generateGeneralCouponForNewsletterSubscribers: Fetching all newsletter subscribers");
  const subscribers = await prisma.newsletterSubscriber.findMany({
    select: { id: true, userId: true, email: true, name: true },
  });
  console.log("generateGeneralCouponForNewsletterSubscribers: Fetched subscribers count:", subscribers.length, "data:", subscribers);

  if (subscribers.length === 0) {
    console.warn("generateGeneralCouponForNewsletterSubscribers: No subscribers found in newsletter_subscribers collection");
  }

  const subscriberCoupons = await Promise.all(
    subscribers.map(async (subscriber) => {
      const identifier = subscriber.userId || subscriber.email;
      const subscriberCode = `${code}-${identifier.slice(-6)}`;
      console.log("generateGeneralCouponForNewsletterSubscribers: Processing subscriber:", subscriber.email, "with code:", subscriberCode);

      const existingSubscriberCoupon = await prisma.coupon.findUnique({ where: { code: subscriberCode } });
      if (existingSubscriberCoupon) {
        console.log(`generateGeneralCouponForNewsletterSubscribers: Coupon ${subscriberCode} already exists for ${subscriber.email}`);
        // Still send email for existing coupon if not expired
        if (existingSubscriberCoupon.expiresAt > new Date()) {
          try {
            console.log("generateGeneralCouponForNewsletterSubscribers: Resending email for existing coupon to:", subscriber.email);
            await sendAdminGeneratedCouponEmail(
              subscriber.email,
              subscriber.name,
              subscriberCode,
              discountValue,
              discountType,
              existingSubscriberCoupon.expiresAt
            );
            console.log("generateGeneralCouponForNewsletterSubscribers: Email resent successfully to:", subscriber.email);
          } catch (emailError) {
            console.error("generateGeneralCouponForNewsletterSubscribers: Failed to resend email to:", subscriber.email, "Error:", emailError);
          }
        }
        return existingSubscriberCoupon;
      }

      try {
        const coupon = await prisma.coupon.create({
          data: {
            userId: subscriber.userId || null,
            code: subscriberCode,
            discountType,
            discountValue,
            maxUses: 1,
            expiresAt,
          },
        });
        console.log("generateGeneralCouponForNewsletterSubscribers: Created subscriber coupon:", coupon);

        try {
          console.log("generateGeneralCouponForNewsletterSubscribers: Sending email to:", subscriber.email);
          await sendAdminGeneratedCouponEmail(
            subscriber.email,
            subscriber.name,
            subscriberCode,
            discountValue,
            discountType,
            expiresAt
          );
          console.log("generateGeneralCouponForNewsletterSubscribers: Email sent successfully to:", subscriber.email);
        } catch (emailError) {
          console.error("generateGeneralCouponForNewsletterSubscribers: Failed to send email to:", subscriber.email, "Error:", emailError);
        }

        return coupon;
      } catch (error: any) {
        console.error("generateGeneralCouponForNewsletterSubscribers: Failed to create subscriber coupon due to unique constraint:", error);
        return null; // Skip this subscriber and continue
      }
    })
  );

  const validSubscriberCoupons = subscriberCoupons.filter(coupon => coupon !== null);
  console.log(`generateGeneralCouponForNewsletterSubscribers: Completed - Generated general coupon ${code} (${discountValue}${discountType === "percentage" ? "%" : "R"} off, valid for ${monthsValid} months) and assigned/sent to ${validSubscriberCoupons.length} newsletter subscribers`);
  console.log("generateGeneralCouponForNewsletterSubscribers: Subscriber coupons:", validSubscriberCoupons);
  return { generalCoupon, subscriberCoupons: validSubscriberCoupons };
}