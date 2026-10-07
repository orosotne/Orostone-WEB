import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, CheckCircle, Loader2 } from 'lucide-react';
import { useCookies } from '../../context/CookieContext';
import { Container, useDrawIn, IconWarranty, IconSecurePay, IconDispatch, IconDelivery } from '../Design';
// Dynamic import — keeps supabase out of the initial bundle
const loadNewsletter = () => import('../../services/newsletter.service');

const PAYMENT_MARKS = [
  { src: '/images/payments/visa.svg', alt: 'Visa' },
  { src: '/images/payments/mastercard.svg', alt: 'Mastercard' },
  { src: '/images/payments/apple-pay.svg', alt: 'Apple Pay' },
  { src: '/images/payments/google-pay.svg', alt: 'Google Pay' },
] as const;

const TRUST = [
  { Icon: IconWarranty, title: '24 mesiacov na reklamáciu', text: 'Zákonná zodpovednosť za vady' },
  { Icon: IconSecurePay, title: 'Bezpečná platba', text: 'Platobnou kartou' },
  { Icon: IconDispatch, title: 'Expedícia do 5 pracovných dní', text: 'Po prijatí platby' },
  { Icon: IconDelivery, title: 'Doručenie po celom Slovensku', text: 'Špeciálna preprava platní' },
] as const;

const SHOPIFY_ACCOUNT_URL = 'https://shopify.com/101386420570/account';

const colTitle = 'mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-brand-gold';
const colLink = 'text-brand-light/[0.84] no-underline transition-colors hover:text-brand-light hover:underline hover:underline-offset-4';

// ===========================================
// NEWSLETTER WIDGET
// ===========================================

const NewsletterWidget: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { subscribeToNewsletter } = await loadNewsletter();
    const result = await subscribeToNewsletter({ email, source: 'footer' });
    if (result.success) {
      setStatus('success');
      setMsg(result.alreadySubscribed ? 'Tento e-mail je už prihlásený.' : 'Ďakujeme za prihlásenie!');
    } else {
      setStatus('error');
      setMsg('Niečo sa nepodarilo. Skúste to znova.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-brand-gold">
        <CheckCircle size={16} />
        <span>{msg}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="footer-newsletter" className="sr-only">Váš e-mail</label>
        <input
          id="footer-newsletter"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vas@email.sk"
          className="min-h-[46px] flex-1 rounded-[10px] border border-brand-light/20 bg-brand-light/5 px-4 text-sm text-brand-light placeholder:text-brand-light/40 transition-colors focus:border-brand-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex min-h-[46px] flex-shrink-0 items-center justify-center rounded-[10px] bg-brand-light px-5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-brand-dark transition-colors hover:bg-white disabled:opacity-60"
        >
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Odoberať'}
        </button>
      </div>
      {status === 'error' && <p className="text-xs text-red-300">{msg}</p>}
      <p className="text-[0.78rem] leading-relaxed text-brand-light/50">
        Prihlásením súhlasíte so zasielaním noviniek. Odhlásiť sa môžete kedykoľvek.{' '}
        <Link to="/ochrana-sukromia" target="_blank" className="underline hover:text-brand-light">Ochrana súkromia</Link>
      </p>
    </form>
  );
};

// ===========================================
// FOOTER COMPONENT
// ===========================================

interface EshopCategory {
  id: string;
  slug: string;
  name: string;
}

interface FooterProps {
  categories?: EshopCategory[];
  isProductDetail?: boolean;
  /** /vzorky: shorter footer without the trust strip and the newsletter, so the order stays the focus */
  compactOrder?: boolean;
}

const FooterComponent: React.FC<FooterProps> = ({ categories = [], isProductDetail = false, compactOrder = false }) => {
  const { openSettings } = useCookies();
  const draw = useDrawIn<HTMLDivElement>();

  return (
    <footer
      className={`os-on-dark relative overflow-hidden bg-brand-dark bg-noise pt-[clamp(56px,7vw,88px)] text-brand-light ${isProductDetail ? 'pb-32 lg:pb-8' : 'pb-8'}`}
    >
      {/* Trust strip */}
      {!compactOrder && <Container>
        <div
          ref={draw.ref}
          className={`mb-12 grid grid-cols-1 gap-9 border-b border-brand-light/15 pb-[clamp(56px,7vw,88px)] sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 ${draw.className}`}
        >
          {TRUST.map(({ Icon, title, text }, i) => (
            <div key={title} className="os-ico-item grid justify-items-center gap-1 text-center" style={{ '--d': `${i * 0.14}s` } as React.CSSProperties}>
              <Icon className="mb-3.5 h-12 w-12" />
              <p className="text-[0.92rem] font-semibold">{title}</p>
              <p className="text-[0.82rem] font-normal text-brand-light/60">{text}</p>
            </div>
          ))}
        </div>
      </Container>}

      {/* Main footer */}
      <Container className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] lg:gap-8">
        <div className="grid content-start gap-5">
          <Link to="/" aria-label="OROSTONE, hlavná stránka">
            <img src="/images/orostone-logo.svg" alt="OROSTONE" width={136} height={27} className="h-auto w-[136px] brightness-0 invert" />
          </Link>
          <p className="max-w-[32ch] text-[0.92rem] text-brand-light/60">
            Sinterované platne pre náročných zákazníkov. Spájame odolnosť kameňa s precíznosťou moderných technológií.
          </p>
          {!compactOrder && (
            <div className="grid max-w-sm gap-2">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-brand-light/60">Odoberajte novinky</p>
              <NewsletterWidget />
            </div>
          )}
          <div className="flex items-center gap-3">
            {[
              { href: 'https://www.facebook.com/orostone.sk', label: 'Orostone na Facebooku', Icon: Facebook },
              { href: 'https://www.instagram.com/orostone_', label: 'Orostone na Instagrame', Icon: Instagram },
              { href: 'https://www.youtube.com/@orostone', label: 'Orostone na YouTube', Icon: Youtube },
            ].map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-brand-light/20 text-brand-light/80 transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <Icon size={17} strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Obchod" className="grid content-start gap-2.5 text-[0.92rem]">
          <h3 className={colTitle}>Obchod</h3>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/kategoria/${cat.slug}`} className={colLink}>{cat.name}</Link>
          ))}
          <Link to="/kuchyne" className={colLink}>Kuchyne</Link>
          <Link to="/cennik" className={colLink}>Cenník</Link>
          <Link to="/vzorky" className={colLink}>Vzorky</Link>
          <Link to="/vyhody" className={colLink}>Výhody</Link>
          <Link to="/realizacie" className={colLink}>Realizácie</Link>
          <Link to="/blog" className={colLink}>Blog</Link>
        </nav>

        <nav aria-label="Zákaznícky servis" className="grid content-start gap-2.5 text-[0.92rem]">
          <h3 className={colTitle}>Zákaznícky servis</h3>
          <a href={SHOPIFY_ACCOUNT_URL} className={colLink}>Môj účet</a>
          <a href={SHOPIFY_ACCOUNT_URL} className={colLink}>Sledovanie objednávky</a>
          <Link to="/doprava" className={colLink}>Doprava a platba</Link>
          <Link to="/reklamacie" className={colLink}>Reklamácie a vrátenie</Link>
          <Link to="/odstupenie-od-zmluvy" className={colLink}>Odstúpenie od zmluvy</Link>
          <Link to="/kontakt" className={colLink}>Kontakt</Link>
          <Link to="/kariera" className={`${colLink} inline-flex items-center gap-2`}>
            <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
            Kariéra — hľadáme kolegov
          </Link>
        </nav>

        <div className="grid content-start gap-4 text-[0.92rem]">
          <h3 className={colTitle}>Kontakt</h3>
          <a href="tel:+421917588738" className="group grid gap-0.5 no-underline">
            <span className="font-medium tabular-nums text-brand-light group-hover:underline group-hover:underline-offset-4">+421 917 588 738</span>
            <span className="text-[0.8rem] text-brand-light/60">Po–Pia 8:00 – 17:00</span>
          </a>
          <a href="mailto:dopyt@orostone.sk" className="group grid gap-0.5 no-underline">
            <span className="text-brand-light group-hover:underline group-hover:underline-offset-4">dopyt@orostone.sk</span>
            <span className="text-[0.8rem] text-brand-light/60">Cenové ponuky a dopyty</span>
          </a>
          <a href="mailto:info@orostone.sk" className="group grid gap-0.5 no-underline">
            <span className="text-brand-light group-hover:underline group-hover:underline-offset-4">info@orostone.sk</span>
            <span className="text-[0.8rem] text-brand-light/60">Administratíva a faktúry</span>
          </a>
          <a href="https://www.google.com/maps?q=SNP+113%2F1%2C+956+18+Bo%C5%A1any" target="_blank" rel="noopener noreferrer" className="group grid gap-0.5 no-underline">
            <span className="text-brand-light group-hover:underline group-hover:underline-offset-4">SNP 113/1, 956 18 Bošany</span>
            <span className="text-[0.8rem] text-brand-light/60">Showroom — tu nás nájdete</span>
          </a>
          {/* Zámerne bez odkazu na mapu — klienti si sídlo mýlili so showroomom. */}
          <div className="grid gap-0.5">
            <span className="text-brand-light/60">Landererova 8, 811 09 Bratislava</span>
            <span className="text-[0.8rem] text-brand-light/45">Sídlo a fakturačná adresa, nie showroom</span>
          </div>
        </div>
      </Container>

      {/* Legal bar */}
      <Container>
        <div className="mt-14 flex flex-col gap-6 border-t border-brand-light/15 pt-6 text-[0.8rem] text-brand-light/60 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 [&>a]:py-1.5 [&>button]:py-1.5">
              <span>© {new Date().getFullYear()} Orostone</span>
              <Link to="/vop" className="hover:text-brand-light hover:underline">Obchodné podmienky</Link>
              <Link to="/podmienky-rezervacie-ceny" className="hover:text-brand-light hover:underline">Rezervačný poplatok</Link>
              <Link to="/ochrana-sukromia" className="hover:text-brand-light hover:underline">Ochrana súkromia</Link>
              <Link to="/cookies" className="hover:text-brand-light hover:underline">Cookies</Link>
              <button onClick={openSettings} className="hover:text-brand-light hover:underline">Nastavenia cookies</button>
            </div>
            <p className="max-w-2xl text-[0.74rem] leading-relaxed text-brand-light/45">
              Orostone s.r.o., Landererova 8, 811 09 Bratislava - mestská časť Staré Mesto, IČO: 55 254 772, DIČ: 2121930580, IČ DPH: SK2121930580. Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B.
            </p>
            <p className="text-[0.74rem] text-brand-light/45">
              Alternatívne riešenie sporov:{' '}
              <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-brand-light/80">Slovenská obchodná inšpekcia (SOI)</a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Podporované platobné metódy">
            <span className="text-[0.74rem] text-brand-light/45">Platobné metódy:</span>
            {PAYMENT_MARKS.map(({ src, alt }) => (
              <span key={src} className="flex h-7 min-w-[1.75rem] max-w-[3.5rem] items-center justify-center rounded-sm bg-white/95 px-1 py-0.5">
                <img src={src} alt={alt} width={52} height={16} className="h-4 w-auto max-w-[3rem] object-contain opacity-[0.88]" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* Large logo watermark */}
      <Container className="mt-14 opacity-[0.07]" aria-hidden="true">
        <img src="/images/orostone-logo.svg" alt="" width={1168} height={230} loading="lazy" className="h-auto w-full brightness-0 invert" />
      </Container>
    </footer>
  );
};

// Memoized export — Footer dostáva `categories` (stabilná referencia z module-level cache)
// a booleany `isProductDetail` a `compactOrder` z layoutu, takže sa re-renderuje len keď sa
// skutočne zmení identita kategórií alebo sa prepne na/z detail produktu či /vzorky.
export const Footer = React.memo(FooterComponent);
