import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | FLARE",
  description: "FLARE’s privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          Your privacy is important to us at FLARE...
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Privacy Policy",
              url: "https://yourdomain.com/privacy",
              description: "FLARE’s privacy policy.",
            }),
          }}
        />
      </main>
    </div>
  );
}