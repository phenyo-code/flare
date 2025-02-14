import React from 'react';
import { Suspense } from 'react';  // React Suspense to handle loading state
import CartLoading from './loading';   // The loading component (i.e., `loading.tsx`)

export default function ProductLayout({ children }) {
  return (
    <div className="dashboard-layout">
      {/* Wrap children (i.e., page content) in Suspense boundary with fallback UI */}
      <Suspense fallback={<CartLoading />}>
        {/* The actual page or route content goes here */}
        {children}
      </Suspense>
    </div>
  );
}
