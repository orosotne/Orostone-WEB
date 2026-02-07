import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Upload, X, FileText, Image, File, Loader2, Send } from 'lucide-react';
import { Button } from '../UI/Button';
import { submitQuote } from '../../services/quotes.service';
import { isFileAllowed, formatFileSize } from '../../services/storage.service';
import type { QuoteFormData } from '../../types/database.types';

// Ikona podľa typu súboru
const FileIcon = ({ type }: { type: string }) => {
  if (type.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
  if (type === 'application/pdf') return <FileText size={16} className="text-red-500" />;
  return <File size={16} className="text-gray-500" />;
};

export const QuoteWizard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    phone: '',
    email: '',
    description: '',
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Spracovanie súborov
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach(file => {
      if (isFileAllowed(file)) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name} - nepodporovaný formát alebo príliš veľký`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      setTimeout(() => setError(null), 5000);
    }

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Validácia formulára
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      agreedToTerms
    );
  };

  // Odoslanie formulára
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitQuote(formData);
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Nastala chyba pri odosielaní dopytu');
      }
    } catch (err) {
      setError('Neočakávaná chyba. Skúste to prosím znova.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset pri zatvorení
  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      description: '',
      files: []
    });
    setIsSubmitted(false);
    setError(null);
    setAgreedToTerms(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Content */}
        <div className="p-8 md:p-10 overflow-y-auto">
          {!isSubmitted ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-sans font-bold text-brand-dark mb-2">Nezáväzný dopyt</h2>
                <p className="text-gray-500 text-sm">Vyplňte formulár a ozveme sa vám do 24 hodín</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl whitespace-pre-line">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Meno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Meno a priezvisko *
                  </label>
                  <input
                    type="text"
                    placeholder="Ján Novák"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none transition-all"
                    required
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>

                {/* Telefón a Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefón *
                    </label>
                    <input
                      type="tel"
                      placeholder="+421 9XX XXX XXX"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none transition-all"
                      required
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="vas@email.sk"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none transition-all"
                      required
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                </div>

                {/* Popis projektu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Popis projektu
                  </label>
                  <textarea
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none transition-all min-h-[120px] resize-none"
                    placeholder="Opíšte váš projekt - typ (kuchyňa, kúpeľňa...), rozmery, materiál, alebo akékoľvek otázky..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>
                
                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Prílohy <span className="text-gray-400 font-normal">(nepovinné)</span>
                  </label>
                  <div 
                    className="p-5 border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl text-center cursor-pointer hover:bg-gray-100 hover:border-brand-gold/50 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                    <span className="text-sm text-gray-600 block">Kliknite pre nahratie súborov</span>
                    <span className="text-xs text-gray-400 block mt-1">Fotky, náčrty, PDF (max 50MB)</span>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      multiple
                      accept=".jpg,.jpeg,.png,.webp,.pdf,.dwg,.dxf"
                      onChange={handleFileSelect}
                    />
                  </div>
                  
                  {/* Uploaded Files List */}
                  {formData.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.files.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileIcon type={file.type} />
                            <div>
                              <span className="text-sm text-gray-700 block truncate max-w-[180px]">{file.name}</span>
                              <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Súhlas */}
                <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-5 h-5 accent-brand-gold rounded cursor-pointer" 
                  />
                  <span>
                    Súhlasím so spracovaním osobných údajov pre účely spracovania dopytu a cenovej ponuky.
                  </span>
                </label>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2"
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Odosielam...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Odoslať dopyt
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-sans font-bold text-brand-dark mb-4">Ďakujeme!</h2>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Váš dopyt sme úspešne prijali. Ozveme sa vám do 24 hodín.
              </p>
              <Button onClick={handleClose} variant="outline" className="rounded-xl">
                Zavrieť
              </Button>
            </div>
          )}
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>
      </motion.div>
    </div>
  );
};
