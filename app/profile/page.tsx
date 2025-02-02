import { prisma } from "../lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import Header from "../components/Header";
import { redirect } from "next/navigation";

export default async function Profile() {
  // Fetch session data to verify if user is logged in
  const session = await getServerSession(authOptions);

  // If no session or user is logged in, redirect to login page
  if (!session || !session.user) {
    redirect("/login");
    return null; // Prevent rendering
  }

  // Fetch user profile data from the database if user is authenticated
  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!userProfile) {
    return <p className="text-center">User profile not found.</p>;
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mt-4 border-2 border-gray-300"
            />
          )}

          <p className="mt-4 text-lg text-gray-700"><strong>Name:</strong> {session.user?.name}</p>
          <p className="text-gray-600"><strong>Email:</strong> {session.user?.email}</p>
        </div>
      </div>
    </div>
  );
}
