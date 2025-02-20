import { signUp } from "@/actions/signupAction";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Mock dependencies
jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("signUp", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should successfully sign up a user with valid data", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "johndoe@example.com");
    formData.append("password", "password123");

    const mockHashedPassword = "hashedpassword123";
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // No existing user

    await signUp(formData);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: mockHashedPassword,
        role: "user",
      },
    });
    expect(redirect).toHaveBeenCalledWith("/login?success=true");
  });

  it("should throw an error if fields are missing", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", ""); // Missing email

    await expect(signUp(formData)).rejects.toThrow("Please fill in all fields.");
  });

  it("should throw an error if email format is invalid", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "invalidemail");
    formData.append("password", "password123");

    await expect(signUp(formData)).rejects.toThrow("Invalid email format.");
  });

  it("should throw an error if user with the same email already exists", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "johndoe@example.com");
    formData.append("password", "password123");

    // Mock an existing user
    const existingUser = { id: "user123", name: "John Doe", email: "johndoe@example.com" };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    await expect(signUp(formData)).rejects.toThrow("User with this email already exists.");
  });
});
