import React, { useState, useEffect } from 'react';
import { PRICING, MATERIAL_TIERS } from '../../pricing';
import { PRODUCTS } from '../../constants';
// @ts-ignore
import { Check, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';

interface Step4Props {
    shape: string;
    dimensions: any;
    selectedMaterial: string | null;
    details: any;
    onBack: () => void;
}

export const Step4Summary: React.FC<Step4Props> = ({ shape, dimensions, selectedMaterial, details, onBack }) => {
    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
    const [contact, setContact] = useState({ name: '', email: '', phone: '', city: '', note: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // Find product name
    const product = PRODUCTS.find(p => p.id === selectedMaterial);

    useEffect(() => {
        calculatePrice();
    }, []);

    const calculatePrice = () => {
        // 1. Area Calculation
        const d = dimensions;
        const depthM = d.depth / 100;
        const aM = d.a / 100;
        const bM = d.b / 100;
        const cM = (d.c || 0) / 100;

        let area = 0;
        if (shape === 'straight') area = aM * depthM;
        else if (shape === 'l-shape') area = aM * depthM + (bM - depthM) * depthM;
        else if (shape === 'u-shape') area = aM * depthM + (bM - depthM) * depthM + (cM - depthM) * depthM;
        else if (shape === 'island') area = aM * bM;

        // Backsplash area
        if (details.backsplash) {
            const heightM = details.backsplashHeight / 100;
            if (shape === 'straight') area += aM * heightM;
            else if (shape === 'l-shape') area += (aM + bM) * heightM;
            else if (shape === 'u-shape') area += (aM + bM + cM) * heightM;
        }

        // 2. Material Price
        // Get tier
        const tierKey = Object.keys(MATERIAL_TIERS).find(k => k.toLowerCase() === product?.collectionId.toLowerCase() || k.toLowerCase() === product?.name.toLowerCase()) || 'premium';
        // @ts-ignore
        let basePrice = PRICING.materialBase[MATERIAL_TIERS[tierKey]];

        // Thickness multiplier
        if (details.thickness === '20mm') {
            basePrice *= PRICING.processing.thickness20mmMultiplier;
        }

        let total = area * basePrice;

        // 3. Processing
        if (details.hobType === 'flush') total += PRICING.processing.cutoutPolished; // approximate as polished/complex
        else if (details.hobType === 'top') total += PRICING.processing.cutoutUnpolished;

        if (details.sinkType === 'undermount' || details.sinkType === 'flush') total += PRICING.processing.cutoutPolished;
        else if (details.sinkType === 'top') total += PRICING.processing.cutoutUnpolished;

        // 4. Installation
        total += PRICING.processing.installation;

        // Create range +/- 10%
        setPriceRange({
            min: Math.round(total * 0.9),
            max: Math.round(total * 1.1)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSent(true);
        setIsSubmitting(false);
    };

    if (isSent) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-green-600 w-10 h-10" />
                </div>
                <h2 className="text-3xl font-light mb-4">Dopyt odoslaný</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Vaša predbežná kalkulácia bola spracovaná. Naši špecialisti čoskoro overia dostupnosť materiálu
                    <strong> {product?.name}</strong> a pošlú Vám finálnu ponuku na <strong>{contact.email}</strong>.
                </p>
                <div className="p-6 bg-gray-50 rounded-orostone max-w-md mx-auto mb-8">
                    <p className="text-sm text-gray-500 mb-2">Orientačná cena</p>
                    <p className="text-3xl font-light text-brand-dark">
                        {priceRange?.min.toLocaleString()} € – {priceRange?.max.toLocaleString()} €
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/'}>Späť na domov</Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Summary */}
            <div>
                <h3 className="text-xl font-light mb-6 text-brand-dark">Zhrnutie projektu</h3>
                <div className="bg-gray-50 p-6 rounded-orostone space-y-4">
                    <SummaryItem label="Tvar" value={shape === 'straight' ? 'Rovná' : shape === 'l-shape' ? 'Tvar L' : shape === 'u-shape' ? 'Tvar U' : 'Ostrov'} />
                    <SummaryItem label="Materiál" value={product?.name || 'Nevybraný'} />
                    <SummaryItem label="Hrúbka" value={details.thickness} />
                    <SummaryItem label="Opracovanie" value={`${details.hobType !== 'none' ? 'Varná doska, ' : ''}${details.sinkType !== 'none' ? 'Drez' : ''}`} />
                    <SummaryItem label="Zástena" value={details.backsplash ? `Áno, výška ${details.backsplashHeight}cm` : 'Nie'} />

                    <div className="pt-4 border-t border-gray-200 mt-4">
                        <p className="text-sm text-gray-500 mb-1">Odhadovaná cena (s DPH a montážou)</p>
                        <div className="text-3xl font-light text-brand-dark">
                            {priceRange ? `${priceRange.min.toLocaleString()} € – ${priceRange.max.toLocaleString()} €` : 'Počítam...'}
                        </div>
                        <p className="text-xs text-brand-gold mt-2">* Cena je orientačná. Presnú sumu určíme po zameraní.</p>
                    </div>
                </div>
            </div>

            {/* Right: Contact Form */}
            <div>
                <h3 className="text-xl font-light mb-6 text-brand-dark">Kontaktné údaje</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Meno" value={contact.name} onChange={v => setContact({ ...contact, name: v })} required />
                    <Input label="Email" type="email" value={contact.email} onChange={v => setContact({ ...contact, email: v })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Telefón" type="tel" value={contact.phone} onChange={v => setContact({ ...contact, phone: v })} required />
                        <Input label="Mesto realizácie" value={contact.city} onChange={v => setContact({ ...contact, city: v })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Poznámka</label>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-orostone focus:border-brand-gold outline-none h-24"
                            value={contact.note}
                            onChange={e => setContact({ ...contact, note: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                            Späť
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Odosielam...</> : 'Odoslať nezáväzne'}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-4">
                        Odoslaním súhlasíte so spracovaním osobných údajov.
                    </p>
                </form>
            </div>
        </div>
    );
};

const SummaryItem = ({ label, value }: any) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
    </div>
);

const Input = ({ label, onChange, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
        <input
            className="w-full p-3 border border-gray-200 rounded-orostone focus:border-brand-gold outline-none"
            onChange={e => onChange(e.target.value)}
            {...props}
        />
    </div>
);
