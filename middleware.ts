// middleware.ts or _middleware.ts (depending on your Next.js version)
import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Log the requested URL and token for debugging
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth.token);

    // Check if the user is trying to access one of the protected pages and if they have the admin role
    if (
      (req.nextUrl.pathname.startsWith('/admin') || 
      req.nextUrl.pathname.startsWith('/products') || 
      req.nextUrl.pathname.startsWith('/orders-admin') || 
      req.nextUrl.pathname.startsWith('/add-product') || 
      req.nextUrl.pathname.startsWith('/update-product')) && 
      req.nextauth.token?.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));  // Redirect to unauthorized if not admin
    }
  },
  { 
    callbacks: {
      authorized: ({ token }) => !!token,  // Only authorize if there's a valid token (authenticated user)
    },
  }
);

export const config = { 
  matcher: ['/admin', '/products', '/orders-admin', '/add-product', '/update-product' ],  // Protect these pages
};




import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.nextUrl);
  if (url.pathname.startsWith("/product/")) {
    const productId = url.pathname.split("/").pop(); // Get product ID from URL
    if (productId) {
      const views = req.cookies.get("productViews")?.value;
      const viewedProducts = views ? JSON.parse(views) : [];

      if (!viewedProducts.includes(productId)) {
        viewedProducts.push(productId);
      }

      const res = NextResponse.next();
      res.cookies.set("productViews", JSON.stringify(viewedProducts), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // Store for 7 days
      });

      return res;
    }
  }

  return NextResponse.next();
}
