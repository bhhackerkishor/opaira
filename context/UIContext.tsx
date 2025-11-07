"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Settings = {
  skipPreviousPartner: boolean;
  soundEffects: boolean;
  autoConnect: boolean;
};

type UIContextType = {
  showNavbar: boolean;
  setShowNavbar: (value: boolean) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  lastPartnerId: string | null;
  setLastPartnerId: (id: string | null) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [showNavbar, setShowNavbar] = useState(true);

  // --- load and persist settings ---
  const [settings, setSettings] = useState<Settings>({
    skipPreviousPartner: false,
    soundEffects: false,
    autoConnect: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("talk_settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("talk_settings", JSON.stringify(settings));
  }, [settings]);

  // --- store last partner id globally ---
  const [lastPartnerId, setLastPartnerId] = useState<string | null>(null);

  return (
    <UIContext.Provider
      value={{
        showNavbar,
        setShowNavbar,
        settings,
        setSettings,
        lastPartnerId,
        setLastPartnerId,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}
