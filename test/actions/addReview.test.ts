import { AddReview } from "@/actions/AddReview"; // Adjust the import path as needed
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
    review: {
      create: jest.fn(),
    },
  },
}));

describe("AddReview", () => {
  const mockSession = {
    user: { id: "user123" }, // Mock user session
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to ensure clean slate
  });

  it("should create a review with valid data", async () => {
    const formData = new FormData();
    formData.append("rating", "5");
    formData.append("comment", "Great product!");
    formData.append("fitFeedback", "TRUE_TO_SIZE");

    // Mock the session to return a valid user
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockProductId = "product123";

    // Mock the prisma call to resolve with the created review
    const mockReview = { id: "review123", productId: mockProductId };
    (prisma.review.create as jest.Mock).mockResolvedValue(mockReview);

    await AddReview(formData, mockProductId);

    expect(getServerSession).toHaveBeenCalledWith(expect.anything());
    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        productId: mockProductId,
        userId: "user123",
        rating: 5,
        comment: "Great product!",
        fitFeedback: "TRUE_TO_SIZE",
      },
    });

    expect(redirect).toHaveBeenCalledWith(`/product/${mockProductId}?reviewSubmitted=true`);
  });

  it("should throw an error if the user is not authenticated", async () => {
    const formData = new FormData();
    formData.append("rating", "5");
    formData.append("comment", "Great product!");
    formData.append("fitFeedback", "TRUE_TO_SIZE");

    // Mock the session to return null (no user)
    (getServerSession as jest.Mock).mockResolvedValue({ user: null });

    const mockProductId = "product123";

    await expect(AddReview(formData, mockProductId)).rejects.toThrow("User not authenticated");
  });

  it("should throw an error if required fields are missing", async () => {
    const formData = new FormData();
    formData.append("rating", "5");
    formData.append("comment", "Great product!");
    // Missing fitFeedback field

    const mockProductId = "product123";

    // Mock the session to return a valid user
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    await expect(AddReview(formData, mockProductId)).rejects.toThrow("Please provide a rating, comment, and fit feedback.");
  });

  it("should throw an error if fitFeedback is invalid", async () => {
    const formData = new FormData();
    formData.append("rating", "5");
    formData.append("comment", "Great product!");
    formData.append("fitFeedback", "INVALID_FEEDBACK"); // Invalid fitFeedback
  
    const mockProductId = "product123";
  
    // Mock the session to return a valid user
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  
    await expect(AddReview(formData, mockProductId)).rejects.toThrow(
      "Please provide a rating, comment, and fit feedback."
    );
  });
  
});
