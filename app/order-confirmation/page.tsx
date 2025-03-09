import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import OrderConfirmationForm from "./OrderConfirmationForm";

export default async function OrderConfirmationPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { product: true, size: true } } },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      shippingName: true,
      shippingEmail: true,
      shippingAddress: true,
      shippingPhoneNumber: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <OrderConfirmationForm cart={cart} latestOrder={latestOrder} userId={session.user.id} />
    </div>
  );
}