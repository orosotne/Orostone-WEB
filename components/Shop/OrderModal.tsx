import React, { useState, useEffect } from 'react';
import { X, Check, Send, FileText, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopProduct } from '../../constants';
import { submitQuote } from '../../services/quotes.service';
import { orderInquirySchema, extractFieldErrors } from '../../lib/validations';

interface OrderModalProps {
    product: ShopProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreedToVOP, setAgreedToVOP] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Form fields
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formNote, setFormNote] = useState('');

    // Calculate price - 3200x1600mm = 5.12m² per slab
    const slabArea = 3.2 * 1.6; // 5.12 m²
    const totalArea = quantity * slabArea;
    const totalPrice = product ? (totalArea * product.pricePerM2) : 0;

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setIsSubmitted(false);
            setIsSubmitting(false);
            setAgreedToVOP(false);
            setSubmitError(null);
            setFormName('');
            setFormEmail('');
            setFormPhone('');
            setFormNote('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        
        setSubmitError(null);
        setFieldErrors({});

        // Zod validácia
        const result = orderInquirySchema.safeParse({
            name: formName,
            email: formEmail,
            phone: formPhone,
            note: formNote || undefined,
            quantity,
            agreedToVOP,
        });

        if (!result.success) {
            const errors = extractFieldErrors(result);
            setFieldErrors(errors);
            const firstError = result.error.issues[0];
            setSubmitError(firstError.message);
            return;
        }

        setIsSubmitting(true);

        try {
            const description = [
                `Produkt: ${product.name}`,
                `SKU: ${product.sku || product.id}`,
                `Počet platní: ${quantity}`,
                `Rozmer: ${product.dimensions}`,
                `Hrúbka: ${product.thickness}`,
                `Celková plocha: ${totalArea.toFixed(2)} m²`,
                `Orientačná cena: €${totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
                formNote ? `Poznámka: ${formNote}` : '',
            ].filter(Boolean).join('\n');

            const result = await submitQuote({
                name: formName,
                email: formEmail,
                phone: formPhone,
                description,
            });

            if (result.success) {
                setIsSubmitted(true);
            } else {
                setSubmitError(result.error || 'Nepodarilo sa odoslať objednávku. Skúste to znova.');
            }
        } catch (error) {
            setSubmitError('Nastala neočakávaná chyba. Skúste to prosím neskôr.');
            console.error('OrderModal submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-2xl rounded-orostone shadow-2xl overflow-hidden z-10 grid md:grid-cols-2"
                >
                    {/* Left Side - Product Info */}
                    <div className="bg-stone-50 p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-semibold tracking-wider text-stone-500 uppercase mb-2">Vybraný model</h3>
                            <h2 className="text-3xl font-sans font-bold text-stone-900 mb-4">{product.name}</h2>
                            <div className="aspect-[4/3] rounded-orostone overflow-hidden mb-6 shadow-md">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-2 text-sm text-stone-600">
                                <div className="flex justify-between border-b border-stone-200 pb-2">
                                    <span>Rozmer</span>
                                    <span className="font-medium text-stone-900">{product.dimensions}</span>
                                </div>
                                <div className="flex justify-between border-b border-stone-200 pb-2">
                                    <span>Hrúbka</span>
                                    <span className="font-medium text-stone-900">{product.thickness}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span>Cena za m²</span>
                                    <span className="font-medium text-stone-900">€{product.pricePerM2}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-brand-gold/10 rounded-orostone border border-brand-gold/20">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-stone-700 font-medium">Spolu (orientačne)</span>
                                <span className="text-2xl font-sans font-bold text-brand-dark">
                                    €{totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <p className="text-xs text-stone-500 text-right">bez DPH</p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="p-6 md:p-8 bg-white flex flex-col max-h-[80vh] md:max-h-[600px] overflow-y-auto">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors"
                        >
                            <X size={20} className="text-stone-400" />
                        </button>

                        {isSubmitted ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <Check size={32} />
                                </div>
                                <h3 className="text-2xl font-sans font-bold text-stone-900">Objednávka odoslaná</h3>
                                <p className="text-stone-600">Ďakujeme za váš záujem. Do 24 hodín vás budeme kontaktovať s potvrdením dostupnosti a presnou cenovou ponukou dopravy.</p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
                                >
                                    Zavrieť
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-xl font-sans font-bold text-stone-900 mb-2">Nezáväzná objednávka</h3>
                                    <p className="text-sm text-stone-500">Vyplňte formulár a my sa vám ozveme pre potvrdenie.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Počet platní (ks)</label>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-stone-700"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="w-20 text-center font-sans font-light text-lg py-2 border-b border-stone-200 focus:outline-none focus:border-stone-900 bg-white text-stone-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(q => q + 1)}
                                                className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-stone-700"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-xs text-stone-400 mt-2">1 platňa = {slabArea.toFixed(2)} m²</p>
                                        
                                        {/* Celková plocha objednávky */}
                                        <div className="mt-3 p-3 bg-stone-50 rounded-lg">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-stone-600">Celková plocha:</span>
                                                <span className="font-semibold text-stone-900">{totalArea.toFixed(2)} m²</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-stone-100">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Meno a Priezvisko</label>
                                            <input required type="text" value={formName} onChange={(e) => { setFormName(e.target.value); setFieldErrors(prev => ({ ...prev, name: '' })); }} className={`w-full px-4 py-2 border ${fieldErrors.name ? 'border-red-300' : 'border-stone-200'} rounded-lg focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all bg-white text-stone-900`} />
                                            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                            <input required type="email" value={formEmail} onChange={(e) => { setFormEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }} className={`w-full px-4 py-2 border ${fieldErrors.email ? 'border-red-300' : 'border-stone-200'} rounded-lg focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all bg-white text-stone-900`} />
                                            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Tel. číslo</label>
                                            <input required type="tel" value={formPhone} onChange={(e) => { setFormPhone(e.target.value); setFieldErrors(prev => ({ ...prev, phone: '' })); }} className={`w-full px-4 py-2 border ${fieldErrors.phone ? 'border-red-300' : 'border-stone-200'} rounded-lg focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all bg-white text-stone-900`} />
                                            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Poznámka (voliteľné)</label>
                                            <textarea rows={2} value={formNote} onChange={(e) => setFormNote(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all bg-white text-stone-900"></textarea>
                                        </div>
                                    </div>

                                    {/* Error message */}
                                    {submitError && (
                                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                                            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-600">{submitError}</p>
                                        </div>
                                    )}

                                    {/* VOP Checkbox */}
                                    <div className="pt-4 border-t border-stone-100 space-y-3">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                required
                                                checked={agreedToVOP}
                                                onChange={(e) => setAgreedToVOP(e.target.checked)}
                                                className="mt-0.5 w-4 h-4 rounded border-stone-300 text-brand-gold focus:ring-brand-gold focus:ring-offset-0 cursor-pointer"
                                            />
                                            <span className="text-xs text-stone-500 group-hover:text-stone-700 transition-colors">
                                                Súhlasím s{' '}
                                                <a href="#/vop#eshop-uvod" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-gold" onClick={(e) => e.stopPropagation()}>
                                                    VOP pre e-shop
                                                </a>
                                                {' '}a{' '}
                                                <a href="#/ochrana-sukromia" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-gold" onClick={(e) => e.stopPropagation()}>
                                                    spracovaním osobných údajov
                                                </a>
                                            </span>
                                        </label>
                                        
                                        <a
                                            href="#/vop"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 text-xs text-stone-400 hover:text-brand-gold transition-colors"
                                        >
                                            <FileText size={14} />
                                            <span>Prečítať VOP pre e-shop (sekcie 11–15)</span>
                                        </a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !agreedToVOP}
                                        className="w-full py-4 mt-4 bg-brand-gold text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-gold"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Odosielam...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Odoslať objednávku
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-center text-stone-400 mt-2">
                                        Toto je nezáväzná objednávka.
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
