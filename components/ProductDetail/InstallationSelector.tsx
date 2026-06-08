import React, { useState, useEffect, startTransition } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Check, Wrench, HelpCircle, Info } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { INSTALLATION_RATE_PER_M2 } from './types';

interface InstallationSelectorProps {
  installationSelected: boolean;
  installationAreaM2: number | null;
  onInstallationToggle: (selected: boolean) => void;
  onAreaChange: (area: number | null) => void;
}

export const InstallationSelector: React.FC<InstallationSelectorProps> = ({
  installationSelected,
  installationAreaM2,
  onInstallationToggle,
  onAreaChange,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showAreaTooltip, setShowAreaTooltip] = useState(false);

  // Local mirror state for immediate input feedback. Without this, every keystroke
  // would propagate up to ShopProductDetail's setInstallationAreaM2 → re-render the
  // entire product detail tree (Hero + 9 sections) before the input could repaint.
  // We mirror locally for instant typing UX, then defer the parent update via
  // startTransition so the heavy tree re-render is interruptible.
  const [localArea, setLocalArea] = useState<string>(
    installationAreaM2 != null ? String(installationAreaM2) : ''
  );

  // Sync from parent when prop changes externally (e.g. product change / reset)
  useEffect(() => {
    setLocalArea(installationAreaM2 != null ? String(installationAreaM2) : '');
  }, [installationAreaM2]);

  const installationPrice =
    installationSelected && installationAreaM2 && installationAreaM2 >= 0.1
      ? Math.round(installationAreaM2 * INSTALLATION_RATE_PER_M2)
      : null;

  return (
    <div className="mb-8">
      <div className="border border-gray-200 bg-white transition-all">
        <button
          type="button"
          onClick={() => onInstallationToggle(!installationSelected)}
          className="w-full flex items-center justify-between p-4 group"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
              installationSelected ? "bg-brand-gold/20" : "bg-gray-100"
            )}>
              <Wrench size={16} className={installationSelected ? "text-brand-gold" : "text-gray-400"} />
            </div>
            <div className="text-left">
              <span className="font-semibold text-brand-dark text-sm block">
                Montáž & inštalácia
              </span>
              <span className="text-xs text-gray-400">sprostredkovaná služba</span>
            </div>
          </div>

          <div
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
              installationSelected ? "bg-brand-gold" : "bg-gray-300"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                installationSelected ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </button>

        {!installationSelected && (
          <div className="px-4 pb-4 -mt-1">
            <p className="text-xs text-gray-500">
              Chcete to bez starostí? Zabezpečíme montáž cez overeného partnera.
            </p>
          </div>
        )}

        <AnimatePresence>
          {installationSelected && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-5 space-y-4 border-t border-gray-100 pt-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Check size={12} className="text-brand-gold" />
                    Overený partner
                  </span>
                  <span className="flex items-center gap-1">
                    <Check size={12} className="text-brand-gold" />
                    Zameranie a doprava v cene
                  </span>
                  <span className="flex items-center gap-1">
                    <Check size={12} className="text-brand-gold" />
                    Bez starostí
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <label className="text-xs font-medium text-gray-600">
                      Plocha na opracovanie (m²)
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAreaTooltip(!showAreaTooltip);
                      }}
                      className={cn(
                        "w-6 h-6 lg:w-4 lg:h-4 rounded-full flex items-center justify-center transition-colors -m-1 p-1",
                        showAreaTooltip
                          ? "text-brand-gold"
                          : "text-gray-400 hover:text-gray-600"
                      )}
                      aria-label="Čo je plocha na opracovanie?"
                    >
                      <HelpCircle size={16} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAreaTooltip && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="bg-[#F9F9F7] border border-gray-100 p-3 mb-2 text-xs lg:text-[11px] text-gray-600 leading-relaxed space-y-2">
                          <p className="font-semibold text-brand-dark text-xs lg:text-[11px]">
                            Čo je plocha na opracovanie?
                          </p>
                          <p>
                            Je to súčet všetkých plôch (v m²), na ktoré sa bude montovať sinterovaný kameň — pracovné dosky, ostrovčeky, zásteny a pod.
                          </p>
                          <p className="font-semibold text-brand-dark text-xs lg:text-[11px] pt-1">
                            Ako merať?
                          </p>
                          <p>
                            Zmerajte dĺžku a šírku každej plochy v centimetroch, prepočítajte na metre (delené 100) a vynásobte. Sčítajte všetky plochy dohromady.
                          </p>
                          <div className="bg-white border border-gray-100 p-2.5 space-y-1.5 rounded">
                            <p className="font-semibold text-brand-dark text-xs lg:text-[11px]">Príklad:</p>
                            <div className="space-y-1 text-xs lg:text-[11px]">
                              <div className="flex justify-between">
                                <span>Ostrovček 120 × 90 cm</span>
                                <span className="font-medium text-brand-dark">1,08 m²</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kuchynská linka 320 × 60 cm</span>
                                <span className="font-medium text-brand-dark">1,92 m²</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Zástena 320 × 70 cm</span>
                                <span className="font-medium text-brand-dark">2,24 m²</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-1.5">
                                <span className="font-semibold text-brand-dark">Spolu</span>
                                <span className="font-bold text-brand-dark">5,24 m²</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-400 italic pt-1">
                            Nie ste si istí? Nevadí — nechajte pole prázdne, zakliknite montáž a my vás budeme kontaktovať o ďalšom postupe.
                          </p>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>

                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={localArea}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalArea(val);
                      startTransition(() => {
                        if (val === '') {
                          onAreaChange(null);
                        } else {
                          const num = parseFloat(val);
                          onAreaChange(isNaN(num) ? null : num);
                        }
                      });
                    }}
                    placeholder="napr. 2.5"
                    className="w-full px-4 py-2.5 border border-gray-200 text-base text-brand-dark bg-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder:text-gray-300"
                  />
                  <p className="text-xs lg:text-[11px] text-gray-400 mt-1">
                    Zadajte súčet všetkých plôch, ktoré sa budú opracovávať. Ak si nie ste istí, nechajte pole prázdne — budeme vás kontaktovať.
                  </p>
                </div>

                <div className="bg-[#F9F9F7] p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs lg:text-[11px] text-gray-500 block mb-1">Orientačná cena montáže</span>
                      <span className="text-xl font-bold text-brand-dark">
                        {installationPrice !== null ? (
                          <>{formatPrice(installationPrice)} <span className="text-xs lg:text-[11px] font-normal text-gray-400">s DPH</span></>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfo(!showInfo);
                      }}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                        showInfo
                          ? "bg-brand-gold/20 text-brand-gold"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      )}
                      aria-label="Informácie o cene montáže"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showInfo && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#F9F9F7] border border-gray-100 p-4 space-y-3 text-xs lg:text-[11px] text-gray-600 leading-relaxed">
                        <div>
                          <h4 className="font-semibold text-brand-dark text-xs lg:text-[11px] uppercase tracking-wider mb-1">
                            Ako sa počíta orientačná cena?
                          </h4>
                          <p>Zadáte plochu v m² a systém vypočíta orientačnú cenu podľa štandardnej sadzby za montáž.</p>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-brand-dark text-xs lg:text-[11px] uppercase tracking-wider mb-1">
                            Čo je v cene?
                          </h4>
                          <p>Cena zahŕňa zameranie, dopravu, opracovanie hrán, leštenie a montáž.</p>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-brand-dark text-xs lg:text-[11px] uppercase tracking-wider mb-1">
                            Orientačnosť
                          </h4>
                          <p>Ide o orientačnú cenu. Po obhliadke/zameraní sa môže mierne znížiť alebo zvýšiť podľa prístupu, členitosti, výrezov a detailov realizácie.</p>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-brand-dark text-xs lg:text-[11px] uppercase tracking-wider mb-1">
                            Presnosť
                          </h4>
                          <p>Ak zadáte správne rozmery, vo väčšine prípadov je výsledná cena veľmi blízko realite (cca 90 % prípadov).</p>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-brand-dark text-xs lg:text-[11px] uppercase tracking-wider mb-1">
                            Právne/transparentne
                          </h4>
                          <p>Montáž nepredávame priamo cez e-shop – službu iba sprostredkujeme. Cenu montáže hradíte priamo dodávateľovi služby. Finálnu ponuku a termín potvrdí montážny partner po zameraní.</p>
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                <p className="text-xs lg:text-[10px] text-gray-400 leading-snug">
                  Orientačná cena – potvrdí sa po zameraní. Cenu montáže hradíte priamo dodávateľovi služby, nie cez e-shop. Montáž sprostredkujeme cez montážneho partnera.
                </p>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
