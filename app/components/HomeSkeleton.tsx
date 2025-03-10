"use client";

import { FaFire } from "react-icons/fa";

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-100 opacity-50 animate-pulse" />

      {/* FLARE Branding with Dynamic Effects */}
      <div className="relative z-10 mb-12 flex items-center">
        <FaFire className="text-orange-500 text-5xl animate-[flicker_1.5s_infinite]" />
        <h1 className="text-4xl font-extrabold text-gray-800 ml-3 tracking-wider animate-[glow_2s_infinite]">
          FLARE
        </h1>
      </div>

      {/* Enhanced Bouncing Dots */}
      <div className="relative z-10 flex justify-center space-x-4">
        <div
          className="w-4 h-4 bg-orange-500 rounded-full animate-[bounce_0.6s_infinite] shadow-lg shadow-orange-300"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-4 h-4 bg-orange-500 rounded-full animate-[bounce_0.6s_infinite] shadow-lg shadow-orange-300"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-4 h-4 bg-orange-500 rounded-full animate-[bounce_0.6s_infinite] shadow-lg shadow-orange-300"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      {/* Subtle Ripple Effect */}
      <div className="absolute bottom-1/2 translate-y-1/2 flex justify-center items-center">
        <div className="w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-[ripple_2s_infinite] scale-0" />
        <div className="w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-[ripple_2s_infinite] scale-0" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(255, 149, 0, 0.5); }
          50% { text-shadow: 0 0 15px rgba(255, 149, 0, 0.8); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.3; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}