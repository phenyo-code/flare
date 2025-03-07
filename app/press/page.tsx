import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Press | FLARE",
  description: "FLARE in the news and media.",
};

export default function PressPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Press</h1>
        <p className="text-gray-700 mb-4">
          Check out the latest press releases and media coverage about FLARE.
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FLARE",
              url: "https://yourdomain.com",
              description: "FLARE’s latest press releases and media coverage.",
            }),
          }}
        />
      </main>
    </div>
  );
}