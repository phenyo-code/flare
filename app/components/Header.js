"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="header w-full bg-white flex flex-col box-border">
      {/* Top Row */}
      <div className="header-top-row flex justify-between items-center py-2 px-4">
        {/* Logo */}
        <div className="logo flex items-center">
          <Link href="/" className="text-transparent bg-gradient-to-br from-black to-red-500 bg-clip-text text-2xl font-extrabold tracking-widest uppercase">
            FLARE
          </Link>
        </div>

        {/* Icons */}
        <div className="header-icons flex items-center space-x-4 ">
          <Link href="/search">
            <FiSearch className="text-gray-600 text-2xl cursor-pointer" />
          </Link>
          <div className="cart-icon relative">
            <Link href="/cart">
              <FiShoppingCart className="text-gray-600 text-2xl cursor-pointer" />
            </Link>
          </div>
          {/* Menu Icon */}
          <FiMenu className="text-gray-600 text-2xl cursor-pointer" onClick={() => setIsMenuOpen(true)} />
        </div>
      </div>


      {/* Side Menu (From Right) */}
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

          {/* Admin Link */}
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/admin" className="text-gray-800">Admin Dashboard</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;





