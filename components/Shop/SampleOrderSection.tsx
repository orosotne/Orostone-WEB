import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import SampleCartonTray, { type SampleCartonTrayHandle, type SampleDecor } from './SampleCartonTray';
import { SampleQuantityPicker } from './SampleQuantityPicker';
import { SAMPLE_DECORS } from '../../data/sample-decors';
import { createSampleCheckout, fetchSampleBundle, formatSamplePrice, quoteSampleOrder, type SampleQuantity } from '../../services/shopify/samples';

export interface SampleOrderSectionHandle {
  addSample: (decor: SampleDecor, source?: HTMLImageElement) => Promise<boolean>;
}

interface SampleOrderSectionProps {
  quantity: SampleQuantity;
  onQuantityChange: (quantity: SampleQuantity) => void;
  onSelectionChange: (selection: SampleDecor[]) => void;
  onBusyChange: (busy: boolean) => void;
  quantityFeedback: string;
  browserRef: React.RefObject<HTMLElement | null>;
  carouselButtonRef: React.RefObject<HTMLButtonElement | null>;
}

/** Customer ordering: contact details and payment are collected only by Shopify. */
export const SampleOrderSection = forwardRef<SampleOrderSectionHandle, SampleOrderSectionProps>(function SampleOrderSection(
  { quantity, onQuantityChange, onSelectionChange, onBusyChange, quantityFeedback, browserRef, carouselButtonRef }, ref,
) {
  const trayRef = useRef<SampleCartonTrayHandle>(null);
  const checkoutButtonRef = useRef<HTMLButtonElement>(null);
  const [selection, setSelection] = useState<SampleDecor[]>([]);
  const [trayBusy, setTrayBusy] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [bundle, setBundle] = useState<Awaited<ReturnType<typeof fetchSampleBundle>> | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [error, setError] = useState('');
  const mounted = useRef(true);
  const checkoutInFlight = useRef(false);
  const ready = Boolean(bundle?.variants[quantity].availableForSale);
  const busy = trayBusy || checkoutBusy;
  const complete = selection.length === quantity;
  const quote = quoteSampleOrder(quantity);

  const checkAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    try {
      const currentBundle = await fetchSampleBundle();
      if (mounted.current) { setBundle(currentBundle); setError(''); }
    } catch (failure) {
      if (mounted.current) {
        setBundle(null);
        setError(failure instanceof Error ? failure.message : 'Objednávanie vzoriek teraz nie je dostupné. Skúste to neskôr.');
      }
    } finally { if (mounted.current) setAvailabilityLoading(false); }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void checkAvailability();
    return () => { mounted.current = false; };
  }, [checkAvailability]);

  useEffect(() => { onBusyChange(busy); }, [busy, onBusyChange]);

  useImperativeHandle(ref, () => ({
    addSample: async (decor, source) => {
      if (busy || !trayRef.current) return false;
      return trayRef.current.insert(decor, source);
    },
  }), [busy]);

  const updateSelection = useCallback((next: SampleDecor[]) => {
    setSelection(next);
    onSelectionChange(next);
  }, [onSelectionChange]);

  const proceedToCheckout = async () => {
    if (!complete || busy || !ready || checkoutInFlight.current) return;
    checkoutInFlight.current = true;
    setCheckoutBusy(true);
    setError('');
    try {
      const [checkout] = await Promise.all([
        createSampleCheckout({ decorIds: selection.map((decor) => decor.id) }),
        trayRef.current?.packageSelection(),
      ]);
      if (!mounted.current) return;
      // This creates a cart, never an order or a "paid" success state.
      window.location.assign(checkout.checkoutUrl);
    } catch (failure) {
      if (mounted.current) {
        setError(failure instanceof Error ? failure.message : 'Pokladňu sa nepodarilo otvoriť. Váš výber zostal uložený. Skúste to znova.');
        setCheckoutBusy(false);
        checkoutInFlight.current = false;
      }
    }
  };

  return (
    <section id="vzorka" className="bg-brand-light px-6 py-10 md:py-14">
      <div className="mx-auto max-w-5xl rounded-[3px] bg-white p-5 ring-1 ring-brand-line md:p-8">
        <h2 className="mb-1 text-os-h3 text-brand-dark">Váš výber vzoriek</h2>
        <p className="mb-6 text-sm font-normal text-brand-muted">Každú vzorku 10 × 10 cm zabalíme do vlastnej krabičky. Výber môžete kedykoľvek zmeniť.</p>
        <SampleQuantityPicker id="sample-quantity-order" value={quantity} onChange={onQuantityChange} disabled={busy} feedback={quantityFeedback} />
        <div className="mx-auto my-5 max-w-[580px]">
          <label htmlFor="sample-order-decor" className="mb-2 block text-os-eyebrow uppercase text-brand-muted">Pridať dekor do výberu</label>
          <select id="sample-order-decor" value="" disabled={busy || complete} onChange={(event) => {
            const decor = SAMPLE_DECORS.find((item) => item.id === event.target.value);
            if (decor) void trayRef.current?.insert(decor);
          }} className="w-full rounded-[10px] border border-brand-line bg-white px-4 py-3 text-base text-brand-dark focus:border-brand-dark focus:outline-none disabled:bg-brand-light disabled:text-brand-muted">
            <option value="">{complete ? 'Vybraný počet je kompletný' : 'Vyberte dekor…'}</option>
            {SAMPLE_DECORS.map((decor) => <option key={decor.id} value={decor.id} disabled={selection.some((item) => item.id === decor.id)}>{decor.name}</option>)}
          </select>
        </div>
        <SampleCartonTray ref={trayRef} quantity={quantity} locked={checkoutBusy} onSelectionChange={updateSelection} onBusyChange={setTrayBusy} onContinue={() => {
          checkoutButtonRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
          checkoutButtonRef.current?.focus({ preventScroll: true });
        }} browserRef={browserRef} carouselButtonRef={carouselButtonRef} />
        <div className="mx-auto mt-5 max-w-[580px] border-t border-brand-line pt-5">
          <dl className="space-y-2 text-sm text-brand-muted [&_dd]:shrink-0 [&_dd]:whitespace-nowrap [&_dd]:tabular-nums">
            <div className="flex justify-between gap-4"><dt>Prvá vzorka — zadarmo</dt><dd>0,00 €</dd></div>
            {quantity > 1 ? <div className="flex justify-between gap-4"><dt>{quantity - 1} × ďalšia vzorka</dt><dd>{formatSamplePrice(quote.samplesCents)}</dd></div> : null}
            <div className="flex justify-between gap-4"><dt>Doprava za celé balenie na Slovensko</dt><dd>2,50 €</dd></div>
            <div className="flex justify-between gap-4 pt-1 text-base font-bold text-brand-dark"><dt>Spolu s dopravou</dt><dd>{formatSamplePrice(quote.totalCents)}</dd></div>
          </dl>
          {error ? <div role="alert" className="mt-4 text-sm leading-relaxed text-red-700"><p>{error}</p>{!ready ? <button type="button" onClick={() => void checkAvailability()} disabled={availabilityLoading} className="mt-2 underline underline-offset-4">Overiť dostupnosť znova</button> : null}</div> : null}
          {bundle && !ready ? <p role="status" className="mt-4 text-sm text-brand-muted">Balenie pre tento počet vzoriek teraz nie je dostupné.</p> : null}
          <button ref={checkoutButtonRef} type="button" onClick={() => void proceedToCheckout()} disabled={busy || !complete || !ready} className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-3 px-5 rounded-[10px] bg-brand-dark text-[0.78rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors hover:bg-[#333331] disabled:cursor-not-allowed disabled:opacity-50">
            {checkoutBusy || availabilityLoading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
            {checkoutBusy ? 'Pripravujeme pokladňu…' : availabilityLoading ? 'Overujeme dostupnosť…' : 'Pokračovať k doručeniu a platbe'}
          </button>
          <p className="mt-3 text-center text-xs leading-relaxed text-brand-muted">Doručovaciu adresu a spôsob platby doplníte v pokladni Shopify. Objednávku dokončíte až tam.</p>
        </div>
      </div>
    </section>
  );
});
