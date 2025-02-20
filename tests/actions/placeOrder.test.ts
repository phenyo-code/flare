import { PlaceOrder } from "@/actions/PlaceOrder";
import { prisma } from "@/lib/db/prisma";
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
    cart: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      update: jest.fn(),
    },
    orderItem: {
      createMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    size: {
      update: jest.fn(),
    },
  },
}));

describe("PlaceOrder", () => {
  const mockSession = {
    user: { id: "user123", email: "user@example.com" },
  };

  const mockCart = {
    id: "cart123",
    userId: "user123",
    items: [
      {
        productId: "product123",
        quantity: 2,
        sizeId: "size123",
      },
    ],
  };

  const mockProduct = {
    price: 500,
  };

  const formData = new FormData();
  formData.append("shippingName", "John Doe");
  formData.append("shippingEmail", "john@example.com");
  formData.append("shippingAddress", "123 Main St");
  formData.append("shippingPhoneNumber", "1234567890");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should place an order successfully", async () => {
    // Mocks
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(mockCart);
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    // Mock the order creation and item insertion
    const mockOrder = { id: "order123" };
    (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);
    (prisma.orderItem.createMany as jest.Mock).mockResolvedValue({});
    (prisma.size.update as jest.Mock).mockResolvedValue({});
    (prisma.order.update as jest.Mock).mockResolvedValue({});
    (prisma.cart.update as jest.Mock).mockResolvedValue({});

    await PlaceOrder(formData);

    expect(getServerSession).toHaveBeenCalled();
    expect(prisma.cart.findFirst).toHaveBeenCalledWith({
      where: { userId: "user123" },
      include: { items: { include: { size: true } } },
    });
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user123",
          shippingName: "John Doe",
          shippingEmail: "john@example.com",
          shippingAddress: "123 Main St",
          shippingPhoneNumber: "1234567890",
          totalPrice: expect.any(Number),
        }),
      })
    );
    expect(prisma.orderItem.createMany).toHaveBeenCalled();
    expect(prisma.size.update).toHaveBeenCalled();
    expect(prisma.cart.update).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/order-success?status=pending");
  });

  it("should throw an error if the user is not logged in", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    await expect(PlaceOrder(formData)).rejects.toThrow("You must be logged in to place an order.");
  });

  it("should throw an error if required fields are missing", async () => {
    const invalidFormData = new FormData();
    invalidFormData.append("shippingName", "John Doe");
    invalidFormData.append("shippingEmail", "john@example.com");
    invalidFormData.append("shippingAddress", ""); // Missing address
    invalidFormData.append("shippingPhoneNumber", "1234567890");

    await expect(PlaceOrder(invalidFormData)).rejects.toThrow("Please fill in all fields.");
  });

  it("should throw an error if the cart is empty", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: "cart123", items: [] });

    await expect(PlaceOrder(formData)).rejects.toThrow("Your cart is empty. Please add items before placing an order.");
  });

  it("should throw an error if a product is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(mockCart);
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null); // Product not found

    await expect(PlaceOrder(formData)).rejects.toThrow("Product not found for item: product123");
  });
});
