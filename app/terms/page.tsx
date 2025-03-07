import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions | FLARE",
  description: "FLARE’s terms and conditions of use.",
};

export default function TermsPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">
          By using FLARE, you agree to our terms of service...
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Terms & Conditions",
              url: "https://yourdomain.com/terms",
              description: "FLARE’s terms and conditions of use.",
            }),
          }}
        />
      </main>
    </div>
  );
}