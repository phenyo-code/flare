"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="admin-header w-full bg-white flex flex-col shadow-md box-border">
      {/* Top Row */}
      <div className="admin-header-top-row flex justify-between items-center py-2 px-4">
        {/* Logo */}
        <div className="logo flex items-center">
          <Link href="/" className="text-transparent bg-gradient-to-br from-black to-red-500 bg-clip-text text-2xl font-extrabold tracking-widest uppercase">
            FLARE Admin
          </Link>
        </div>

        {/* Menu Icon */}
        <FiMenu className="text-gray-600 text-2xl cursor-pointer" onClick={() => setIsMenuOpen(true)} />
      </div>

      {/* Admin Side Menu (From Right) */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-white text-black z-50 transition-transform duration-300 ease-in-out shadow-lg ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <FiX className="text-gray-600 text-2xl cursor-pointer" onClick={() => setIsMenuOpen(false)} />
        </div>

        {/* Admin Menu Links */}
        <ul className="flex flex-col m-0 p-0">
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="text-gray-800">Dashboard</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/admin/products" className="text-gray-800">Manage Products</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/admin/orders" className="text-gray-800">Orders</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/admin/customers" className="text-gray-800">Customers</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/admin/settings" className="text-gray-800">Settings</Link>
          </li>
          <li className="py-4 px-6 border-b border-gray-200">
            <Link href="/admin/logout" className="text-gray-800">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHeader;
