// actions/updateCart.ts
import { prisma } from "@/lib/db/prisma";

export async function updateCartItemQuantity(
  cartId: string, 
  productId: string, 
  sizeId: string, 
  newQuantity: number
) {
  const existingItem = await prisma.orderItem.findFirst({
    where: {
      orderId: cartId,
      productId: productId,
      sizeId: sizeId,
    },
  });

  if (existingItem) {
    // Update quantity of existing item
    return await prisma.orderItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    // If item doesn't exist, create a new order item
    return await prisma.orderItem.create({
      data: {
        orderId: cartId,
        productId: productId,
        sizeId: sizeId,
        quantity: newQuantity,
        price: (await prisma.product.findUnique({ where: { id: productId } })).price,
      },
    });
  }
}
