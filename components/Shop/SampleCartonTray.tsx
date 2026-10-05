import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { applyStoneExposure, cartonLeft, freezeFrame, loadMotionAssets, makeCartonData, MOTION_TIMING as timing, SCENE_VIEW } from './sampleCartonMotion';
import type { LottieAnimation, SampleDecor, SampleQuantity } from './sampleCartonMotion';
import { createSampleFlight, siteHeaderBottom } from './sampleCartonFlight';
import { formatSamplePrice, quoteSampleOrder } from '../../services/shopify/samples';
import './SampleCartonTray.css';
export type { SampleDecor, SampleQuantity } from './sampleCartonMotion';
export interface SampleCartonTrayHandle {
  insert(decor: SampleDecor, source?: HTMLImageElement): Promise<boolean>;
  remove(id: string): Promise<boolean>;
  setQuantity(quantity: SampleQuantity): Promise<boolean>;
  packageSelection(): Promise<void>;
}
export interface SampleCartonTrayProps {
  quantity: SampleQuantity;
  onSelectionChange(decor: SampleDecor[]): void;
  onBusyChange?(busy: boolean): void;
  onContinue(): void;
  browserRef: RefObject<HTMLElement | null>;
  carouselButtonRef: RefObject<HTMLButtonElement | null>;
  className?: string;
  /** Lock edits while the selected models are being passed to checkout. */
  locked?: boolean;
}
interface TrayView { slots: (SampleDecor | null)[]; visible: number[]; quantity: SampleQuantity; busy: boolean; packed: boolean; fallback: boolean; motionFailed: boolean; message: string }
const isMobile = () => innerWidth <= 640 || (innerWidth <= 950 && innerHeight <= 500);
const editingField = () => document.activeElement?.matches('input:not([type="radio"]):not([type="checkbox"]),select,textarea') ?? false;
const initialView = (quantity: SampleQuantity): TrayView => ({ slots: [null, null, null], visible: Array.from({ length: quantity }, (_, i) => i), quantity, busy: false, packed: false, fallback: true, motionFailed: false, message: '' });

/** Native carton illustration only: checkout never depends on motion availability. */
const SampleCartonTray = forwardRef<SampleCartonTrayHandle, SampleCartonTrayProps>(function SampleCartonTray(props, ref) {
  const svgId = useId().replaceAll(':', '');
  const homeRef = useRef<HTMLDivElement>(null), trayRef = useRef<HTMLElement>(null), graphicRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(() => initialView(props.quantity)), [docked, setDocked] = useState(false);
  const model = useRef(initialView(props.quantity)), preferredSlot = useRef<number | null>(null), callbacks = useRef(props); callbacks.current = props;
  const animation = useRef<LottieAnimation | null>(null), mountVersion = useRef(0), operationVersion = useRef(0), alive = useRef(false);
  const segmentDone = useRef<(() => void) | null>(null), segmentEnd = useRef<number | null>(null), reduced = useRef(false), flight = useRef(createSampleFlight());
  const pendingMounts = useRef(new Map<LottieAnimation, () => void>()), pendingQuantityProp = useRef<SampleQuantity | null>(null);
  const transferring = useRef(false), dockRaf = useRef(0), isDocked = useRef(false), dockFits = useRef(false), homeHeight = useRef(0), scrollDone = useRef<(() => void) | null>(null);
  const count = () => model.current.slots.filter(Boolean).length;
  const refresh = () => { if (alive.current) setView({ ...model.current, slots: [...model.current.slots], visible: [...model.current.visible] }); };
  const notifySelection = () => callbacks.current.onSelectionChange(model.current.visible.map(i => model.current.slots[i]).filter((p): p is SampleDecor => !!p));
  const setBusy = (busy: boolean) => { const changed = model.current.busy !== busy; model.current.busy = busy; refresh(); if (changed) callbacks.current.onBusyChange?.(busy); };
  const setMessage = (message: string) => { model.current.message = message; refresh(); };
  const syncDock = () => {
    dockRaf.current = 0; if (!alive.current || transferring.current) return;
    const home = homeRef.current, tray = trayRef.current, browser = callbacks.current.browserRef.current, button = callbacks.current.carouselButtonRef.current;
    if (!home || !tray || !browser || !button) return;
    const browserRect = browser.getBoundingClientRect(), buttonRect = button.getBoundingClientRect(), homeRect = home.getBoundingClientRect();
    const viewport = window.visualViewport?.height || innerHeight, header = siteHeaderBottom(), mobile = isMobile();
    const desktopWidth = viewport <= 800 ? 290 : innerWidth <= 1100 ? 310 : 480;
    const width = Math.max(0, Math.min(home.clientWidth, mobile ? innerWidth > 640 ? 310 : 480 : desktopWidth, innerWidth - (mobile ? 48 : 80)));
    const trayHeight = width * 315 / 720 + 140, minimum = innerWidth > 640 && mobile ? 240 : 420;
    const room = (mobile || width >= 240) && viewport - header >= trayHeight + (mobile ? minimum + 16 : 120);
    dockFits.current = room;
    browser.style.setProperty('--mobile-browser-height', Math.max(minimum, viewport - header - (room ? trayHeight + 16 : 0)) + 'px'); browser.style.setProperty('--mobile-header-bottom', header + 'px');
    const inBrowser = (mobile ? browserRect.top <= header + 20 : browserRect.top < viewport - trayHeight - 16) && buttonRect.bottom > header;
    const homeVisible = homeRect.top < viewport - Math.min(homeHeight.current || 360, 360) && homeRect.bottom > header;
    const orderRect = home.closest('.sample-order')?.getBoundingClientRect();
    // Release the floating panel as the order enters the reading area, so
    // the quantity control and its price breakdown remain accessible.
    const readingOrder = orderRect && orderRect.top < header + (viewport - header) / 2;
    // A centered desktop tray must sit below the carousel's click target.
    // Keep its scale fixed while scrolling; only dock when both fit.
    const clearsButton = mobile || viewport - 12 - 16 - buttonRect.bottom >= trayHeight;
    const next = inBrowser && !homeVisible && !readingOrder && !editingField() && room && clearsButton;
    if (!isDocked.current) homeHeight.current = tray.getBoundingClientRect().height;
    tray.style.setProperty('--tray-width', width + 'px');
    tray.style.setProperty('--tray-center-x', browserRect.left + browserRect.width / 2 + 'px');
    home.style.minHeight = next ? homeHeight.current + 'px' : '';
    if (next !== isDocked.current) { isDocked.current = next; setDocked(next); }
  };
  const scheduleDock = () => { if (alive.current && !dockRaf.current) dockRaf.current = requestAnimationFrame(syncDock); };
  const centerBrowser = async () => {
    const browser = callbacks.current.browserRef.current;
    if (!browser || editingField() || reduced.current) { syncDock(); return; }
    await new Promise<void>(resolve => requestAnimationFrame(() => {
      if (!alive.current) { resolve(); return; } syncDock();
      const rect = browser.getBoundingClientRect(), top = siteHeaderBottom(), bottom = isDocked.current ? (trayRef.current?.getBoundingClientRect().top ?? innerHeight) - 12 : (window.visualViewport?.height || innerHeight);
      // When both panels fit, align the carousel below the header so docking
      // can show the flight's source and destination together on mobile.
      const button = callbacks.current.carouselButtonRef.current, tray = trayRef.current;
      const trayHeight = parseFloat(tray?.style.getPropertyValue('--tray-width') || '0') * 315 / 720 + 140;
      let distance = 0;
      if (isMobile()) distance = dockFits.current || rect.height > bottom - top + 24 ? rect.top - top - 12 : rect.top + rect.height / 2 - (top + bottom) / 2;
      else if (dockFits.current && button) distance = button.getBoundingClientRect().bottom - ((window.visualViewport?.height || innerHeight) - 32 - trayHeight);
      if (Math.abs(distance) <= 2) { resolve(); return; }
      let timer: ReturnType<typeof setTimeout>;
      const done = () => { clearTimeout(timer); removeEventListener('scrollend', done); if (scrollDone.current === done) scrollDone.current = null; resolve(); };
      scrollDone.current = done; timer = setTimeout(done, 550); addEventListener('scrollend', done, { once: true }); window.scrollBy({ top: distance, behavior: 'smooth' });
    }));
  };
  const playSegment = (start: number, end: number, speed = 1) => {
    const anim = animation.current; if (!anim) return Promise.resolve(); segmentDone.current?.();
    segmentEnd.current = end;
    if (reduced.current || document.hidden) { freezeFrame(anim, end); return Promise.resolve(); }
    return new Promise<void>(resolve => {
      let settled = false, timer: ReturnType<typeof setTimeout>;
      const done = () => { if (settled) return; settled = true; clearTimeout(timer); anim.removeEventListener('complete', done); if (segmentDone.current === done) { segmentDone.current = null; segmentEnd.current = null; } resolve(); };
      segmentDone.current = done; anim.addEventListener('complete', done); anim.setSpeed(speed); anim.playSegments([start, end], true);
      timer = setTimeout(() => { if (animation.current === anim) freezeFrame(anim, end); done(); }, Math.abs(end - start) / 30 / speed * 1000 + 400);
    });
  };
  const renderMotion = async (mode: 'idle' | 'insert' | 'remove' | 'package' = 'idle', activeIndex = -1, source?: HTMLImageElement) => {
    const version = ++mountVersion.current, host = graphicRef.current; flight.current.cancel('mount');
    const assets = await loadMotionAssets(); if (!alive.current || version !== mountVersion.current || !host) return;
    const data = makeCartonData(assets, model.current.slots, model.current.visible, mode, activeIndex);
    const layer = document.createElement('div'); layer.className = 'sample-carton-player'; layer.style.visibility = 'hidden'; host.append(layer);
    const anim = assets.runtime.loadAnimation({ container: layer, renderer: 'svg', loop: false, autoplay: false, animationData: data, rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false } });
    try { await new Promise<void>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout>;
      const cleanup = () => { clearTimeout(timer); pendingMounts.current.delete(anim); anim.removeEventListener('DOMLoaded', loaded); anim.removeEventListener('data_failed', failed); anim.removeEventListener('error', failed); };
      const loaded = () => { cleanup(); resolve(); }, failed = () => { cleanup(); reject(new Error('Motion rendering failed')); };
      pendingMounts.current.set(anim, failed);
      timer = setTimeout(failed, 8000); anim.addEventListener('DOMLoaded', loaded); anim.addEventListener('data_failed', failed); anim.addEventListener('error', failed);
    }); } catch (error) { anim.destroy(); layer.remove(); throw error; }
    if (!alive.current || version !== mountVersion.current) { anim.destroy(); layer.remove(); return; }
    segmentDone.current?.(); animation.current?.destroy(); host.querySelectorAll('.sample-carton-player').forEach(node => { if (node !== layer) node.remove(); });
    const svg = layer.querySelector('svg'); if (!svg) { anim.destroy(); layer.remove(); throw new Error('Motion SVG unavailable'); }
    svg.setAttribute('viewBox', SCENE_VIEW); applyStoneExposure(svg); animation.current = anim;
    model.current.fallback = false; model.current.motionFailed = false; model.current.packed = mode === 'package'; refresh();
    host.classList.toggle('is-inserting', mode === 'insert' && !reduced.current);
    host.classList.remove('is-removing');
    const captured = mode === 'insert' && !reduced.current ? flight.current.capture(source, model.current.slots[activeIndex]!) : null;
    let insertionStart = captured ? 20 : 16;
    freezeFrame(anim, mode === 'insert' ? insertionStart : mode === 'package' ? timing.join - 2 : 0); layer.style.visibility = 'visible';
    if (mode === 'insert') {
      if (captured) { const result = await flight.current.run(svg, activeIndex, captured); if (!result.started) { insertionStart = 16; freezeFrame(anim, 16); } }
      transferring.current = false; scheduleDock();
      for (const [start, end] of [[insertionStart, timing.stone_seated], [timing.stone_seated, timing.tuck_guide], [timing.tuck_guide, timing.lid_start], [timing.lid_start, timing.lid_lowered], [timing.lid_lowered, timing.lid_closed], [timing.lid_closed, timing.seal_done], [timing.seal_done, timing.box]]) {
        await playSegment(start, end); if (!alive.current || version !== mountVersion.current) return; if (end === timing.stone_seated) host.classList.remove('is-inserting');
      }
    } else if (mode === 'remove') {
      for (const [start, end] of [[0, timing.removal.seal_done], [timing.removal.seal_done, timing.removal.tuck_out], [timing.removal.tuck_out, timing.removal.lid_open], [timing.removal.lid_open, timing.removal.sides_open], [timing.removal.sides_open, timing.removal.end]]) {
        // The slab rises above the fixed scene crop before its native fade.
        if (start === timing.removal.sides_open && !reduced.current) host.classList.add('is-removing');
        await playSegment(start, end); if (!alive.current || version !== mountVersion.current) return;
      }
      freezeFrame(anim, timing.removal.end);
      host.classList.remove('is-removing');
    }
    scheduleDock();
  };
  const motionFallback = () => {
    transferring.current = false; flight.current.cancel('error'); segmentDone.current?.(); animation.current?.destroy(); animation.current = null;
    graphicRef.current?.querySelectorAll('.sample-carton-player').forEach(node => node.remove()); graphicRef.current?.classList.remove('is-inserting', 'is-removing');
    model.current.fallback = true; model.current.motionFailed = true; model.current.packed = false; refresh(); scheduleDock();
  };
  const insert = async (decor: SampleDecor, source?: HTMLImageElement) => {
    if (!alive.current || model.current.busy || callbacks.current.locked || !decor.id || model.current.slots.some(p => p?.id === decor.id) || count() >= model.current.quantity) return false;
    const run = ++operationVersion.current, wasPacked = model.current.packed;
    const index = preferredSlot.current !== null && model.current.visible.includes(preferredSlot.current) && !model.current.slots[preferredSlot.current] ? preferredSlot.current : model.current.visible.find(i => !model.current.slots[i]);
    if (index === undefined) return false;
    setBusy(true); model.current.slots[index] = { ...decor }; preferredSlot.current = null; notifySelection(); refresh();
    try {
      if (source && !reduced.current) await centerBrowser(); if (!alive.current || run !== operationVersion.current) return false;
      syncDock(); transferring.current = !!source && !reduced.current;
      if (wasPacked) await playSegment(timing.wrapped, timing.join, 2); await renderMotion('insert', index, source);
    } catch { if (alive.current && run === operationVersion.current) motionFallback(); }
    finally { if (alive.current && run === operationVersion.current) { transferring.current = false; setMessage(decor.name + ' je vo vašom výbere.'); setBusy(false); scheduleDock(); } }
    return alive.current && run === operationVersion.current;
  };
  const remove = async (id: string) => {
    if (!alive.current || model.current.busy || callbacks.current.locked) return false;
    const index = model.current.slots.findIndex(p => p?.id === id); if (index < 0) return false;
    const run = ++operationVersion.current, name = model.current.slots[index]!.name; setBusy(true);
    try { if (model.current.packed) await playSegment(timing.wrapped, timing.join, 2); await renderMotion('remove', index); }
    catch { if (alive.current && run === operationVersion.current) motionFallback(); }
    finally { if (alive.current && run === operationVersion.current) { model.current.slots[index] = null; preferredSlot.current = index; model.current.packed = false; notifySelection(); setMessage(name + ' bol odstránený. Krabička je pripravená pre iný dekor.'); setBusy(false); scheduleDock(); } }
    return alive.current && run === operationVersion.current;
  };
  const setQuantity = async (next: SampleQuantity) => {
    if (!alive.current || model.current.busy || callbacks.current.locked || ![1, 2, 3].includes(next)) return false;
    if (count() > next) { setMessage('Pred znížením počtu odstráňte dekor z výberu.'); return false; }
    if (next === model.current.quantity) return true;
    const run = ++operationVersion.current, slots = model.current.slots, visible = model.current.visible;
    model.current.visible = [...visible.filter(i => slots[i]), ...visible.filter(i => !slots[i]), ...[0, 1, 2].filter(i => !visible.includes(i))].slice(0, next).sort((a, b) => a - b);
    model.current.quantity = next; model.current.packed = false; if (preferredSlot.current !== null && !model.current.visible.includes(preferredSlot.current)) preferredSlot.current = null;
    setBusy(true); try { await renderMotion(); } catch { if (alive.current && run === operationVersion.current) motionFallback(); }
    finally { if (alive.current && run === operationVersion.current) { setBusy(false); scheduleDock(); } }
    return alive.current && run === operationVersion.current;
  };
  const packageSelection = async () => {
    if (!alive.current || model.current.busy || count() !== model.current.quantity) return;
    const run = ++operationVersion.current; setBusy(true);
    try { await renderMotion('package'); if (run === operationVersion.current) { await playSegment(timing.join, timing.ribbon, 1.1); await playSegment(timing.ribbon, timing.wrapped, 1.1); } }
    catch { if (alive.current && run === operationVersion.current) motionFallback(); }
    finally { if (alive.current && run === operationVersion.current) setBusy(false); }
  };
  useImperativeHandle(ref, () => ({ insert, remove, setQuantity, packageSelection }));
  useEffect(() => {
    alive.current = true;
    const media = matchMedia('(prefers-reduced-motion: reduce)'); reduced.current = media.matches;
    const change = () => { reduced.current = media.matches; if (media.matches) { flight.current.cancel('reduced-motion'); if (animation.current && segmentEnd.current !== null) freezeFrame(animation.current, segmentEnd.current); segmentDone.current?.(); } }; media.addEventListener('change', change);
    const resize = new ResizeObserver(scheduleDock);
    for (const element of [homeRef.current, trayRef.current, props.carouselButtonRef.current, props.browserRef.current]) if (element) resize.observe(element);
    void document.fonts.ready.then(scheduleDock);
    addEventListener('scroll', scheduleDock, { passive: true }); addEventListener('resize', scheduleDock); document.addEventListener('focusin', scheduleDock); document.addEventListener('focusout', scheduleDock); window.visualViewport?.addEventListener('resize', scheduleDock);
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); if (!model.current.busy && !animation.current) { const expectedVersion = mountVersion.current + 1; void renderMotion().catch(() => { if (alive.current && expectedVersion === mountVersion.current) motionFallback(); }); } } }, { rootMargin: '220px' });
    if (homeRef.current) observer.observe(homeRef.current); if (props.browserRef.current) observer.observe(props.browserRef.current); scheduleDock();
    return () => {
      alive.current = false; ++mountVersion.current; ++operationVersion.current; observer.disconnect(); resize.disconnect(); cancelAnimationFrame(dockRaf.current); dockRaf.current = 0;
      media.removeEventListener('change', change); removeEventListener('scroll', scheduleDock); removeEventListener('resize', scheduleDock); document.removeEventListener('focusin', scheduleDock); document.removeEventListener('focusout', scheduleDock); window.visualViewport?.removeEventListener('resize', scheduleDock);
      scrollDone.current?.(); segmentDone.current?.(); flight.current.destroy(); for (const cancel of pendingMounts.current.values()) cancel(); pendingMounts.current.clear(); animation.current?.destroy(); animation.current = null;
      props.browserRef.current?.style.removeProperty('--mobile-browser-height'); props.browserRef.current?.style.removeProperty('--mobile-header-bottom'); if (model.current.busy) callbacks.current.onBusyChange?.(false);
    };
  }, []);
  useEffect(() => { if (props.quantity !== model.current.quantity) { if (model.current.busy || props.locked) pendingQuantityProp.current = props.quantity; else void setQuantity(props.quantity); } }, [props.quantity]);
  useEffect(() => { if (!view.busy && !props.locked && pendingQuantityProp.current !== null) { const next = pendingQuantityProp.current; pendingQuantityProp.current = null; if (next !== model.current.quantity) void setQuantity(next); } }, [view.busy, props.locked]);
  const complete = view.slots.filter(Boolean).length === view.quantity;
  const ids = view.packed ? view.visible.filter(i => view.slots[i]) : view.visible;
  const labelLeft = (i: number) => ((cartonLeft(ids.length, view.packed) + (view.packed ? 180 : 235) * ids.indexOf(i) + 90 - 104) / 720 * 100) + '%';
  return <div ref={homeRef} className={'sample-carton-home ' + (props.className ?? '')}>
    <section ref={trayRef} className={'sample-carton-tray' + (docked ? ' is-docked' : '')} aria-label="Váš výber vzoriek" aria-busy={view.busy || props.locked} data-quantity={view.quantity} data-packed={view.packed}>
      <div className="sample-carton-heading"><div><p>Váš výber <strong>{view.slots.filter(Boolean).length} / {view.quantity}</strong></p><span>Spolu {formatSamplePrice(quoteSampleOrder(view.quantity).totalCents)} s&nbsp;dopravou</span></div><button type="button" className="sample-carton-continue" disabled={view.busy || props.locked || !complete} onClick={props.onContinue}>Skontrolovať <span aria-hidden="true">→</span></button></div>
      <div ref={graphicRef} className="sample-carton-graphic" aria-hidden="true">
        {view.fallback && <svg className="sample-carton-fallback" viewBox={SCENE_VIEW}>{view.visible.map((i, rank) => <g key={i} transform={'translate(' + (cartonLeft(view.visible.length) + 235 * rank) + ',310)'}>
          {!view.slots[i] && <><path d="M22 -14 L202 -14 L180 -62 L0 -62 Z" fill="#252920"/><path d="M0 0 L22 -14 L-5 -30 L-22 -16 Z" fill="#30362b"/><path d="M180 0 L202 -14 L220 -30 L196 -10 Z" fill="#30362b"/></>}
          <path d="M180 0 L202 -14 L202 166 L180 180 Z" fill="#191e18"/><path d="M0 0 L22 -14 L202 -14 L180 0 Z" fill="#30362b"/><rect width="180" height="180" fill="#242822"/><circle cx="90" cy="80" r="47" fill="#10150f"/>
          {view.slots[i] && <svg x="43" y="33" width="94" height="94" viewBox="0 0 94 94"><defs><clipPath id={svgId + '-circle-' + i}><circle cx="47" cy="47" r="47"/></clipPath></defs><image href={view.slots[i]!.image} x="-100" y="-100" width="294" height="294" clipPath={'url(#' + svgId + '-circle-' + i + ')'}/></svg>}
          {[51, 75, 99, 123].map(x => <rect key={x} x={x} y="34" width="9" height="92" fill="#242822"/>)}
          <defs><mask id={svgId + '-logo-' + i} maskUnits="userSpaceOnUse" x="44" y="143" width="92" height="24"><image href="/sample-motion/assets/orostone-logo-white.svg" x="44" y="143" width="92" height="24"/></mask></defs>
          <image href="/sample-motion/assets/gold-foil-printed-v20.webp" x="44" y="143" width="92" height="24" preserveAspectRatio="none" mask={'url(#' + svgId + '-logo-' + i + ')'}/>
        </g>)}</svg>}
      </div>
      <div className="sample-carton-labels">{view.visible.map((i, rank) => <div key={i} className={'sample-carton-label' + (view.slots[i] ? ' is-filled' : '')} style={{ left: labelLeft(i) }}>
        <span>{view.slots[i]?.name ?? 'Krabička ' + (rank + 1)}</span><button type="button" disabled={view.busy || props.locked || (!view.slots[i] && complete)} aria-label={view.slots[i] ? 'Odstrániť ' + view.slots[i]!.name : 'Vybrať dekor do krabičky ' + (rank + 1)} onClick={() => {
          const decor = model.current.slots[i]; if (decor) { void remove(decor.id); return; } preferredSlot.current = i; callbacks.current.browserRef.current?.scrollIntoView({ behavior: reduced.current ? 'instant' : 'smooth', block: 'center' }); callbacks.current.carouselButtonRef.current?.focus({ preventScroll: true });
        }}>{view.slots[i] ? 'Odstrániť' : 'Vybrať dekor'}</button>
      </div>)}</div>
      <p className="sample-carton-live" role="status" aria-live="polite">{view.message}</p>{view.motionFailed && <p className="sample-carton-fallback-note">Výber je uložený. V objednávke môžete pokračovať.</p>}
    </section>
  </div>;
});
export default SampleCartonTray;
