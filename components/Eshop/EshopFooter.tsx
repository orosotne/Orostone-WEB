import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Facebook, Instagram, Youtube, Mail, Phone, MapPin,
  CreditCard, Truck, Shield, Clock
} from 'lucide-react';
import { RotatingBadge } from '../UI/RotatingBadge';
import { getVisibleCategories } from './EshopMegaMenu';

const PAYMENT_MARKS = [
  { src: '/images/payments/visa.svg', alt: 'Visa' },
  { src: '/images/payments/mastercard.svg', alt: 'Mastercard' },
  { src: '/images/payments/apple-pay.svg', alt: 'Apple Pay' },
  { src: '/images/payments/google-pay.svg', alt: 'Google Pay' },
] as const;

// ===========================================
// COMPONENT
// ===========================================

export const EshopFooter: React.FC = () => {
  const { pathname } = useLocation();
  const isProductDetail = pathname.startsWith('/produkt/');

  return (
    <footer className={`bg-brand-dark text-white${isProductDetail ? ' pb-32 lg:pb-0' : ''}`}>
      
      {/* Trust Badges */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Truck size={24} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Doprava zadarmo</h4>
                <p className="text-xs text-gray-400">Pri objednavke nad 3 platne</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Záruka 24 mesiacov</h4>
                <p className="text-xs text-gray-400">Na všetky produkty</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <CreditCard size={24} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Bezpečná platba</h4>
                <p className="text-xs text-gray-400">Platobnou kartou</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Clock size={24} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Expedícia do 5 pracovných dní</h4>
                <p className="text-xs text-gray-400">Po prijatí platby</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="OROSTONE"
                className="h-10 brightness-0 invert mb-4"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Prémiové sinterované platne pre náročných zákazníkov. 
              Spájame odolnosť kameňa s precíznosťou moderných technológií.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/orostone.sk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors"
                aria-label="Orostone na Facebooku"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/orostone_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors"
                aria-label="Orostone na Instagrame"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.youtube.com/@orostone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors"
                aria-label="Orostone na YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Obchod</h4>
            <ul className="space-y-3">
              {getVisibleCategories().map((cat) => (
                <li key={cat.id}>
                  <Link to={`/kategoria/${cat.slug}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/blog" className="text-brand-gold hover:text-white text-sm transition-colors font-medium">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Zákaznícky servis</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://shopify.com/101386420570/account" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Môj účet
                </a>
              </li>
              <li>
                <a href="https://shopify.com/101386420570/account" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sledovanie objednávky
                </a>
              </li>
              <li>
                <Link to="/doprava" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Doprava a platba
                </Link>
              </li>
              <li>
                <Link to="/reklamacie" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Reklamácie a vrátenie
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <a href="tel:+421917588738" className="group">
                  <p className="text-white font-medium group-hover:text-brand-gold transition-colors">+421 917 588 738</p>
                  <p className="text-gray-400 text-xs">Po-Pia 8:00 – 17:00</p>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <a href="mailto:info@orostone.sk" className="text-white hover:text-brand-gold transition-colors">
                  info@orostone.sk
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <a href="https://www.google.com/maps?q=Landererova+8,+811+09+Bratislava" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Landererova 8<br />
                  811 09 Bratislava
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                <span>© {new Date().getFullYear()} Orostone</span>
                <span>•</span>
                <Link to="/vop" className="hover:text-white transition-colors">
                  Obchodné podmienky
                </Link>
                <span>•</span>
                <Link to="/ochrana-sukromia" className="hover:text-white transition-colors">
                  Ochrana súkromia
                </Link>
                <span>•</span>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
              <div className="text-[11px] leading-relaxed text-gray-500 max-w-2xl">
                Orostone s.r.o., Landererova 8, 811 09 Bratislava - mestská časť Staré Mesto, IČO: 55 254 772, DIČ: 2121930580, IČ DPH: SK2121930580. Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B.
              </div>
            </div>
            
            {/* Platobné značky — zobrazujte len to, čo máte zapnuté v Stripe Dashboard (Payment methods) */}
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end" aria-label="Podporované platobné metódy">
              <span className="text-[10px] sm:text-[11px] text-gray-500/90 shrink-0">Platobné metódy:</span>
              <div className="flex flex-wrap items-center gap-1 justify-center md:justify-end max-w-[min(100%,22rem)] md:max-w-none">
                {PAYMENT_MARKS.map(({ src, alt }) => (
                  <div
                    key={src}
                    className="bg-white/95 rounded-sm px-1 py-0.5 flex items-center justify-center h-7 min-w-[1.75rem] max-w-[3.5rem]"
                  >
                    <img
                      src={src}
                      alt={alt}
                      width={52}
                      height={16}
                      className="h-4 w-auto max-w-[3rem] object-contain object-center opacity-[0.88]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>

            <RotatingBadge onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          </div>
          
        </div>
      </div>
    </footer>
  );
};
