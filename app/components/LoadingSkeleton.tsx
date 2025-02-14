// components/LoadingSkeleton.tsx

import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-card"></div> {/* Skeleton for a product card */}
      <div className="skeleton-card"></div> {/* More skeletons if needed */}
    </div>
  );
}
