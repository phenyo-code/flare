"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-center">Loading...</p>;
  }

  if (!session) {
    router.push("/signin"); // Redirect to sign-in if not authenticated
    return null;
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
        {/* <p className="mt-2 text-sm text-gray-500"><strong>Role:</strong> {session.user?.role}</p> */}

        <button
          onClick={() => signOut()}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
    </div>
  );
}
