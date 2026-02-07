import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { cn } from '@/lib/utils';
import { loginSchema, extractFieldErrors } from '@/lib/validations';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect path from location state
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Zod validácia
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(extractFieldErrors(result));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(result.data.email, result.data.password);
      
      if (error) {
        setError(error.message === 'Invalid login credentials' 
          ? 'Nesprávny email alebo heslo'
          : error.message
        );
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F7] flex items-center justify-center py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Vitajte späť</h1>
          <p className="text-gray-500">
            Nemáte účet?{' '}
            <Link to="/register" className="text-brand-gold hover:underline font-medium">
              Zaregistrujte sa
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                  required
                  className={cn(
                    "w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all",
                    fieldErrors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-brand-gold"
                  )}
                  placeholder="vas@email.sk"
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Heslo
                </label>
                <Link to="/forgot-password" className="text-sm text-brand-gold hover:underline">
                  Zabudli ste heslo?
                </Link>
              </div>
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
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-dark text-white py-4 rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Prihlasujem...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Prihlásiť sa
                  <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">alebo</span>
            </div>
          </div>

          {/* Guest Checkout */}
          <Link to="/checkout">
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50"
            >
              Pokračovať ako hosť
            </Button>
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Výhody registrácie:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">✓ História objednávok</span>
            <span className="flex items-center gap-1">✓ Rýchlejší checkout</span>
            <span className="flex items-center gap-1">✓ Uložené adresy</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
