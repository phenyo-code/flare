// components/InteractionMessage.tsx

import React from 'react';

export default function InteractionMessage() {
  return (
    <div className="interaction-message text-center py-6 px-8 bg-black text-white  shadow-xl max-w-lg mx-auto">
      <p className="text-xl font-semibold">
        To receive personalized product recommendations, please interact with the site!
      </p>
      <p className="text-sm mt-2 text-gray-400">
        Start browsing, viewing, or searching products to get tailored suggestions just for you.
      </p>
    </div>
  );
}
