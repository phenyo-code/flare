// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { FaUser, FaBox, FaHeart, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import BottomNavWrapper from "@/components/BottomNavWrapper";
import CouponSection from "@/components/CouponSection";
import ReviewableProducts from "@/components/ReviewableProducts";
import { Product as PrismaProduct } from "@prisma/client";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  maxUses: number;
}

async function getUserCoupons(userId: string): Promise<Coupon[]> {
  const coupons = await prisma.coupon.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
      uses: { lt: prisma.coupon.fields.maxUses },
    },
    orderBy: { createdAt: "desc" },
  });

  return coupons.map(coupon => ({
    ...coupon,
    expiresAt: coupon.expiresAt.toISOString(),
  }));
}

async function getPurchasedProducts(userId: string): Promise<PrismaProduct[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  const products = orders.flatMap(order => order.items.map(item => item.product));
  // Deduplicate products by id
  const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());
  return uniqueProducts;
}

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    redirect("/login");
  }

  const coupons = await getUserCoupons(user.id);
  const purchasedProducts = await getPurchasedProducts(user.id);

  return (
    <div className="container mt-6 max-w-3xl">
      <h1 className="text-xl font-semibold mx-4 text-red-500 mb-6">{user.name}</h1>
      <span className="w-full block bg-gray-100 h-2"></span>

      <section className="profile-section bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaUser className="mr-2 text-red-500" size={20} /> Personal Information
        </h2>
        <Link href="/profile/edit" className="text-red-500 hover:text-red-700 text-sm font-medium">
          Edit Profile
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      <section className="profile-section bg-white  rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaBox className="mr-2 text-red-500" size={20} /> Order History
        </h2>
        <Link href="/orders" className="text-red-500 hover:text-red-700 text-sm font-medium">
          View Orders
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      <ReviewableProducts products={purchasedProducts} />
      <span className="w-full block bg-gray-100 h-2"></span>

      <CouponSection coupons={coupons} />
      <span className="w-full block bg-gray-100 h-2"></span>

      <section className="profile-section bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaHeart className="mr-2 text-red-500" size={20} /> Wishlist
        </h2>
        <Link href="/wishlist" className="text-red-500 hover:text-red-700 text-sm font-medium">
          View Wishlist
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      <section className="profile-section bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaEnvelope className="mr-2 text-red-500" size={20} /> Newsletter Preferences
        </h2>
        <Link href="/newsletter" className="text-red-500 hover:text-red-700 text-sm font-medium">
          Manage Subscriptions
        </Link>
      </section>
      <span className="w-full block bg-gray-100 h-2"></span>

      <div className="p-6 text-center">
        <Link
          href="/signout"
          className="w-full inline-block bg-red-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </Link>
      </div>

      <BottomNavWrapper cartItems={[]} />
    </div>
  );
}