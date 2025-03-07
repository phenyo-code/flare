import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Careers | FLARE",
  description: "Join the FLARE team! Explore career opportunities with us.",
};

export default function CareersPage() {
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Careers</h1>
        <p className="text-gray-700 mb-4">
          We’re always looking for passionate individuals to join FLARE. Check back for job openings!
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FLARE",
              url: "https://yourdomain.com",
              description: "FLARE is a fashion brand offering career opportunities.",
              jobPosting: {
                "@type": "JobPosting",
                title: "Future Opportunities",
                description: "Stay tuned for job openings at FLARE.",
              },
            }),
          }}
        />
      </main>
    </div>
  );
}