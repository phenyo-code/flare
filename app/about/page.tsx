import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us | FLARE",
  description: "Learn more about FLARE, our mission, and values.",
};

export default function AboutPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="text-gray-700 mb-4">
          FLARE is dedicated to bringing you the best in fashion and accessories. Our mission is to empower individuality through style.
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FLARE",
              url: "https://yourdomain.com",
              description: "FLARE is a fashion brand focused on individuality and style.",
              logo: "https://yourdomain.com/logo.png",
            }),
          }}
        />
      </main>
    </div>
  );
}