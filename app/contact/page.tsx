import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact Us | FLARE",
  description: "Get in touch with FLARE’s support team.",
};

export default function ContactPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          Reach out to us at support@yourdomain.com or call us at (123) 456-7890.
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Contact Us",
              url: "https://yourdomain.com/contact",
              description: "Contact FLARE’s support team.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@yourdomain.com",
                telephone: "+11234567890",
              },
            }),
          }}
        />
      </main>
    </div>
  );
}