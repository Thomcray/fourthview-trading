"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

type NetworkContextType = {
  isOnline: boolean;
};

const NetworkContext = createContext<NetworkContextType>({ isOnline: true });

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);

  useEffect(() => {
    const online = navigator.onLine;
    setIsOnline(online);
    if (!online) setShowOfflineBanner(true);

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      setShowOnlineBanner(false);
      toast.error("You're offline. Please check your connection.", {
        toastId: "network-offline",
        autoClose: false,
        closeButton: true,
      });
    };

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      setShowOnlineBanner(true);
      toast.dismiss("network-offline");
      toast.success("You're back online!", {
        toastId: "network-online",
        autoClose: 3000,
      });
      setTimeout(() => setShowOnlineBanner(false), 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            key="offline-banner"
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -48 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white px-4 py-3 flex items-center justify-center gap-2 shadow-lg"
          >
            <WifiOff className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">
              You&apos;re offline — please check your internet connection.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOnlineBanner && (
          <motion.div
            key="online-banner"
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -48 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-green-600 text-white px-4 py-3 flex items-center justify-center gap-2 shadow-lg"
          >
            <Wifi className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">You&apos;re back online!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showOfflineBanner && <div className="h-12" />}

      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
