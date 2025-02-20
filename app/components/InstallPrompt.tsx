"use client";

import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showiOSPrompt, setShowiOSPrompt] = useState(false);
  const [showWindowsPrompt, setShowWindowsPrompt] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isWindows = /Windows/.test(navigator.userAgent);

      if (isStandalone) {
        setShowInstallButton(false);
        setShowiOSPrompt(false);
        setShowWindowsPrompt(false);
        return;
      }

      if (isIOS) {
        setShowiOSPrompt(true);
      }

      if (isWindows) {
        setShowWindowsPrompt(true);
      }

      const handleBeforeInstallPrompt = (event) => {
        event.preventDefault();
        setDeferredPrompt(event);
        setShowInstallButton(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  return (
    <>
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-5 right-5 py-3 px-6 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg"
        >
          Install App
        </button>
      )}

      {showiOSPrompt && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 py-3 px-6 bg-yellow-400 text-black text-center rounded-md shadow-lg">
          <p>
            Install this app: Tap <strong>Share</strong> and then <strong>Add to Home Screen</strong>.
          </p>
        </div>
      )}

      {showWindowsPrompt && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 py-3 px-6 bg-yellow-400 text-black text-center rounded-md shadow-lg">
          <p>
            Install this app: Click the <strong>Install</strong> button in the browser menu.
          </p>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;
