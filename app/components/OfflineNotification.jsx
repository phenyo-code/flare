'use client';

import { useEffect, useState } from 'react';

export default function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (isOffline) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%',  backgroundColor: 'red', color: 'white', textAlign: 'center' }}>
        <p>You're offline! Please check your connection.</p>
      </div>
    );
  }

  return null;
}
