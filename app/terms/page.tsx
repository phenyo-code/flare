import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions | FLARE",
  description:
    "FLARE’s Terms & Conditions outline the rules and guidelines for using our website, purchasing products, and understanding your rights and responsibilities.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Terms & Conditions</h1>
        <p className="text-gray-700 mb-6">
          Welcome to FLARE! By accessing or using our website (<a href="https://flare.co.za" className="text-orange-500 hover:underline">flare.co.za</a>), you agree to be bound by these Terms & Conditions (&quot;Terms&quot;). These Terms govern your use of our site, including browsing, purchasing products, and interacting with our services. If you do not agree, please refrain from using FLARE.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">1. General Use</h2>
          <p className="text-gray-700 mb-2">
            FLARE is an online streetwear and apparel store operating in South Africa. You may use our site for lawful purposes only. You agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-2">
            <li>Use FLARE to violate any South African laws, including the Electronic Communications and Transactions Act (ECTA).</li>
            <li>Attempt to hack, disrupt, or misuse our website or services.</li>
            <li>Reproduce or distribute our content without permission.</li>
          </ul>
          <p className="text-gray-700">
            We reserve the right to suspend or terminate access to users who breach these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">2. Purchases and Payments</h2>
          <p className="text-gray-700 mb-2">
            When you place an order on FLARE, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-2">
            <li>Provide accurate shipping and payment information.</li>
            <li>Pay the total amount, including any applicable delivery fees (free over R1000).</li>
            <li>Accept that all prices are in South African Rand (ZAR) and inclusive of VAT where applicable.</li>
          </ul>
          <p className="text-gray-700">
            Orders are subject to availability. We process payments securely via Stripe. Once an order is confirmed, you’ll receive a confirmation email. We reserve the right to cancel orders due to stock issues or payment failures, with a full refund issued where applicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">3. Shipping and Delivery</h2>
          <p className="text-gray-700">
            We offer standard shipping within South Africa (3-5 business days). Delivery fees apply to orders under R1000. You’ll receive tracking details once your order ships. FLARE is not liable for delays caused by third-party couriers or incorrect shipping information provided by you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">4. Returns and Refunds</h2>
          <p className="text-gray-700 mb-2">
            You may return items within 14 days of delivery if:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-2">
            <li>They are unused, in original packaging, and in resalable condition.</li>
            <li>You provide proof of purchase (e.g., order confirmation email).</li>
          </ul>
          <p className="text-gray-700">
            Refunds exclude shipping costs and are processed within 7 business days of receiving the return. Contact <a href="mailto:support@flare.co.za" className="text-red-500 hover:underline">support@flare.co.za</a> to initiate a return.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">5. Cookies and Privacy</h2>
          <p className="text-gray-700 mb-2">
            FLARE uses cookies to enhance your experience, as outlined in our{" "}
            <a href="/privacy-policy" className="text-red-500 hover:underline">Privacy Policy</a>. By using our site, you acknowledge:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-2">
            <li>Essential cookies (e.g., cart functionality) are set automatically.</li>
            <li>Non-essential cookies (e.g., personalization, analytics) require your consent via our cookie banner.</li>
          </ul>
          <p className="text-gray-700">
            You can manage your cookie preferences at any time by clearing your browser cookies or contacting us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-700">
            All content on FLARE (e.g., images, logos, product descriptions) is owned by FLARE or its licensors and protected by South African copyright law. You may not copy, modify, or distribute this content without written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-700">
            FLARE provides this site “as is” and is not liable for indirect damages, loss of data, or interruptions beyond our control (e.g., internet outages). Our liability is limited to the purchase price of any product under the Consumer Protection Act (CPA) where applicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">8. Governing Law</h2>
          <p className="text-gray-700">
            These Terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa, subject to your rights under the CPA or POPIA.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-700">
            We may update these Terms periodically. Changes will be posted here, and continued use of FLARE after updates constitutes acceptance. Check this page regularly for the latest version.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">10. Contact Us</h2>
          <p className="text-gray-700">
            Questions or concerns? Reach out at{" "}
            <a href="mailto:support@flare.co.za" className="text-red-500 hover:underline">support@flare.co.za</a> or call us at +27 123 456 789.
          </p>
        </section>

        <p className="text-gray-600 text-sm">
          Last updated: March 08, 2025
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Terms & Conditions",
              url: "https://flare.co.za/terms", // Update to your actual domain
              description:
                "FLARE’s Terms & Conditions outline the rules and guidelines for using our website, purchasing products, and understanding your rights and responsibilities.",
              publisher: {
                "@type": "Organization",
                name: "FLARE",
                logo: {
                  "@type": "ImageObject",
                  url: "https://flare.co.za/logo.png", // Update to your logo URL
                },
              },
            }),
          }}
        />
      </main>
      <Footer />
    </div>
  );
}