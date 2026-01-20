import { useState, useEffect, useCallback } from "react";

export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, showBanner, closeBanner };
};
