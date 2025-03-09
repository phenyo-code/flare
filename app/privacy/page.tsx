import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | FLARE",
  description: "FLARE’s privacy policy outlining how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          Your privacy is important to us at FLARE. This Privacy Policy explains how we collect, use, and protect your personal information in accordance with the Protection of Personal Information Act (POPIA) in South Africa.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-2">
            We collect information to provide you with a seamless shopping experience. This includes:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Personal details (e.g., name, email, shipping address) when you place an order.</li>
            <li>Behavioral data via cookies (see below).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">2. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-2">
            We use cookies to enhance your experience on FLARE. You can manage your preferences via the cookie banner on our site.
          </p>
          <h3 className="text-lg font-medium text-red-500 mb-2">Cookie Types:</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>
              <strong>Essential Cookies</strong> (<code>user_cart</code>): Stores your cart items (product ID, size, quantity) for 30 days. Necessary for site functionality; no consent required.
            </li>
            <li>
              <strong>Personalization Cookies</strong> (<code>user_searches</code>, <code>user_product_views</code>, <code>user_category_views</code>): Tracks searches (up to 10), product views (up to 20), and category views (up to 20) for 30 days to personalize your experience and infer gender preferences. Optional; requires consent.
            </li>
            <li>
              <strong>Analytics Cookies</strong> (<code>user_interaction</code>): Records interactions for 30 days to improve our site. Optional; requires consent.
            </li>
            <li>
              <strong>Consent Cookie</strong> (<code>cookie_consent</code>): Stores your cookie preference (“accepted” or “denied”) for 1 year.
            </li>
          </ul>
          <p className="text-gray-700 mt-2">
            To manage cookies, use the banner on your first visit or clear your browser cookies to reset your preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700">
            - Process orders and deliver products.<br />
            - Personalize your shopping experience (e.g., gender-based recommendations).<br />
            - Analyze site usage to improve FLARE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">4. Your Rights</h2>
          <p className="text-gray-700">
            Under POPIA, you can request access, correction, or deletion of your data. Contact us at <a href="mailto:support@flare.co.za" className="text-red-500 hover:underline">support@flare.co.za</a>.
          </p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Privacy Policy",
              url: "https://flare.co.za/privacy-policy", // Update to your domain
              description: "FLARE’s privacy policy outlining how we collect, use, and protect your personal information.",
            }),
          }}
        />
      </main>
      <Footer />
    </div>
  );
}