import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface Details {
    thickness: '12mm' | '20mm';
    sinkType: 'none' | 'top' | 'flush' | 'undermount';
    hobType: 'none' | 'top' | 'flush';
    backsplash: boolean;
    backsplashHeight: number;
}

interface Step3Props {
    details: Details;
    setDetails: (d: Details) => void;
    setNextDisabled: (d: boolean) => void;
}

export const Step3Details: React.FC<Step3Props> = ({ details, setDetails, setNextDisabled }) => {

    // Always valid unless we add strict requirements
    useEffect(() => {
        setNextDisabled(false);
    }, [setNextDisabled]);

    const handleChange = (field: keyof Details, value: any) => {
        setDetails({ ...details, [field]: value });
    };

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-light text-brand-dark">4. Opracovanie a Detaily</h3>

            {/* Thickness */}
            <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Hrúbka materiálu</label>
                <div className="flex gap-4">
                    <OptionCard
                        active={details.thickness === '12mm'}
                        onClick={() => handleChange('thickness', '12mm')}
                        label="12 mm"
                        desc="Elegantná, minimalistická, štandardná."
                    />
                    <OptionCard
                        active={details.thickness === '20mm'}
                        onClick={() => handleChange('thickness', '20mm')}
                        label="20 mm"
                        desc="Masívnejšia, vhodná pre klasický vzhľad."
                    />
                </div>
            </div>

            {/* Cutouts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cooking */}
                <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Varná Doska</label>
                    <select
                        className="w-full p-3 border border-gray-200 rounded focus:border-brand-gold outline-none"
                        value={details.hobType}
                        onChange={(e) => handleChange('hobType', e.target.value)}
                    >
                        <option value="none">Žiadna / Už mám otvor</option>
                        <option value="top">Horná montáž (Naložená)</option>
                        <option value="flush">Do roviny (Zapustená) - Drahšie opracovanie</option>
                    </select>
                </div>

                {/* Sink */}
                <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Drez</label>
                    <select
                        className="w-full p-3 border border-gray-200 rounded focus:border-brand-gold outline-none"
                        value={details.sinkType}
                        onChange={(e) => handleChange('sinkType', e.target.value)}
                    >
                        <option value="none">Žiadny</option>
                        <option value="top">Horná montáž (Naložený)</option>
                        <option value="undermount">Spodná montáž (Lepený zdola) - Vyžaduje leštený výrez</option>
                        <option value="flush">Do roviny (Zapustený)</option>
                    </select>
                </div>
            </div>

            {/* Backsplash */}
            <div className="p-6 border border-gray-100 bg-gray-50 rounded">
                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="checkbox"
                        id="backsplash"
                        checked={details.backsplash}
                        onChange={(e) => handleChange('backsplash', e.target.checked)}
                        className="w-5 h-5 accent-brand-gold"
                    />
                    <label htmlFor="backsplash" className="font-medium text-brand-dark">Mám záujem o zástenu z rovnakého materiálu</label>
                </div>

                {details.backsplash && (
                    <div className="ml-8">
                        <label className="block text-sm text-gray-600 mb-1">Výška zásteny (cm)</label>
                        <input
                            type="number"
                            className="w-32 p-2 border border-gray-200 rounded"
                            value={details.backsplashHeight}
                            onChange={(e) => handleChange('backsplashHeight', parseInt(e.target.value) || 0)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const OptionCard = ({ active, onClick, label, desc }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 p-4 border-2 rounded text-left transition-all ${active ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-200 hover:border-brand-gold/50'}`}
    >
        <div className="flex items-center justify-between mb-1">
            <span className={`font-bold ${active ? 'text-brand-dark' : 'text-gray-600'}`}>{label}</span>
            {active && <Check size={18} className="text-brand-gold" />}
        </div>
        <p className="text-xs text-gray-500">{desc}</p>
    </button>
);
