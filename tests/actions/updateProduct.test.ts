import { updateProduct } from "@/actions/updateProduct";
import { prisma } from "@/lib/db/prisma";

// Mock Prisma
jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    product: {
      update: jest.fn(),
    },
    size: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

describe("updateProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update product and sizes successfully", async () => {
    const formData = new FormData();
    formData.append("id", "product123");
    formData.append("name", "Updated Product");
    formData.append("price", "1000");
    formData.append("originalPrice", "1200");
    formData.append("category", "Clothing");
    formData.append("filter", "T-shirt");
    formData.append("style", "Casual");
    formData.append("type", "Men");
    formData.append("matchesWith", "Jeans,Hoodie"); // Comma-separated string
    formData.append("image1", "https://example.com/image1.jpg");
    formData.append("image2", "https://example.com/image2.jpg");
    formData.append("sizes", "M:5:50:Regular"); // Size format: "Size:Sold:Quantity:Measurement"
    formData.append("sizes", "L:3:30:Loose");

    await updateProduct(formData);

    // Expect product update
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: "product123" },
      data: {
        name: "Updated Product",
        price: 1000,
        Originalprice: 1200,
        category: "Clothing",
        filter: "T-shirt",
        images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        style: "Casual",
        type: "Men",
        matchesWith: ["Jeans", "Hoodie"], // Ensuring array is processed correctly
      },
    });

    // Expect existing sizes to be deleted
    expect(prisma.size.deleteMany).toHaveBeenCalledWith({ where: { productId: "product123" } });

    // Expect sizes to be created correctly
    expect(prisma.size.createMany).toHaveBeenCalledWith({
      data: [
        { size: "M", sold: 5, quantity: 50, measurement: "Regular", productId: "product123" },
        { size: "L", sold: 3, quantity: 30, measurement: "Loose", productId: "product123" },
      ],
    });
  });

  it("should return if required fields are missing", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const formData = new FormData();
    formData.append("id", "product123");
    formData.append("name", "Updated Product");
    // Missing price, category, filter, images, and sizes

    await updateProduct(formData);

    expect(prisma.product.update).not.toHaveBeenCalled();
    expect(prisma.size.deleteMany).not.toHaveBeenCalled();
    expect(prisma.size.createMany).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Please fill in all fields.");

    consoleErrorSpy.mockRestore();
  });
});
