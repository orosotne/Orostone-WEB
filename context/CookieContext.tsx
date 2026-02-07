import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
}

interface CookieContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  isSettingsOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<CookiePreferences>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  savePreferences: (prefsToSave?: CookiePreferences) => void;
}

const STORAGE_KEY = 'orostone-cookies';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const useCookies = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};

interface CookieProviderProps {
  children: React.ReactNode;
}

export const CookieProvider: React.FC<CookieProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({
          necessary: true, // Always true
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
        });
        setHasConsented(true);
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
    }
  }, []);

  // Save preferences to localStorage
  const saveToStorage = useCallback((prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      setPreferences(prefs);
      setHasConsented(true);
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveToStorage(allAccepted);
    setIsSettingsOpen(false);
  }, [saveToStorage]);

  const rejectAll = useCallback(() => {
    const allRejected: CookiePreferences = {
      necessary: true, // Always true
      analytics: false,
      marketing: false,
    };
    saveToStorage(allRejected);
    setIsSettingsOpen(false);
  }, [saveToStorage]);

  const updatePreferences = useCallback((prefs: Partial<CookiePreferences>) => {
    setTempPreferences(prev => ({
      ...prev,
      ...prefs,
      necessary: true, // Always true
    }));
  }, []);

  const openSettings = useCallback(() => {
    setTempPreferences(preferences);
    setIsSettingsOpen(true);
  }, [preferences]);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const savePreferences = useCallback((prefsToSave?: CookiePreferences) => {
    const finalPrefs = prefsToSave || tempPreferences;
    saveToStorage(finalPrefs);
    setIsSettingsOpen(false);
  }, [tempPreferences, saveToStorage]);

  const value: CookieContextType = {
    preferences,
    hasConsented,
    isSettingsOpen,
    acceptAll,
    rejectAll,
    updatePreferences,
    openSettings,
    closeSettings,
    savePreferences,
  };

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
};

