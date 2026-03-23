import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, BarChart3, Megaphone, Shield } from 'lucide-react';
import { useCookies, CookiePreferences } from '../../context/CookieContext';
import { Link } from 'react-router-dom';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, disabled }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2
        ${enabled ? 'bg-brand-gold' : 'bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

interface CookieCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  alwaysOn?: boolean;
}

const CookieCategory: React.FC<CookieCategoryProps> = ({
  icon,
  title,
  description,
  enabled,
  onChange,
  disabled,
  alwaysOn,
}) => {
  return (
    <div className="flex items-start gap-3 p-3 md:p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
      <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-1.5">
          <h4 className="text-white font-medium text-sm">{title}</h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            {alwaysOn && (
              <span className="text-xs text-gray-500 uppercase tracking-wider">Vždy aktívne</span>
            )}
            <ToggleSwitch enabled={enabled} onChange={onChange} disabled={disabled} />
          </div>
        </div>
        <p className="text-gray-400 text-xs md:text-sm leading-snug">{description}</p>
      </div>
    </div>
  );
};

export const CookieSettings: React.FC = () => {
  const { isSettingsOpen, closeSettings, preferences, savePreferences, acceptAll, rejectAll } = useCookies();
  const [localPrefs, setLocalPrefs] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    if (isSettingsOpen) {
      setLocalPrefs(preferences);
    }
  }, [isSettingsOpen, preferences]);

  const handleSave = () => {
    const prefsToSave: CookiePreferences = {
      necessary: true,
      analytics: localPrefs.analytics,
      marketing: localPrefs.marketing,
    };
    savePreferences(prefsToSave);
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full z-[10001] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]"
          >
            <div className="bg-[#1a1a1a] border border-gray-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-full">

              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h2 className="text-white font-medium text-lg">Nastavenia cookies</h2>
                    <p className="text-gray-500 text-xs">Upravte svoje preferencie</p>
                  </div>
                </div>
                <button
                  onClick={closeSettings}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-2.5 md:space-y-3">
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-3">
                  Vyberte si, ktoré kategórie cookies chcete povoliť.{' '}
                  <Link to="/cookies" onClick={closeSettings} className="text-brand-gold hover:underline">
                    Viac informácií
                  </Link>.
                </p>

                <CookieCategory
                  icon={<Shield className="w-5 h-5 text-green-400" />}
                  title="Nevyhnutné cookies"
                  description="Potrebné pre základné fungovanie stránky. Nie je možné ich vypnúť."
                  enabled={true}
                  onChange={() => {}}
                  disabled={true}
                  alwaysOn={true}
                />

                <CookieCategory
                  icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                  title="Analytické cookies"
                  description="Pomáhajú nám pochopiť, ako návštevníci používajú našu stránku."
                  enabled={localPrefs.analytics}
                  onChange={(enabled) => setLocalPrefs(prev => ({ ...prev, analytics: enabled }))}
                />

                <CookieCategory
                  icon={<Megaphone className="w-5 h-5 text-purple-400" />}
                  title="Marketingové cookies"
                  description="Zobrazovanie relevantných reklám a meranie efektivity kampaní."
                  enabled={localPrefs.marketing}
                  onChange={(enabled) => setLocalPrefs(prev => ({ ...prev, marketing: enabled }))}
                />
              </div>

              {/* Footer — col-reverse on mobile so Accept All is on top */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 p-3 md:p-4 border-t border-gray-800 bg-gray-900/50 flex-shrink-0">
                <button
                  onClick={rejectAll}
                  className="flex-1 px-4 py-2 md:py-2.5 text-gray-400 hover:text-white rounded-full text-xs md:text-sm font-medium transition-colors"
                >
                  Odmietnuť
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 md:py-2.5 bg-gray-700 text-white hover:bg-gray-600 rounded-full text-xs md:text-sm font-medium transition-all"
                >
                  Uložiť výber
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2 md:py-2.5 bg-brand-gold text-brand-dark hover:bg-white rounded-full text-xs md:text-sm font-bold transition-all"
                >
                  Prijať všetky
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
