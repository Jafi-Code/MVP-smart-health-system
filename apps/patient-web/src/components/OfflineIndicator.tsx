import { useEffect, useState } from "react";
import { getPendingBookingsCount } from "../lib/offlineQueue";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const update = async () => setPending(await getPendingBookingsCount());
    update();

    const goOnline = () => {
      setIsOffline(false);
      update();
    };
    const goOffline = () => setIsOffline(true);
    const interval = setInterval(update, 2000);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!isOffline && pending === 0) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${
        isOffline ? "bg-amber-500" : "bg-green-600"
      }`}
    >
      {isOffline && pending > 0
        ? `Offline — ${pending} booking${pending === 1 ? "" : "s"} saved`
        : isOffline
          ? "Offline mode"
          : `✓ Confirming ${pending} booking${pending === 1 ? "" : "s"}...`}
    </div>
  );
}
