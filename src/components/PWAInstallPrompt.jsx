import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2 } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("วิธีติดตั้งลงสมาร์ทโฟน:\n\n• iOS (Safari): กดปุ่ม Share -> เลือก 'Add to Home Screen'\n• Android (Chrome): กดเมนู 3 จุด -> เลือก 'Install App'");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-gray-900 border-b border-amber-500/30 px-3 py-2 text-xs flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-amber-500 text-gray-950">
          <Smartphone className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-amber-300">ติดตั้ง XAUUSD Quant Pro เป็นแอปบนสมาร์ทโฟน (PWA)</span>
          <span className="hidden sm:inline text-gray-400 ml-2">ใช้งานสะดวกแม้ยามปิดเบราว์เซอร์</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20"
        >
          <Download className="w-3.5 h-3.5" /> ติดตั้งแอป (Install)
        </button>

        {isVisible && (
          <button onClick={() => setIsVisible(false)} className="p-1 text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
