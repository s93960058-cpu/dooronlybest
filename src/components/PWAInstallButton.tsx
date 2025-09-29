import React, { useEffect, useState } from "react";

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // מאזין לאירוע שנורה כשהדפדפן מזהה שאפשר להתקין PWA
    const handler = (e: Event) => {
      e.preventDefault(); // מונע את הבאנר האוטומטי
      setDeferredPrompt(e); // שומר את האירוע לשימוש מאוחר יותר
      setIsVisible(true); // מציג את הכפתור
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // פותח את חלון ההתקנה
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("המשתמש התקין את האפליקציה ✅");
    } else {
      console.log("המשתמש דחה את ההתקנה ❌");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null; // לא מציג כלום אם אין אפשרות התקנה

  return (
    <button onClick={handleInstall} style={{ padding: "10px", margin: "10px", background: "#6200ee", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
      התקן אפליקציה
    </button>
  );
};

export default PWAInstallButton;
