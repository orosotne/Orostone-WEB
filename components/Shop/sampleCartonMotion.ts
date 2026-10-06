import { MOTION_TIMING, STONE_FINISH, STONE_PHOTOS } from './sampleMotionConfig';

export interface SampleDecor { id: string; name: string; image: string }
export type SampleQuantity = 1 | 2 | 3;
// Native Creator exports contain nested, type-specific keyframe structures.
export type NativeMotionData = Record<string, any>;
export interface LottieAnimation {
  /** Lottie SVG can report DOMLoaded while its raster images are still loading. */
  isLoaded?: boolean;
  imagePreloader?: { loadedImages(): boolean };
  addEventListener(name: string, listener: () => void): void;
  removeEventListener(name: string, listener: () => void): void;
  resetSegments(force: boolean): void;
  goToAndStop(frame: number, isFrame: boolean): void;
  setSpeed(speed: number): void;
  playSegments(frames: number[], force: boolean): void;
  destroy(): void;
}
interface LottieRuntime { loadAnimation(options: Record<string, unknown>): LottieAnimation }
interface MotionAssets { runtime: LottieRuntime; cartons: NativeMotionData; removal: NativeMotionData[] }
const ASSET_ROOT = '/sample-motion/assets/';
export const SCENE_VIEW = '104 205 720 315';
export const cartonLeft = (n: number, packed = false) => 464 - (202 + (n - 1) * (packed ? 180 : 235)) / 2;
export { MOTION_TIMING };
let assetsPromise: Promise<MotionAssets> | undefined;
let exposureSequence = 0;
const decodedMotionImages = new Map<string, Promise<void>>();
interface MotionReadyOptions { signal?: AbortSignal; timeoutMs?: number }
const motionAbortReason = (signal: AbortSignal) => signal.reason ?? new DOMException('Motion preparation aborted', 'AbortError');

function decodeMotionImage(url: string, timeoutMs: number): Promise<void> {
  const cached = decodedMotionImages.get(url);
  if (cached) return cached;
  const pending = new Promise<void>((resolve, reject) => {
    const image = new Image(); image.decoding = 'async';
    let settled = false, decoding = false;
    const finish = (error?: Error) => {
      if (settled) return; settled = true; clearTimeout(timer); image.onload = null; image.onerror = null;
      if (error) reject(error); else resolve();
    };
    const loaded = () => {
      if (decoding || settled) return; decoding = true;
      if (!image.naturalWidth || !image.naturalHeight) { finish(new Error('Motion image unavailable')); return; }
      // onload alone does not guarantee that an asynchronously decoded image
      // can be painted into the first frame of a new SVG or its flight clone.
      const decoded = typeof image.decode === 'function' ? image.decode() : Promise.resolve();
      void decoded.then(() => finish(), () => finish(new Error('Motion image failed to decode')));
    };
    image.onload = loaded; image.onerror = () => finish(new Error('Motion image failed to load'));
    const timer = setTimeout(() => finish(new Error('Motion image timeout')), timeoutMs);
    image.src = url;
    if (image.complete && image.naturalWidth > 0) loaded();
  });
  decodedMotionImages.set(url, pending);
  // A failed or timed-out URL must be retried on a later selection. Successful
  // promises remain cached, and concurrent mounts share the same preparation.
  void pending.catch(() => { if (decodedMotionImages.get(url) === pending) decodedMotionImages.delete(url); });
  return pending;
}

/** Warm an authentic model photograph without creating or changing a selection. */
export function preloadSampleTexture(decor: SampleDecor): Promise<void> {
  const name = decor.id + '.webp';
  const path = name in STONE_PHOTOS ? ASSET_ROOT + 'textures-hd/' + name : decor.image;
  return decodeMotionImage(new URL(path, document.baseURI).href, 12000);
}

/** Prepare only the raster assets reachable in the already-pruned motion data. */
export function waitForMotionImages(data: NativeMotionData, { signal, timeoutMs = 12000 }: MotionReadyOptions = {}): Promise<void> {
  if (signal?.aborted) return Promise.reject(motionAbortReason(signal));
  const urls = new Set<string>();
  for (const asset of data.assets ?? []) {
    if (typeof asset.p !== 'string' || !asset.p) continue;
    const path = (asset.e ? '' : asset.u ?? '') + asset.p;
    urls.add(new URL(path, document.baseURI).href);
  }
  const prepared = Promise.all(Array.from(urls, url => decodeMotionImage(url, timeoutMs))).then(() => undefined);
  if (!signal) return prepared;
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = (error?: unknown) => {
      if (settled) return; settled = true; signal.removeEventListener('abort', aborted);
      if (error !== undefined) reject(error); else resolve();
    };
    const aborted = () => finish(motionAbortReason(signal));
    signal.addEventListener('abort', aborted, { once: true });
    void prepared.then(() => finish(), error => finish(error));
  });
}

/** DOMLoaded and loaded_images are independent readiness gates for SVG Lottie. */
export function awaitLottieReady(animation: LottieAnimation, { signal, timeoutMs = 12000 }: MotionReadyOptions = {}): Promise<void> {
  if (signal?.aborted) return Promise.reject(motionAbortReason(signal));
  return new Promise<void>((resolve, reject) => {
    let settled = false, domReady = animation.isLoaded === true, imagesReady = false;
    const cleanup = () => {
      clearTimeout(timer); signal?.removeEventListener('abort', aborted);
      animation.removeEventListener('DOMLoaded', domLoaded); animation.removeEventListener('loaded_images', imagesLoaded);
      animation.removeEventListener('data_failed', failed); animation.removeEventListener('error', failed); animation.removeEventListener('destroy', destroyed);
    };
    const finish = (error?: unknown) => { if (settled) return; settled = true; cleanup(); if (error !== undefined) reject(error); else resolve(); };
    const check = () => {
      domReady ||= animation.isLoaded === true;
      // Before configuration, the preloader has zero assets and reports true.
      // That empty snapshot must not count as readiness for later raster URLs.
      imagesReady ||= domReady && animation.imagePreloader?.loadedImages() === true;
      if (domReady && imagesReady) finish();
    };
    const domLoaded = () => { domReady = true; check(); }, imagesLoaded = () => { imagesReady = true; check(); };
    const failed = () => finish(new Error('Motion rendering failed')), destroyed = () => finish(new Error('Motion animation destroyed'));
    const aborted = () => finish(signal ? motionAbortReason(signal) : new DOMException('Motion preparation aborted', 'AbortError'));
    const timer = setTimeout(() => finish(new Error('Motion readiness timeout')), timeoutMs);
    animation.addEventListener('DOMLoaded', domLoaded); animation.addEventListener('loaded_images', imagesLoaded);
    animation.addEventListener('data_failed', failed); animation.addEventListener('error', failed); animation.addEventListener('destroy', destroyed);
    signal?.addEventListener('abort', aborted, { once: true });
    // Both events may have fired before this helper was attached on a cached
    // fast mount; the runtime state closes that gap without adding a delay.
    check();
  });
}

export function loadMotionAssets(): Promise<MotionAssets> {
  if (assetsPromise) return assetsPromise;
  assetsPromise = (async () => {
    const runtimePromise = new Promise<LottieRuntime>((resolve, reject) => {
      const getRuntime = () => (window as unknown as { lottie?: LottieRuntime }).lottie;
      const existing = getRuntime();
      if (existing) { resolve(existing); return; }
      const script = document.createElement('script');
      script.src = ASSET_ROOT + 'lottie-svg.min.js'; script.async = true;
      let timer: ReturnType<typeof setTimeout>;
      const finish = (error?: Error) => {
        clearTimeout(timer); script.onload = null; script.onerror = null;
        const runtime = getRuntime();
        if (error || !runtime) { script.remove(); reject(error ?? new Error('Motion runtime unavailable')); }
        else resolve(runtime);
      };
      script.onload = () => finish(); script.onerror = () => finish(new Error('Motion runtime failed to load'));
      timer = setTimeout(() => finish(new Error('Motion runtime timeout')), 10000);
      document.head.append(script);
    });
    const read = async (path: string) => {
      const response = await fetch('/sample-motion/' + path, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error('Motion asset unavailable');
      return response.json();
    };
    const [runtime, cartons, removal] = await Promise.all([runtimePromise, read('cartons.json'), read('removal.json')]);
    return { runtime, cartons, removal };
  })().catch(error => { assetsPromise = undefined; throw error; });
  return assetsPromise;
}

export const freezeFrame = (animation: LottieAnimation, frame: number) => {
  animation.resetSegments(true); animation.goToAndStop(frame, true);
};

export function makeCartonData(assets: MotionAssets, slots: (SampleDecor | null)[], visible: number[], mode: 'idle' | 'insert' | 'remove' | 'package', activeIndex = -1): NativeMotionData {
  const data = structuredClone(assets.cartons), byId = new Map<string, NativeMotionData>(data.assets.map((a: NativeMotionData) => [a.id, a]));
  const occupied = visible.filter(i => slots[i]), n = occupied.length, ids = mode === 'package' ? occupied : visible;
  const startLeft = cartonLeft(visible.length), packedLeft = cartonLeft(Math.max(n, 1), true), bundleOffset = packedLeft - 157;
  data.layers = data.layers.filter((l: NativeMotionData) => l.nm !== 'Súprava / check' && (!l.nm.startsWith('Samostatná krabička') || ids.includes(Number(l.nm.slice(-1)) - 1)));
  for (const box of data.layers.filter((l: NativeMotionData) => l.nm.startsWith('Samostatná krabička'))) {
    const i = Number(box.nm.slice(-1)) - 1, offset = i * MOTION_TIMING.box, decor = slots[i];
    box.cl = 'sample-carton sample-carton-' + i;
    const removing = mode === 'remove' && i === activeIndex, empty = !decor;
    if (removing || empty) {
      const carton = structuredClone(assets.removal[i]);
      data.assets[data.assets.findIndex((a: NativeMotionData) => a.id === box.refId)] = carton; byId.set(carton.id, carton);
      if (empty) { box.tm = { a: 0, k: MOTION_TIMING.removal.end / 30 }; carton.layers = carton.layers.filter((l: NativeMotionData) => !l.nm.startsWith('Vzorka') && !l.nm.startsWith('Pečať') && !l.nm.endsWith('seal-front')); }
      else delete box.tm;
    } else if (mode === 'insert' && i === activeIndex) {
      box.tm = { a: 1, k: [{ t: 0, s: [offset / 30], o: { x: 0, y: 0 }, i: { x: 1, y: 1 } }, { t: MOTION_TIMING.box, s: [(offset + MOTION_TIMING.box) / 30] }] };
    } else box.tm = { a: 0, k: (offset + MOTION_TIMING.box) / 30 };
    const startX = 250 + startLeft - 125 + 235 * visible.indexOf(i) - 235 * i;
    if (mode === 'package') {
      const endX = 250 + packedLeft - 125 + 180 * occupied.indexOf(i) - 235 * i;
      box.ks.p = { a: 1, k: [{ t: 0, s: [startX, 250], o: { x: .4, y: 0 }, i: { x: .2, y: 1 } }, { t: MOTION_TIMING.join, s: [startX, 250], o: { x: .4, y: 0 }, i: { x: .2, y: 1 } }, { t: MOTION_TIMING.ribbon - 4, s: [endX, 250] }] };
    } else box.ks.p = { a: 0, k: [startX, 250] };
    if (!decor) continue;
    // Match the authentic slab photograph by model, independent of carousel URL.
    const photoName = decor.id + '.webp';
    const selectedAsset = byId.get('selected-' + i);
    if (selectedAsset) {
      selectedAsset.p = photoName in STONE_PHOTOS ? photoName : decor.image;
      if (!(photoName in STONE_PHOTOS)) { selectedAsset.u = ''; selectedAsset.e = 0; }
    }
    const palette = STONE_FINISH[decor.name as keyof typeof STONE_FINISH];
    const paint = (items: NativeMotionData[] = []) => { for (const item of items) {
      if (palette && item.ty === 'gf' && item.nm?.startsWith('Material / ')) {
        const colors = item.nm === 'Material / depth' ? [palette.top, palette.side] : [palette.bevel_top, palette.bevel_bottom];
        item.g.k.k = colors.flatMap((rgb, j) => [j, ...rgb.map(c => c / 255)]);
      }
      if (item.it) paint(item.it);
    } };
    for (const layer of byId.get(box.refId)?.layers ?? []) {
      if (layer.nm.startsWith('Vzorka')) layer.cl = 'sample-stone-' + i + (layer.refId === 'selected-' + i ? ' sample-stone-photo' : '');
      if (layer.nm.includes('fazeta 1 mm')) paint(layer.shapes);
      if (layer.nm.startsWith('Vzorka') && layer.ty === 0) for (const child of byId.get(layer.refId)?.layers ?? []) paint(child.shapes);
    }
  }
  const seamOffset = n === 1 ? 64 : 0;
  for (const axis of ['h', 'v']) {
    const ribbon = data.layers.find((l: NativeMotionData) => l.nm === 'Súprava / ribbon-' + axis);
    ribbon.cl = 'sample-ribbon sample-ribbon-' + axis; ribbon.refId = 'premium-ribbon-' + axis + '-' + Math.max(n, 1);
    ribbon.ks.p = { a: 0, k: [bundleOffset + (axis === 'v' ? seamOffset : 0), 0] };
  }
  const bow = data.layers.find((l: NativeMotionData) => l.nm === 'Súprava / bow');
  bow.cl = 'sample-bow'; bow.ks.p = { a: 0, k: [packedLeft + 180 * Math.floor(n / 2) + 26 + seamOffset, 381] };
  if (mode !== 'package') data.layers = data.layers.filter((l: NativeMotionData) => l.nm.startsWith('Samostatná krabička'));
  const used = new Set<string>();
  const walk = (layers: NativeMotionData[]) => { for (const l of layers) if (l.refId && !used.has(l.refId)) { used.add(l.refId); walk(byId.get(l.refId)?.layers ?? []); } };
  walk(data.layers); data.assets = data.assets.filter((a: NativeMotionData) => used.has(a.id));
  const replaced = new Set<string>(), originals: NativeMotionData[] = [];
  data.assets = data.assets.map((asset: NativeMotionData) => {
    if (!asset.id.startsWith('selected-') || !asset.p) return asset;
    const name = asset.p.split('?')[0], photo = STONE_PHOTOS[name as keyof typeof STONE_PHOTOS];
    if (!photo) return asset;
    const ref = 'stone-hd-' + name.replace('.webp', '');
    if (!originals.some(a => a.id === ref)) originals.push({ id: ref, w: photo.width, h: photo.height, u: ASSET_ROOT + 'textures-hd/', p: name, e: 0 });
    replaced.add(asset.id); const scale = 120 / photo.width * 100;
    return { id: asset.id, w: 400, h: 400, layers: [{ ty: 2, ind: 1, nm: 'Originál kameňa / ' + name, refId: ref, ip: 0, op: Math.max(data.op, 600), st: 0, ks: { a: { a: 0, k: [photo.width / 2, photo.height / 2] }, p: { a: 0, k: [200, 200] }, s: { a: 0, k: [scale, scale] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } } }] };
  });
  for (const layer of [data, ...data.assets].flatMap(a => a.layers ?? [])) if (layer.ty === 2 && replaced.has(layer.refId)) { layer.ty = 0; layer.w = 400; layer.h = 400; }
  data.assets.push(...originals);
  for (const asset of data.assets) if (asset.u?.startsWith('assets/')) asset.u = '/sample-motion/' + asset.u;
  return data;
}

export function applyStoneExposure(svg: SVGSVGElement) {
  const ns = 'http://www.w3.org/2000/svg', filters = new Map<string, string>();
  for (const image of svg.querySelectorAll('image')) {
    if (image.parentElement?.localName === 'defs') continue;
    const href = image.getAttribute('href') || image.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
    const name = href.split('/').pop()?.split('?')[0] ?? '', nero = name === 'nero-margiua.webp';
    const photo = href.includes('/textures-hd/') ? STONE_PHOTOS[name as keyof typeof STONE_PHOTOS] : undefined;
    if (!photo && !nero) continue;
    let id = filters.get(name);
    if (!id) {
      id = 'orostone-stone-exposure-' + (++exposureSequence); filters.set(name, id);
      const filter = document.createElementNS(ns, 'filter');
      for (const [key, value] of Object.entries({ id, x: '0', y: '0', width: '100%', height: '100%', 'color-interpolation-filters': 'sRGB' })) filter.setAttribute(key, value);
      const transfer = document.createElementNS(ns, 'feComponentTransfer'), slope = nero ? 1.14 : 1;
      for (const [i, channel] of ['R', 'G', 'B'].entries()) {
        const fn = document.createElementNS(ns, 'feFunc' + channel);
        fn.setAttribute('type', 'linear'); fn.setAttribute('slope', String(slope)); fn.setAttribute('intercept', String((photo?.offset[i] || 0) * slope - (nero ? .005 : 0))); transfer.append(fn);
      }
      filter.append(transfer); svg.querySelector('defs')?.append(filter);
    }
    image.setAttribute('filter', 'url(#' + id + ')');
  }
}
