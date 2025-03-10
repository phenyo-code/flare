import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import OrderConfirmationForm from "./OrderConfirmationForm";

export default async function OrderPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/signin");

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { product: true, size: true } } },
  });

  if (!cart || cart.items.length === 0) redirect("/cart");

  const validCart = {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      quantity: Number.isInteger(item.quantity) && item.quantity >= 0 ? item.quantity : 0,
    })),
  };

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id, status: "order submitted" },
    orderBy: { createdAt: "desc" },
  });

  // Create a temporary order here
  const totalPrice = validCart.items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      shippingName: "Pending",
      shippingEmail: "pending@example.com",
      shippingAddress: "Pending",
      shippingPhoneNumber: "0000000000",
      status: "pending",
      totalPrice,
      items: {
        create: validCart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
          sizeId: item.sizeId,
        })),
      },
    },
  });

  return (
    <OrderConfirmationForm
      cart={validCart}
      latestOrder={latestOrder}
      userId={session.user.id}
      orderId={order.id}
    />
  );
}