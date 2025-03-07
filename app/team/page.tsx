import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Team | FLARE",
  description: "Meet the team behind FLARE.",
};

export default function TeamPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Our Team</h1>
        <p className="text-gray-700 mb-4">
          Our team is a group of creative minds driving FLARE’s vision forward.
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FLARE",
              url: "https://yourdomain.com",
              description: "Meet the team behind FLARE’s fashion innovation.",
            }),
          }}
        />
      </main>
    </div>
  );
}