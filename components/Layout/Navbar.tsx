import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, MessageSquare } from 'lucide-react';
import { NAV_LINKS } from '../../constants';
import { Button } from '../UI/Button';
import { motion, AnimatePresence } from 'framer-motion';
// useCart a useAuth odstránené - košík a účet sú iba v EshopApp.tsx

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  // openCart, itemCount, isAuthenticated odstránené - košík a účet sú iba v e-shope

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Logic: Transparent only at the very top of Home Page.
  // Everywhere else (or when scrolled): White/Glassy background.
  const isTransparent = location.pathname === '/' && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
          ? 'bg-transparent py-6'
          : 'bg-white/90 backdrop-blur-lg shadow-sm py-4'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <NavLink to="/" className="z-50 relative group">
          {/* Using text logo if image fails or for SEO, but keeping image as primary */}
          <img
            src="/images/logo.png"
            alt="OROSTONE"
            className={`transition-all duration-300 object-contain ${isTransparent ? 'h-14 brightness-0 invert' : 'h-12' // Invert logic assumes logo handles being white on dark bg, or remove invert if logo is gold
              }`}
          // Fallback style if no logo image:
          // className="h-10 w-auto" 
          />
        </NavLink>

        {/* DESKTOP NAV - CENTERED/RIGHT ALIGNED */}
        <nav className="hidden xl:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {NAV_LINKS.filter(l => l.label !== 'Kontakt').map((link) => (
              link.external ? (
                <a
                  key={link.path}
                  href={link.path}
                  className={`font-sans text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group py-2 ${
                    isTransparent
                      ? 'text-white hover:text-white/80'
                      : 'text-brand-dark hover:text-brand-gold'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-[1px] bg-brand-gold transition-all duration-300 w-0 group-hover:w-full"></span>
                </a>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-sans text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group py-2 ${isActive
                      ? 'text-brand-gold'
                      : isTransparent
                        ? 'text-white hover:text-white/80'
                        : 'text-brand-dark hover:text-brand-gold'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span className={`absolute bottom-0 left-0 h-[1px] bg-brand-gold transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </>
                  )}
                </NavLink>
              )
            ))}
          </div>

          {/* SEPARATOR */}
          <div className={`h-6 w-[1px] ${isTransparent ? 'bg-white/20' : 'bg-gray-200'}`}></div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            {/* Košík a účet odstránené - sú iba v e-shope (eshop.orostone.sk) */}

            <NavLink to="/kontakt">
              <span className={`font-sans text-[11px] font-bold tracking-[0.2em] uppercase transition-colors ${isTransparent ? 'text-white' : 'text-brand-dark'
                }`}>
                Kontakt
              </span>
            </NavLink>

            <NavLink to="/kontakt?openWizard=true">
              <Button
                variant={isTransparent ? 'outline' : 'primary'}
                className={`!py-2.5 !px-5 text-xs tracking-widest ${isTransparent ? '!border-white !text-white hover:!bg-white hover:!text-brand-dark' : ''
                  }`}
              >
                Nezáväzný dopyt
              </Button>
            </NavLink>
          </div>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className={`xl:hidden z-50 p-2 -mr-2 transition-colors ${isTransparent && !isOpen ? 'text-white' : 'text-brand-dark'
            }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-40 flex flex-col pt-32 px-8 h-screen xl:hidden"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                link.external ? (
                  <a
                    key={link.path}
                    href={link.path}
                    className="font-sans text-2xl font-light tracking-wide border-b border-gray-100 pb-4 flex justify-between items-center text-brand-dark hover:text-brand-gold"
                  >
                    {link.label}
                    <ArrowRight className="text-gray-300" size={20} />
                  </a>
                ) : (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `font-sans text-2xl font-light tracking-wide border-b border-gray-100 pb-4 flex justify-between items-center ${isActive ? 'text-brand-gold' : 'text-brand-dark'
                      }`
                    }
                  >
                    {link.label}
                    <ArrowRight className="text-gray-300" size={20} />
                  </NavLink>
                )
              ))}

              <div className="mt-8 space-y-4">
                <NavLink to="/kontakt?openWizard=true" className="block">
                  <Button className="w-full justify-between py-4" variant="primary">
                    Nezáväzný dopyt
                    <MessageSquare size={18} />
                  </Button>
                </NavLink>
              </div>
            </nav>

            <div className="font-sans mt-auto pb-12 text-center text-gray-400 text-xs tracking-widest uppercase">
              Orostone Premium Surfaces
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};