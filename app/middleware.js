import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth.token);

    // Check if the user is trying to access an admin page and if they have the admin role
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }   
  },
  { 
    callbacks: {
      authorized: ({ token }) => !!token,  // Only authorize if there's a valid token
    },
  }
);

export const config = { matcher: ['/admin/'] };  // Corrected the typo here
