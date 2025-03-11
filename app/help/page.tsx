"use client";

import { useState } from "react";
import { FaQuestionCircle, FaEnvelope, FaPhone, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "Go to the Sign In page and click 'Forgot Password?'. Enter your registered email, and we’ll send a reset link. Follow the email instructions to create a new password (minimum 12 characters, including uppercase, lowercase, numbers, and special characters). If the email doesn’t arrive, check your spam folder or contact support@flare.com.",
    },
    {
      question: "Why haven’t I received my verification email after signing up?",
      answer:
        "First, check your spam or junk folder. If it’s not there, wait 5-10 minutes, then use the 'Resend Verification Email' option on the Sign In page. Ensure the email entered during signup is correct. If you still don’t receive it, email support@flare.com with your signup email and approximate signup time.",
    },
    {
      question: "How can I track my FLARE order?",
      answer:
        "After placing an order, you’ll receive a confirmation email with a tracking number. Sign in to your FLARE account, navigate to 'My Orders', and enter the tracking number to view real-time updates. If the order isn’t visible, verify you’re logged into the correct account or contact support with your order number.",
    },
    {
      question: "What if I’m seeing an 'Unauthorized' error on FLARE?",
      answer:
        "This occurs if you lack permission for a page (e.g., admin dashboard). Ensure you’re signed in with the correct account via /login. Team members should ask their FLARE account administrator to adjust permissions. For persistent issues, email support@flare.com with your account email and the restricted page URL.",
    },
    {
      question: "How do I update my shipping address after placing an order?",
      answer:
        "If your order hasn’t shipped yet, sign in, go to 'My Orders', and select 'Edit Shipping Address' (available within 1 hour of order placement). After that, changes aren’t possible online—email support@flare.com with your order number and new address ASAP. Once shipped, updates aren’t possible.",
    },
    {
      question: "What payment methods does FLARE accept?",
      answer:
        "FLARE accepts major credit/debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay/Google Pay at checkout. We don’t support cash on delivery or cryptocurrency yet. Ensure your payment method is valid and has sufficient funds. For payment issues, contact support with your transaction details.",
    },
    {
      question: "How long does shipping take with FLARE?",
      answer:
        "Standard shipping takes 3-7 business days within the US, depending on your location. Expedited options (1-2 days) are available at checkout. International shipping varies (7-14 days). Check your order confirmation email for estimated delivery. Delays? Use your tracking number or email support@flare.com.",
    },
    {
      question: "Can I return or exchange an item purchased on FLARE?",
      answer:
        "Yes, returns are accepted within 30 days of delivery if items are unused and in original packaging. Sign in, go to 'My Orders', select the order, and click 'Request Return' to generate a return label. Exchanges depend on stock—email support@flare.com if your size/color is unavailable. Refunds process within 5-10 business days.",
    },
    {
      question: "Why was my payment declined on FLARE?",
      answer:
        "Declines can occur due to insufficient funds, incorrect card details, or bank restrictions. Double-check your payment info in 'My Account' > 'Payment Methods'. Try another method if the issue persists. Contact your bank for authorization issues, or email support@flare.com with your order attempt details.",
    },
    {
      question: "How do I cancel an order on FLARE?",
      answer:
        "Orders can be canceled within 1 hour of placement if not yet processed. Sign in, go to 'My Orders', and click 'Cancel Order'. After this window, cancellation isn’t guaranteed—email support@flare.com immediately with your order number. Refunds for canceled orders process within 3-5 business days.",
    },
    {
      question: "What should I do if an item is missing or damaged from my FLARE order?",
      answer:
        "Inspect your package upon arrival. For missing or damaged items, sign in, go to 'My Orders', and select 'Report Issue' within 7 days of delivery. Upload photos of the damage and packaging. We’ll process a replacement or refund within 48 hours. Email support@flare.com if you need assistance.",
    },
    {
      question: "How do I contact FLARE customer support?",
      answer:
        "Email us at support@flare.com or call +1-800-FLARE-HELP (1-800-352-7343), Monday to Friday, 9 AM - 5 PM EST. Provide your account email, order number (if applicable), and a detailed description of your issue. Expect a response within 24 hours via email or during call hours.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">FLARE Help Center</h1>
          <p className="mt-2 text-lg text-gray-500">
            Your one-stop resource for shopping with FLARE—find answers or contact our team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for help (e.g., shipping, returns)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 transform transition-all duration-300 hover:shadow-xl">
          {/* FAQs Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 py-4">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left text-gray-700 font-medium hover:text-red-500 transition-colors duration-200"
                  >
                    <span>{faq.question}</span>
                    {expandedFAQ === index ? (
                      <FaChevronUp className="text-red-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <p className="mt-2 text-sm text-gray-600 animate-fade-in">{faq.answer}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No results found. Try a different search term.</p>
            )}
          </section>

          {/* Contact Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Still Need Assistance?</h2>
            <p className="text-sm text-gray-500">
              Our FLARE support team is ready to help with orders, accounts, or technical issues.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-red-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Email Us</p>
                  <a
                    href="mailto:support@flare.com"
                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    support@flare.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-red-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Call Us</p>
                  <a
                    href="tel:+18003527343"
                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    +1-800-FLARE-HELP
                  </a>
                  <p className="text-xs text-gray-500">Mon-Fri, 9 AM - 5 PM EST</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}