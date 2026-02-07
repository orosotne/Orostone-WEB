import React, { useEffect } from 'react';
import { PRODUCTS } from '../../constants';
// @ts-ignore - pricing.ts is in root in the actual project structure but TS might expect relative path correct logic. 
// Assuming Calculator is in pages/Calculator.tsx and Step2 is in components/Calculator/Step2.tsx
import { MATERIAL_TIERS, PRICING } from '../../pricing';
import { Check } from 'lucide-react';

interface Step2Props {
    selectedMaterial: string | null;
    setSelectedMaterial: (id: string) => void;
    setNextDisabled: (disabled: boolean) => void;
}

export const Step2Material: React.FC<Step2Props> = ({ selectedMaterial, setSelectedMaterial, setNextDisabled }) => {

    // Disable next button if no material is selected
    useEffect(() => {
        setNextDisabled(!selectedMaterial);
    }, [selectedMaterial, setNextDisabled]);

    return (
        <div>
            <h3 className="text-xl font-light mb-6 text-brand-dark">3. Vyberte dekor</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {PRODUCTS.map((product) => {
                    // Determine tier and price indication
                    const tier = MATERIAL_TIERS[product.collectionId] || MATERIAL_TIERS[product.name] || 'premium';
                    // Note: mapping logic might need adjustment if MATERIAL_TIERS keys don't match exactly. 
                    // In pricing.ts we had 'UNITA', 'BIANCO' etc which match collection names mostly.
                    // Let's use collectionId matching if possible or fallback.
                    // Actually PRODUCTS has 'collectionId': 'unita', 'marbelito', etc. and 'name': 'Carrara Statuario'.
                    // In pricing.ts keys are uppercase 'UNITA'. Let's normalize.

                    const tierKey = Object.keys(MATERIAL_TIERS).find(k => k.toLowerCase() === product.collectionId.toLowerCase() || k.toLowerCase() === product.name.toLowerCase()) || 'premium';
                    const priceTier = MATERIAL_TIERS[tierKey];
                    const priceIndicator = priceTier === 'economy' ? '€' : priceTier === 'premium' ? '€€' : '€€€';

                    return (
                        <div
                            key={product.id}
                            onClick={() => setSelectedMaterial(product.id)}
                            className={`cursor-pointer group relative rounded-orostone overflow-hidden border-2 transition-all duration-300 ${selectedMaterial === product.id ? 'border-brand-gold ring-2 ring-brand-gold/20' : 'border-transparent hover:border-gray-200'
                                }`}
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Selection Badge */}
                                {selectedMaterial === product.id && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="bg-brand-gold text-white rounded-full p-2">
                                            <Check size={24} />
                                        </div>
                                    </div>
                                )}
                                {/* Price Badge */}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-brand-dark">
                                    {priceIndicator}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50">
                                <h4 className="font-medium text-brand-dark truncate">{product.name}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">{product.finish}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-orostone flex items-start gap-3">
                <div className="text-brand-gold mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                </div>
                <p className="text-sm text-gray-600">
                    Cena materiálu závisí od zvoleného dekoru. Zobrazené ceny sú orientačné, pre konkrétnu ponuku nás kontaktujte.
                    Všetky materiály sú dostupné v hrúbke 12mm, vybrané aj v 20mm.
                </p>
            </div>
        </div>
    );
};
