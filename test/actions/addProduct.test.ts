import { prisma } from "@/lib/db/prisma";
import { AddProduct } from "@/actions/addProduct";
import { redirect } from "next/navigation";

// Mock the redirect function to prevent it from breaking tests
jest.mock("next/navigation", () => ({
  redirect: jest.fn(), 
}));



jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    product: {
      create: jest.fn(),
    },
    size: {
      createMany: jest.fn(),
    },
  },
}));

describe("AddProduct Action", () => {
  it("should create a product with valid data", async () => {
    const formData = new FormData();
    formData.append("name", "Test Product");
    formData.append("price", "100");
    formData.append("originalPrice", "120");
    formData.append("category", "MEN");
    formData.append("filter", "T-shirt");
    formData.append("style", "Casual");
    formData.append("type", "Topwear");
    formData.append("matchesWith", "Jeans,Sneakers");
    formData.append("image1", "image_url_1");
    formData.append("image2", "image_url_2");
    formData.append("sizes", "M:5:20:Medium");
    formData.append("sizes", "L:3:15:Large");

    const mockProduct = { id: "123", name: "Test Product" };
    (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

    await AddProduct(formData);

    expect(prisma.product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Test Product",
          price: 100,
          Originalprice: 120,
          category: "MEN",
          filter: "T-shirt",
          style: "Casual",
          type: "Topwear",
          matchesWith: ["Jeans", "Sneakers"],
          images: ["image_url_1", "image_url_2"],
        }),
      })
    );

    expect(prisma.size.createMany).toHaveBeenCalledWith({
      data: [
        { size: "M", measurement: "Medium", sold: 5, quantity: 20, productId: "123" },
        { size: "L", measurement: "Large", sold: 3, quantity: 15, productId: "123" },
      ],
    });
  });

  it("should throw an error if required fields are missing", async () => {
    const formData = new FormData();
    formData.append("name", "Test Product"); // Missing price, category, filter, and images

    await expect(AddProduct(formData)).rejects.toThrow("Please fill in all required fields.");
  });
});
