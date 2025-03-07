import { NextResponse } from "next/server";

// Define the robots.txt content as a string
export async function GET() {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /profile
Disallow: /check-out

Sitemap: https://flare-shop.vercel.app/sitemap.xml`; // Link to your sitemap

  // Return the robots.txt as plain text
  return new NextResponse(robotsContent, {
    headers: {
      "Content-Type": "text/plain", // Set the content type to text/plain
    },
  });
}
