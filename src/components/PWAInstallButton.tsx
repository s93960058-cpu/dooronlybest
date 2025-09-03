import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Info } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return {
        browser: 'Chrome',
        mobile: [
          'לחצו על תפריט הדפדפן (שלוש נקודות)',
          'בחרו "הוסף לדף הבית" או "התקן אפליקציה"',
          'אשרו את ההתקנה'
        ],
        desktop: [
          'לחצו על סמל ההתקנה בסרגל הכתובת',
          'או לחצו על תפריט הדפדפן ← "התקן Only Best"',
          'אשרו את ההתקנה'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        mobile: [
          'לחצו על תפריט הדפדפן (שלוש נקודות)',
          'בחרו "התקן" או "הוסף לדף הבית"',
          'אשרו את ההתקנה'
        ],
        desktop: [
          'Firefox עדיין לא תומך במלואו בהתקנת PWA',
          'תוכלו להוסיף סימנייה לגישה מהירה'
        ]
      };
    } else if (userAgent.includes('safari')) {
      return {
        browser: 'Safari',
        mobile: [
          'לחצו על כפתור השיתוף (חץ כלפי מעלה)',
          'גללו למטה ובחרו "הוסף לדף הבית"',
          'הקלידו שם לאפליקציה ולחצו "הוסף"'
        ],
        desktop: [
          'Safari במחשב עדיין לא תומך בהתקנת PWA',
          'תוכלו להוסיף סימנייה לגישה מהירה'
        ]
      };
    } else {
      return {
        browser: 'הדפדפן שלכם',
        mobile: [
          'חפשו אפשרות "הוסף לדף הבית" בתפריט הדפדפן',
          'או "התקן אפליקציה" אם זמין'
        ],
        desktop: [
          'חפשו סמל התקנה בסרגל הכתובת',
          'או באפשרויות הדפדפן'
        ]
      };
    }
  };

  if (isInstalled) {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  const instructions = getBrowserInstructions();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <>
      {/* Install Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={handleInstallClick}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
          title="התקן אפליקציה"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">התקן אפליקציה</span>
        </button>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Download className="w-6 h-6 text-orange-600" />
                התקנת האפליקציה
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Benefits */}
              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  יתרונות האפליקציה
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• גישה מהירה מדף הבית</li>
                  <li>• עבודה גם ללא אינטרנט</li>
                  <li>• חוויית משתמש משופרת</li>
                  <li>• התראות על מוצרים חדשים</li>
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {isMobile ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                  הוראות התקנה ב{instructions.browser}
                </h4>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <ol className="text-sm text-gray-700 space-y-2">
                    {(isMobile ? instructions.mobile : instructions.desktop).map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Alternative browsers note */}
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                <strong>טip:</strong> אם האפשרות לא זמינה, נסו לפתוח את האתר בדפדפן Chrome או Edge לחוויה מיטבית.
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200"
              >
                הבנתי
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallButton;