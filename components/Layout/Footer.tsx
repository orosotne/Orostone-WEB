import React from 'react';
import { NAV_LINKS } from '../../constants';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#121212] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ECD488 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="block mb-6">
              <img
                src="/images/logo.png"
                alt="OROSTONE"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="font-sans font-light text-gray-400 text-sm leading-relaxed mb-6">
              Prémiové povrchy pre architektúru a dizajn. Spájame odolnosť kameňa s precíznosťou technológie.
            </p>
            <div className="font-sans text-brand-gold text-sm font-semibold">
              info@orostone.sk<br />
              +421 917 588 738
            </div>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-gray-500 mb-6">Menu</h3>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="font-sans text-sm text-gray-300 hover:text-brand-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-gray-500 mb-6">Materiály</h3>
            <ul className="space-y-4">
              <li className="font-sans font-light text-sm text-gray-300">Unita (Color Body)</li>
              <li className="font-sans font-light text-sm text-gray-300">Marbelito (Full Body)</li>
              <li className="font-sans font-light text-sm text-gray-300">Bianco (White Body)</li>
              <li className="font-sans font-light text-sm text-gray-300">Space Black</li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-gray-500 mb-6">Showroom</h3>
            <p className="font-sans font-light text-sm text-gray-300 mb-4">
              Dohodnite si stretnutie v našom showroome a pozrite si veľkoformátové dosky naživo.
            </p>
            <Link to="/kontakt" className="font-sans text-brand-gold text-sm underline underline-offset-4 hover:text-white transition-colors">
              Rezervovať termín
            </Link>
          </div>
        </div>

        <div className="font-sans flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600">
          <div className="flex gap-6">
            <span>© {new Date().getFullYear()} Orostone. Všetky práva vyhradené.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/ochrana-sukromia" className="hover:text-gray-400 transition-colors">Ochrana súkromia</Link>
            <Link to="/vop" className="hover:text-gray-400 transition-colors">VOP</Link>
            <Link to="/key-facts" className="hover:text-gray-400 transition-colors">Key facts</Link>
            <Link to="/cookies" className="hover:text-gray-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};