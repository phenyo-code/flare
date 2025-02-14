// app/dashboard/layout.js

import React from 'react';
import { Suspense } from 'react';  // React Suspense to handle loading state
import Loading from './loading';   // The loading component (i.e., `loading.tsx`)

export default function ProductLayout({ children }) {
  return (
    <div className="dashboard-layout">
      {/* Wrap children (i.e., page content) in Suspense boundary with fallback UI */}
      <Suspense fallback={<Loading />}>
        {/* The actual page or route content goes here */}
        {children}
      </Suspense>
    </div>
  );
}
