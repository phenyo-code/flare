import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "FAQs | FLARE",
  description: "Frequently asked questions about FLARE.",
};

export default function FAQPage() {
  const faqs = [
    { question: "What is FLARE?", answer: "FLARE is a fashion brand focused on style." },
    { question: "How do I return an item?", answer: "Visit our Returns page for details." },
  ];

  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">FAQs</h1>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold">{faq.question}</h2>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      </main>
    </div>
  );
}