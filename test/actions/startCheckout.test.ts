import { startCheckout } from "@/actions/startCheckout";
import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Mock the dependencies
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    order: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}));

describe("startCheckout", () => {
  const mockSession = {
    user: { id: "user123", email: "user@example.com" },
  };

  const mockOrder = {
    id: "order123",
    user: { email: "user@example.com" },
    items: [
      {
        product: { price: 500 },
        quantity: 2,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to Stripe Checkout with valid order", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
    const mockCheckoutSession = { url: "https://checkout.stripe.com/" };
    (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue(mockCheckoutSession);

    await startCheckout("order123");

    expect(getServerSession).toHaveBeenCalled();
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: "order123" },
      include: { user: true, items: { include: { product: true } } },
    });
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: "zar",
              unit_amount: 120000, // 500 * 2 + 100 for delivery
            }),
          }),
        ]),
      })
    );
    expect(redirect).toHaveBeenCalledWith(mockCheckoutSession.url);
  });

  it("should throw an error if user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    await expect(startCheckout("order123")).rejects.toThrow("You must be logged in.");
  });

  it("should throw an error if order is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(startCheckout("order123")).rejects.toThrow("Order not found.");
  });
});
