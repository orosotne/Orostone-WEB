import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { cn } from '@/lib/utils';
import { registerSchema, extractFieldErrors } from '@/lib/validations';

export const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength check
  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Zod validácia
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      agreedToTerms,
    });

    if (!result.success) {
      const errors = extractFieldErrors(result);
      setFieldErrors(errors);
      // Zobraz prvú chybu ako hlavnú správu
      const firstError = result.error.issues[0];
      setError(firstError.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp(result.data.email, result.data.password, result.data.name);
      
      if (error) {
        if (error.message.includes('already registered')) {
          setError('Používateľ s týmto emailom už existuje');
        } else {
          setError(error.message);
        }
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#F9F9F7] flex items-center justify-center py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              Registrácia úspešná!
            </h2>
            <p className="text-gray-500 mb-8">
              Na váš email <strong>{email}</strong> sme odoslali potvrdzovací odkaz. 
              Kliknite naň pre aktiváciu účtu.
            </p>
            <Link to="/login">
              <Button className="w-full bg-brand-dark text-white py-4 rounded-xl hover:bg-brand-gold hover:text-brand-dark">
                Prejsť na prihlásenie
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F9F7] flex items-center justify-center py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Vytvoriť účet</h1>
          <p className="text-gray-500">
            Máte už účet?{' '}
            <Link to="/login" className="text-brand-gold hover:underline font-medium">
              Prihláste sa
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                <AlertCircle size={20} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meno a priezvisko
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-brand-gold transition-all"
                  placeholder="Ján Novák"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-brand-gold transition-all"
                  placeholder="vas@email.sk"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heslo
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:border-brand-gold transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength */}
              {password && (
                <div className="mt-3 space-y-1.5">
                  {Object.entries({
                    'Min. 8 znakov': passwordStrength.hasMinLength,
                    'Veľké písmeno': passwordStrength.hasUppercase,
                    'Malé písmeno': passwordStrength.hasLowercase,
                    'Číslo': passwordStrength.hasNumber,
                  }).map(([label, valid]) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center",
                        valid ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {valid ? <CheckCircle size={12} /> : <span>○</span>}
                      </div>
                      <span className={valid ? "text-green-600" : "text-gray-500"}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potvrdiť heslo
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={cn(
                    "w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all",
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-brand-gold"
                  )}
                  placeholder="••••••••"
                />
              </div>
              {(fieldErrors.confirmPassword || (confirmPassword && password !== confirmPassword)) && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.confirmPassword || 'Heslá sa nezhodujú'}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Súhlasím s{' '}
                <Link to="/vop" className="text-brand-gold hover:underline">
                  obchodnými podmienkami
                </Link>{' '}
                a{' '}
                <Link to="/ochrana-sukromia" className="text-brand-gold hover:underline">
                  spracovaním osobných údajov
                </Link>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !agreedToTerms}
              className="w-full bg-brand-dark text-white py-4 rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Registrujem...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Vytvoriť účet
                  <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </main>
  );
};
