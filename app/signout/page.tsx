// app/signout/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    // Sign the user out and redirect to the login page
    const logout = async () => {
      await signOut({ redirect: false });  // Sign out without redirecting automatically
      router.push('/');  // Redirect to the login page manually after sign out
    };

    logout();
  }, [router]);  // Use the router to redirect after logout

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Logging Out...</h1>
      </div>
    </div>
  );
}
