import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Para instalar: toque no menu do seu navegador e escolha 'Instalar aplicativo' ou 'Adicionar ao ecrã principal'.");
      setShowBanner(false);
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-[#D95A1A] to-[#B8430E] text-white px-4 py-2.5 flex items-center justify-between text-xs shadow-lg animate-in fade-in">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 shrink-0 animate-bounce" />
        <span>
          <strong>Instalar Kennet Hóspedes:</strong> Acesso rápido offline e sem barras de navegação.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="bg-white text-[#D95A1A] font-bold px-3 py-1 rounded-full text-xs shadow hover:bg-neutral-100"
          onClick={handleInstallClick}
        >
          Instalar App
        </button>
        <button
          type="button"
          className="text-white/80 hover:text-white p-1"
          onClick={() => setShowBanner(false)}
          aria-label="Dispensar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
