import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Returns | FLARE",
  description: "FLARE’s return policy.",
};

export default function ReturnsPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Returns</h1>
        <p className="text-gray-700 mb-4">
          Returns are accepted within 30 days of purchase...
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Returns",
              url: "https://yourdomain.com/returns",
              description: "FLARE’s return policy.",
            }),
          }}
        />
      </main>
    </div>
  );
}