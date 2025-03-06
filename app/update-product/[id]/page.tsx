import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import EditProductForm from "./EditProductForm"; // Import the client component

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

// Generate metadata dynamically
export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: product ? `Edit ${product.name}` : "Product Not Found",
    description: product ? `Modify details of ${product.name}.` : "This product does not exist.",
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  "use server";

  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/"); // Redirect if not admin
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true },
  });

  if (!product) {
    notFound(); // If product not found
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Product</h2>
        <EditProductForm product={product} />
        <div className="text-center mt-6">
          <Link href="/admin" className="text-red-500 hover:underline font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}