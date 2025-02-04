import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";

// GET API Route to fetch reviews for a specific product
export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    // Fetch reviews for the product
    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: true, // Include user info like name
      },
      orderBy: {
        createdAt: "desc", // Show most recent reviews first
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST API Route to submit a new review
export async function POST(request: Request) {
  const session = await getServerSession(authOptions); // Get session to fetch logged-in user's info
  const { productId, rating, comment } = await request.json();

  if (!session?.user?.id || !productId || !rating || !comment) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    // Create new review in the database
    const newReview = await prisma.review.create({
      data: {
        productId,
        rating: Number(rating), // Convert rating to a number
        comment,
        userId: session.user.id, // Use the logged-in user's ID
      },
    });

    return NextResponse.json({ review: newReview });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
