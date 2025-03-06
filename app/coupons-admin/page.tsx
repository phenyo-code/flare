// app/coupons-admin/page.tsx
"use server";

import { prisma } from "@/lib/db/prisma";
import { generateGeneralCouponForNewsletterSubscribers } from "@/actions/couponUtils";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

export default async function CouponsAdminPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  noStore();
  console.log("CouponsAdminPage: Starting execution");

  const params = await searchParams;
  console.log("CouponsAdminPage: searchParams resolved:", params);
  const success = params.success === "true";
  console.log("CouponsAdminPage: Success flag:", success);

  async function handleGenerateCoupon(formData: FormData) {
    "use server";
    console.log("handleGenerateCoupon: Form submitted with data:", Object.fromEntries(formData));
    const discountValue = parseInt(formData.get("discountValue") as string) || 10;
    const discountType = (formData.get("discountType") as string) === "fixed" ? "fixed" : "percentage";
    const monthsValid = parseInt(formData.get("monthsValid") as string) || 1;
    console.log("handleGenerateCoupon: Parsed values - discountValue:", discountValue, "discountType:", discountType, "monthsValid:", monthsValid);

    await generateGeneralCouponForNewsletterSubscribers(discountValue, discountType, monthsValid);
    console.log("handleGenerateCoupon: Coupon generation completed, redirecting");
    redirect("/coupons-admin?success=true");
  }

  console.log("CouponsAdminPage: Fetching recent general coupons");
  const generalCoupons = await prisma.coupon.findMany({
    where: {
      code: { startsWith: "FLARE-NEWS-GEN-" },
      userId: null,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log("CouponsAdminPage: Fetched general coupons:", generalCoupons);

  const metadata = {
    title: "Manage Coupons | Admin Panel",
  };
  console.log("CouponsAdminPage: Metadata set:", metadata);

  console.log("CouponsAdminPage: Rendering JSX");
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Coupons</h2>

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
            General coupon generated and distributed successfully!
          </div>
        )}

        <form action={handleGenerateCoupon} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate General Coupon</h3>
          <p className="text-gray-600 mb-4">
            Customize a coupon for newsletter subscribers. Each subscriber will receive a unique code via email.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="discountValue" className="block text-gray-700 font-medium mb-1">
                Discount Value
              </label>
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                defaultValue={10}
                min={1}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="discountType" className="block text-gray-700 font-medium mb-1">
                Discount Type
              </label>
              <select
                id="discountType"
                name="discountType"
                defaultValue="percentage"
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (R)</option>
              </select>
            </div>
            <div>
              <label htmlFor="monthsValid" className="block text-gray-700 font-medium mb-1">
                Valid For (Months)
              </label>
              <input
                type="number"
                id="monthsValid"
                name="monthsValid"
                defaultValue={1}
                min={1}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
          >
            Generate and Distribute
          </button>
        </form>

        {generalCoupons.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent General Coupons</h3>
            <ul className="space-y-2">
              {generalCoupons.map((coupon) => (
                <li key={coupon.id} className="text-gray-600">
                  {coupon.code} - {coupon.discountValue}
                  {coupon.discountType === "percentage" ? "%" : "R"} off, Expires: {coupon.expiresAt.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}