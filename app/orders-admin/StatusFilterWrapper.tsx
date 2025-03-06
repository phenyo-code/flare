"use client";

import dynamic from "next/dynamic";

// Dynamically import StatusFilter with SSR disabled
const StatusFilter = dynamic(() => import("./StatusFilter"), { ssr: false });

interface StatusFilterWrapperProps {
  initialOrders: any[];
  statuses: string[];
}

export default function StatusFilterWrapper({ initialOrders, statuses }: StatusFilterWrapperProps) {
  return <StatusFilter initialOrders={initialOrders} statuses={statuses} />;
}