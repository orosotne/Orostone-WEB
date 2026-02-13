import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Youtube, Mail, Phone, MapPin,
  CreditCard, Truck, Shield, Clock
} from 'lucide-react';

// ===========================================
// COMPONENT
// ===========================================

export const EshopFooter: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white">
      
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
                <p className="text-xs text-gray-400">Pri objednávke nad 200€</p>
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
                <p className="text-xs text-gray-400">Kartou alebo prevodom</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Clock size={24} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Expedícia do 5 dní</h4>
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
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Obchod</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/kategoria/mramor" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Mramor
                </Link>
              </li>
              <li>
                <Link to="/kategoria/granit" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Granit
                </Link>
              </li>
              <li>
                <Link to="/kategoria/beton" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Betón
                </Link>
              </li>
              <li>
                <Link to="/kategoria/drevo" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Drevo
                </Link>
              </li>
              <li>
                <Link to="/vypredaj" className="text-red-400 hover:text-red-300 text-sm transition-colors">
                  Výpredaj
                </Link>
              </li>
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
                <Link to="/ucet" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Môj účet
                </Link>
              </li>
              <li>
                <Link to="/objednavky" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sledovanie objednávky
                </Link>
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
                <div>
                  <p className="text-white font-medium">+421 900 123 456</p>
                  <p className="text-gray-400 text-xs">Po-Pi: 9:00-17:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <a href="mailto:eshop@orostone.sk" className="text-white hover:text-brand-gold transition-colors">
                  eshop@orostone.sk
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  Showroom Bratislava<br />
                  Po dohode
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Platobné metódy:</span>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-[10px] font-bold text-blue-600">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-[10px] font-bold text-orange-500">MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-[10px] font-bold text-green-600">SEPA</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back to main site */}
          <div className="mt-4 text-center">
            <a 
              href="https://www.orostone.sk" 
              className="text-xs text-gray-500 hover:text-brand-gold transition-colors"
            >
              ← Späť na www.orostone.sk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
