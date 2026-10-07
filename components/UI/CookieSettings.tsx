import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Megaphone, Shield, Layers } from 'lucide-react';
import { useCookies, CookiePreferences } from '../../context/CookieContext';
import { Link } from 'react-router-dom';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, disabled, label }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-light
        ${enabled ? 'bg-brand-dark' : 'bg-[#C9C6BC]'}
        ${disabled ? 'cursor-not-allowed opacity-45' : ''}
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
    <div className="flex items-start gap-3.5 border-b border-brand-line py-4 last:border-b-0">
      <div className="grid h-10 w-10 flex-none place-items-center rounded-[3px] bg-brand-sand text-brand-dark">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-4">
          <h4 className="text-[0.95rem] font-semibold">{title}</h4>
          <div className="flex flex-shrink-0 items-center gap-2.5">
            {alwaysOn && (
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand-muted">Vždy aktívne</span>
            )}
            <ToggleSwitch enabled={enabled} onChange={onChange} disabled={disabled} label={title} />
          </div>
        </div>
        <p className="text-[0.84rem] font-light leading-snug text-brand-muted">{description}</p>
      </div>
    </div>
  );
};

const FOOTER_BUTTON =
  'inline-flex min-h-[46px] flex-1 items-center justify-center rounded-[10px] px-4 text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-colors duration-200';

export const CookieSettings: React.FC = () => {
  const { isSettingsOpen, closeSettings, preferences, savePreferences, acceptAll, rejectAll } = useCookies();
  const [localPrefs, setLocalPrefs] = useState<CookiePreferences>(preferences);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSettingsOpen) {
      setLocalPrefs(preferences);
    }
  }, [isSettingsOpen, preferences]);

  // Keyboard: focus lands on the close button, Escape closes the dialog
  useEffect(() => {
    if (!isSettingsOpen) return;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSettingsOpen, closeSettings]);

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
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 z-[10000] bg-brand-dark/50 backdrop-blur-[2px]"
          />

          {/* Modal */}
          <m.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            // Centred by flex, not by translate classes: framer-motion's inline transform would override those
            className="pointer-events-none fixed inset-0 z-[10001] flex items-center justify-center p-3 sm:p-6"
          >
            <div className="pointer-events-auto flex max-h-full w-full max-w-[640px] flex-col overflow-hidden rounded-[3px] bg-brand-light text-brand-dark shadow-[0_32px_80px_-24px_rgba(26,26,26,0.5)] md:max-h-[90vh]">

              {/* Header */}
              <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-brand-line py-4 pl-5 pr-3 md:py-5 md:pl-7">
                <div className="pt-1">
                  <h2 id="cookie-settings-title" className="text-[1.15rem] font-semibold leading-snug">Nastavenia cookies a podobných technológií</h2>
                  <p className="mt-0.5 text-[0.8rem] font-light text-brand-muted">Upravte svoje preferencie</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeSettings}
                  className="grid h-11 w-11 flex-none place-items-center rounded-full text-brand-muted transition-colors hover:bg-brand-sand hover:text-brand-dark"
                  aria-label="Zavrieť nastavenia cookies"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Content */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 md:px-7">
                <p className="text-[0.84rem] font-light leading-relaxed text-brand-muted">
                  Tu si môžete nastaviť, ktoré cookies a podobné technológie povolíte.
                  Nevyhnutné technológie sú vždy aktívne. Ostatné kategórie môžete
                  povoliť alebo odmietnuť podľa svojich preferencií.
                  Svoje rozhodnutie môžete kedykoľvek zmeniť cez odkaz v pätičke webu.{' '}
                  <Link to="/cookies" onClick={closeSettings} className="font-medium text-brand-dark underline underline-offset-4">
                    Viac informácií
                  </Link>.
                </p>

                <div className="mt-2">
                  <CookieCategory
                    icon={<Shield className="h-5 w-5" strokeWidth={1.4} />}
                    title="Nevyhnutné"
                    description="Technicky nutné pre základné fungovanie webu, bezpečnosť stránky, uloženie vašich nastavení súhlasu a ochranu formulárov pred zneužitím. Bez nich by web nemusel fungovať správne."
                    enabled={true}
                    onChange={() => {}}
                    disabled={true}
                    alwaysOn={true}
                  />

                  <CookieCategory
                    icon={<Layers className="h-5 w-5" strokeWidth={1.4} />}
                    title="Funkčné"
                    description="Slúžia na zapamätanie vašich preferencií a zlepšenie používateľského komfortu, napríklad pri práci s rozhraním alebo nepovinnými funkciami webu."
                    enabled={true}
                    onChange={() => {}}
                    disabled={true}
                    alwaysOn={true}
                  />

                  <CookieCategory
                    icon={<BarChart3 className="h-5 w-5" strokeWidth={1.4} />}
                    title="Analytické"
                    description="Pomáhajú nám merať návštevnosť a pochopiť, ako návštevníci používajú náš web, aby sme vedeli zlepšovať obsah, štruktúru a výkon stránky."
                    enabled={localPrefs.analytics}
                    onChange={(enabled) => setLocalPrefs(prev => ({ ...prev, analytics: enabled }))}
                  />

                  <CookieCategory
                    icon={<Megaphone className="h-5 w-5" strokeWidth={1.4} />}
                    title="Marketingové"
                    description="Používajú sa na meranie účinnosti reklamy, remarketing a zobrazovanie relevantnejších reklamných kampaní."
                    enabled={localPrefs.marketing}
                    onChange={(enabled) => setLocalPrefs(prev => ({ ...prev, marketing: enabled }))}
                  />
                </div>
              </div>

              {/* Footer — Reject / Save / Accept */}
              <div className="flex flex-shrink-0 flex-col-reverse gap-2 border-t border-brand-line bg-brand-sand/60 p-4 sm:flex-row md:px-7">
                <button
                  type="button"
                  onClick={rejectAll}
                  className={`${FOOTER_BUTTON} border border-brand-dark text-brand-dark hover:bg-brand-dark/5`}
                >
                  Odmietnuť všetko
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={`${FOOTER_BUTTON} border border-brand-dark text-brand-dark hover:bg-brand-dark/5`}
                >
                  Uložiť nastavenia
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className={`${FOOTER_BUTTON} bg-brand-dark text-brand-light hover:bg-[#333331]`}
                >
                  Prijať všetko
                </button>
              </div>

            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};
