import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import { submitSampleLead } from '../../services/quotes.service';
import { trackMetaEvent } from '../../hooks/useMetaPixel';
import { trackGA4Event } from '../../services/analytics';
import { subscribeToNewsletter } from '../../services/newsletter.service';
import { useHoneypot } from '../../hooks/useHoneypot';
import { useTurnstile } from '../../hooks/useTurnstile';
import { Turnstile } from '@marsidev/react-turnstile';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface SampleLeadFormProps {
  preselectedDekor?: string;
}

const label = 'mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-muted';
const field =
  'w-full rounded-[10px] border border-brand-line bg-white px-4 py-3 text-base text-brand-dark placeholder:text-brand-muted transition-colors focus:border-brand-dark focus:outline-none';

/**
 * Free-sample request form (lead). Submits through submit-quote (Turnstile verified server-side)
 * and reports the lead to Meta (Lead) and GA4 (generate_lead) — keep those calls when restyling.
 */
export const SampleLeadForm: React.FC<SampleLeadFormProps> = ({ preselectedDekor = '' }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [agreedToVOP, setAgreedToVOP] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [dekorValue, setDekorValue] = useState('');
  const { products } = useShopifyProducts();

  useEffect(() => {
    if (preselectedDekor) setDekorValue(preselectedDekor);
  }, [preselectedDekor]);
  const { honeypotValue, setHoneypotValue, isBot } = useHoneypot();
  const { turnstileRef, turnstileToken, setTurnstileToken, reset: resetTurnstile } = useTurnstile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBot) return;
    if (!turnstileToken) { setStatus('error'); setErrorMsg('Prosím, potvrďte, že nie ste robot.'); return; }
    if (!formRef.current) return;

    setStatus('loading');
    setErrorMsg('');

    const fd = new FormData(formRef.current);
    const name = String(fd.get('from_name') ?? '').trim();
    const email = String(fd.get('from_email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const dekor = String(fd.get('dekor') ?? '').trim();

    if (!agreedToVOP) {
      setStatus('error');
      setErrorMsg('Prosím, súhlaste s VOP a ochranou osobných údajov.');
      return;
    }

    // Turnstile is verified SERVER-SIDE in submit-quote (finding f02); the token is
    // single-use, so it is forwarded, not redeemed here.
    const result = await submitSampleLead({
      name,
      email,
      phone: phone || undefined,
      dekor,
    }, turnstileToken);

    if (result.success) {
      trackMetaEvent('Lead', {
        content_name: dekor,
        content_category: 'Sample Request',
      });
      trackGA4Event('generate_lead', {
        currency: 'EUR',
        value: 20,
        lead_source: 'sample_request',
        item_name: dekor,
      });
      if (newsletterConsent) {
        await subscribeToNewsletter({ email, name, source: 'sample_lead' });
      }
      setStatus('success');
    } else {
      // Token is single-use — reset the widget so a retry gets a fresh one.
      resetTurnstile();
      setStatus('error');
      setErrorMsg(
        result.error
          ? `${result.error} Skúste nás kontaktovať priamo na dopyt@orostone.sk`
          : 'Niečo sa nepodarilo. Skúste nás kontaktovať priamo na dopyt@orostone.sk',
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="flex w-full flex-col items-start gap-3 rounded-[10px] border border-brand-line bg-white p-8">
        <CheckCircle className="h-10 w-10 text-brand-dark" strokeWidth={1.5} />
        <h4 className="text-os-h3">Vzorka je na ceste.</h4>
        <p className="font-light text-brand-muted">Vzorku odošleme do 2–3 pracovných dní. Potvrdenie pošleme e-mailom.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid w-full max-w-[520px] gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={label}>Meno a priezvisko *</label>
          <input id="lead-name" type="text" name="from_name" required placeholder="Ján Novák" autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="lead-email" className={label}>Email *</label>
          <input id="lead-email" type="email" name="from_email" required placeholder="jan.novak@email.sk" autoComplete="email" className={field} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-phone" className={label}>
            Telefón <span className="font-normal normal-case tracking-normal">(nepovinné)</span>
          </label>
          <input id="lead-phone" type="tel" name="phone" placeholder="+421 9XX XXX XXX" autoComplete="tel" className={field} />
        </div>
        <div>
          <label htmlFor="lead-dekor" className={label}>Dekor *</label>
          <select
            id="lead-dekor"
            name="dekor"
            required
            value={dekorValue}
            onChange={(e) => setDekorValue(e.target.value)}
            className={`${field} appearance-none`}
          >
            <option value="" disabled>Vyberte dekor…</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} — €{p.pricePerM2}/m²
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VOP súhlas — povinný */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agreedToVOP}
          onChange={(e) => setAgreedToVOP(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-brand-line accent-brand-dark"
        />
        <span className="text-[0.8rem] font-normal text-brand-muted">
          Súhlasím s{' '}
          <Link to="/vop" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-dark">obchodnými podmienkami</Link>
          {' '}a{' '}
          <Link to="/ochrana-sukromia" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-dark">ochranou osobných údajov</Link>
          {' '}*
        </span>
      </label>

      {/* Newsletter súhlas — voliteľný */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={newsletterConsent}
          onChange={(e) => setNewsletterConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-brand-line accent-brand-dark"
        />
        <span className="text-[0.8rem] font-normal text-brand-muted">
          Súhlasím so zasielaním noviniek a marketingových ponúk na moju e-mailovú adresu (voliteľné)
        </span>
      </label>

      {status === 'error' && <p className="text-sm text-red-700">{errorMsg}</p>}

      {/* Honeypot — skryté pred používateľmi, odhalí boty */}
      <input type="text" name="website" value={honeypotValue} onChange={(e) => setHoneypotValue(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {/* Turnstile CAPTCHA */}
      <Turnstile
        ref={turnstileRef}
        siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        options={{ theme: 'light', language: 'sk' }}
      />

      {/* Until the terms box is ticked the button is a light outline (not a heavy grey block); while sending it stays dark */}
      <button
        type="submit"
        disabled={status === 'loading' || !agreedToVOP}
        className={`os-press inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[10px] border px-[26px] text-[0.78rem] font-bold uppercase leading-none tracking-[0.12em] sm:w-auto ${
          status === 'loading'
            ? 'cursor-wait border-brand-dark bg-brand-dark text-brand-light'
            : agreedToVOP
              ? 'border-brand-dark bg-brand-dark text-brand-light hover:bg-[#333331]'
              : 'cursor-not-allowed border-brand-line bg-brand-sand text-brand-muted'
        }`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Odosielam…
          </>
        ) : (
          'Chcem vzorku zadarmo'
        )}
      </button>
      <p className="text-[0.82rem] font-normal text-brand-muted">Vzorka zadarmo · Bez záväzkov · Odpovieme do 24 h</p>
    </form>
  );
};
