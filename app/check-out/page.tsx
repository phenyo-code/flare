import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import CheckoutContent from "./CheckoutContent";

export default async function CheckoutPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/signin");

  const success = searchParams?.success === "true";
  const orderId = searchParams?.orderId;

  if (!success || !orderId) redirect("/cart");

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id, status: "order submitted" },
    orderBy: { createdAt: "desc" },
  });

  const shippingAddress = latestOrder
    ? {
        shippingName: latestOrder.shippingName,
        shippingEmail: latestOrder.shippingEmail,
        shippingAddress: latestOrder.shippingAddress,
        shippingPhoneNumber: latestOrder.shippingPhoneNumber,
      }
    : null;

  return (
    <CheckoutContent
      shippingAddress={shippingAddress}
      success={success}
      orderId={orderId}
    />
  );
}