"use client";

import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import HomeLoading from "./loading";
import OfflineNotification from "./components/OfflineNotification";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={<HomeLoading />}>
        <OfflineNotification />
        {children}
      </Suspense>
    </SessionProvider>
  );
}