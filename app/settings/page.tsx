"use client";

import { useState, useEffect } from "react";
import { FaUser, FaBell, FaLock, FaCreditCard } from "react-icons/fa";
import { HiOutlineFlag } from "react-icons/hi";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  // Set initial theme based on localStorage or default to light
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.body.classList.add(storedTheme); // Add theme class to body
  }, []);

  // Change theme and save it to localStorage
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.remove("light", "dark"); // Remove both classes
    document.body.classList.add(newTheme); // Add the selected theme class
  };

  const handleSaveSettings = () => {
    // Logic to save settings
    console.log("Settings saved!");
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Settings</h1>

      {/* Notification Preferences */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaBell className="mr-3" /> Notification Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-notifications"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="mr-3"
            />
            <label htmlFor="email-notifications" className="text-sm text-gray-600">Email Notifications</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms-notifications"
              checked={smsNotifications}
              onChange={() => setSmsNotifications(!smsNotifications)}
              className="mr-3"
            />
            <label htmlFor="sms-notifications" className="text-sm text-gray-600">SMS Notifications</label>
          </div>
        </div>
      </section>

      {/* Privacy Settings */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaLock className="mr-3" /> Privacy Settings
        </h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="privacy-mode"
            checked={privacyMode}
            onChange={() => setPrivacyMode(!privacyMode)}
            className="mr-3"
          />
          <label htmlFor="privacy-mode" className="text-sm text-gray-600">Enable Privacy Mode</label>
        </div>
      </section>

      {/* General Settings */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <HiOutlineFlag className="mr-3" /> General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="language" className="block text-sm text-gray-600">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label htmlFor="theme" className="block text-sm text-gray-600">Theme</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </section>

      {/* Billing Section (if applicable) */}
      <section className="settings-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaCreditCard className="mr-3" /> Billing Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="payment-method" className="block text-sm text-gray-600">Payment Method</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
