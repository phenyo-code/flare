"use client";

import React, { useState } from 'react';

const sideMenu = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className={`fixed top-0 right-0 w-64 h-full bg-white text-black z-50 transition-transform duration-300 ease-in-out shadow-lg ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <FiX className="text-gray-600 text-2xl cursor-pointer" onClick={() => setIsMenuOpen(false)} />
        </div>

        {/* Menu Links */}
        <ul className="flex flex-col m-0 p-0">
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/profile" className="text-gray-800">Profile</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/settings" className="text-gray-800">Settings</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/cart" className="text-gray-800">Cart (3)</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/wishlist" className="text-gray-800">Wishlist</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/help" className="text-gray-800">Help</Link>
          </li>
        </ul>
      </div>
  )
}

export default sideMenu