// app/recently-viewed/page.tsx
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { Suspense } from "react";
import RecentlyViewedClient from "./RecentlyViewedClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db/prisma";

export default async function RecentlyViewedPage() {
  const session = await getServerSession(authOptions);
  let cartId = null;

  // Fetch cartId only if user is authenticated (optional feature)
  if (session?.user) {
    const cart = await prisma.cart.findFirst({ where: { userId: session.user.id } });
    cartId = cart?.id || null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <Link href="/">
          <IoIosArrowBack className="text-3xl cursor-pointer" aria-label="Back to Home" />
        </Link>
        <h2 className="text-xl font-semibold text-center">Recently Viewed</h2>
        <div className="w-20" />
      </div>

      <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
        <RecentlyViewedClient cartId={cartId} />
      </Suspense>
    </div>
  );
}