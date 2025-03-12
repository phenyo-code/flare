// /api/payfast/notify.ts
import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const paymentStatus = data.get("payment_status");
  const orderId = data.get("m_payment_id") as string;

  if (paymentStatus === "COMPLETE") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "completed" },
    });
  }
  return NextResponse.json({ received: true });
}