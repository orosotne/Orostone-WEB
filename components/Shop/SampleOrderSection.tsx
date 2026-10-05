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
  { quantity, onQuantityChange, quantityFeedback, onSelectionChange, onBusyChange, browserRef, carouselButtonRef }, ref,
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
    <section id="vzorka" className="sample-order" aria-labelledby="sample-order-title">
      <div className="sample-order-inner">
        <div className="sample-order-heading">
          <div><h2 id="sample-order-title">Skontrolujte svoj výber</h2><p>Každá vzorka má vlastnú krabičku. Dekor môžete odstrániť a nahradiť iným.</p></div>
          <a className="sample-order-change" href="#sample-quantity-order" aria-label="Zmeniť počet vzoriek">{quantity} {quantity === 1 ? 'vzorka' : 'vzorky'} · Zmeniť počet</a>
        </div>
        <div className="sample-order-layout">
          <div className="sample-order-materials">
            <SampleQuantityPicker id="sample-quantity-order" value={quantity} onChange={onQuantityChange} disabled={busy} feedback={quantityFeedback} />
            <SampleCartonTray ref={trayRef} quantity={quantity} locked={checkoutBusy} onSelectionChange={updateSelection} onBusyChange={setTrayBusy} onContinue={() => {
              checkoutButtonRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
              checkoutButtonRef.current?.focus({ preventScroll: true });
            }} browserRef={browserRef} carouselButtonRef={carouselButtonRef} />
            <details className="sample-list-picker">
              <summary>Vybrať dekor zo zoznamu</summary>
              <label htmlFor="sample-order-decor">Pridať dekor do výberu</label>
              <select id="sample-order-decor" value="" disabled={busy || complete} onChange={(event) => {
                const decor = SAMPLE_DECORS.find((item) => item.id === event.target.value);
                if (decor) void trayRef.current?.insert(decor);
              }}>
                <option value="">{complete ? 'Výber je kompletný' : 'Vyberte dekor…'}</option>
                {SAMPLE_DECORS.map((decor) => <option key={decor.id} value={decor.id} disabled={selection.some((item) => item.id === decor.id)}>{decor.name}</option>)}
              </select>
              {complete ? <p>Ak chcete iný dekor, najprv ho odstráňte z krabičky.</p> : null}
            </details>
          </div>
          <aside className="sample-order-summary" aria-labelledby="sample-summary-title">
            <h3 id="sample-summary-title">Cena vášho balenia</h3>
            <dl className="sample-order-prices">
              <div><dt>Prvá vzorka · zadarmo</dt><dd>0,00 €</dd></div>
              {quantity > 1 ? <div><dt>{quantity - 1} × ďalšia vzorka</dt><dd>{formatSamplePrice(quote.samplesCents)}</dd></div> : null}
              <div><dt>Doprava na Slovensko</dt><dd>2,50 €</dd></div>
              <div className="sample-order-total"><dt>Spolu s dopravou</dt><dd>{formatSamplePrice(quote.totalCents)}</dd></div>
            </dl>
            {!complete ? <p className="sample-order-incomplete">Vyberte ešte {quantity - selection.length} {quantity - selection.length === 1 ? 'dekor' : 'dekory'} a pokračujte k doručeniu.</p> : null}
            {error ? <div role="alert" className="mt-4 text-sm leading-relaxed text-red-700"><p>{error}</p>{!ready ? <button type="button" onClick={() => void checkAvailability()} disabled={availabilityLoading} className="mt-2 min-h-11 underline underline-offset-4">Overiť dostupnosť znova</button> : null}</div> : null}
            {bundle && !ready ? <p role="status" className="mt-4 text-sm text-gray-600">Balenie pre tento počet vzoriek teraz nie je dostupné.</p> : null}
            <button ref={checkoutButtonRef} type="button" onClick={() => void proceedToCheckout()} disabled={busy || !complete || !ready} className="sample-order-checkout">
              {checkoutBusy || availabilityLoading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
              {checkoutBusy ? 'Pripravujeme pokladňu…' : availabilityLoading ? 'Overujeme dostupnosť…' : 'Pokračovať k doručeniu a platbe'}
            </button>
            <p className="sample-order-next">Adresu a spôsob platby doplníte v ďalšom kroku.</p>
          </aside>
        </div>
      </div>
    </section>
  );
});
