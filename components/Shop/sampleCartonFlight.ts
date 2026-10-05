import type { SampleDecor } from './sampleCartonMotion';
const ns = 'http://www.w3.org/2000/svg';
const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const smooth = (n: number) => n * n * (3 - 2 * n);
const point = (x: number, y: number, m: DOMMatrix) => new DOMPoint(x, y).matrixTransform(m);
let serial = 0;
export function siteHeaderBottom() {
  const rect = document.querySelector('header')?.getBoundingClientRect();
  return rect && rect.top <= 2 && rect.height < 200 ? Math.max(0, rect.bottom) : 0;
}
export interface FlightSource { img: HTMLImageElement; product: SampleDecor; rect: DOMRect; scrollY: number; width: number; height: number }
export function createSampleFlight() {
  let finishActive: ((reason: string) => void) | undefined;
  const cancel = (reason = 'cancelled') => finishActive?.(reason);
  const capture = (img: HTMLImageElement | undefined, product: SampleDecor): FlightSource | null => {
    if (!img?.isConnected || !img.complete) return null;
    const rect = img.getBoundingClientRect();
    if (rect.width < 20 || rect.bottom <= siteHeaderBottom() || rect.top >= innerHeight || rect.right <= 0 || rect.left >= innerWidth) return null;
    return { img, product, rect, scrollY, width: innerWidth, height: innerHeight };
  };
  const run = (svg: SVGSVGElement, index: number, source: FlightSource | null): Promise<{ started: boolean }> => {
    cancel('replaced');
    if (!source || document.hidden) return Promise.resolve({ started: false });
    const { img, product } = source, now = img.getBoundingClientRect(), world = svg.getScreenCTM();
    if (!img.isConnected || !world || now.right <= 0 || now.left >= innerWidth || source.width !== innerWidth || source.height !== innerHeight || Math.abs(source.scrollY - scrollY) > 3 || Math.abs(source.rect.top - now.top) > 4) return Promise.resolve({ started: false });
    const groups = Array.from(svg.querySelectorAll<SVGGraphicsElement>('.sample-stone-' + index));
    if (groups.length !== 3) return Promise.resolve({ started: false });
    const inverse = world.inverse(); let x = Infinity, y = Infinity, right = -Infinity, bottom = -Infinity;
    for (const group of groups.filter(g => !g.classList.contains('sample-stone-photo'))) for (const path of group.querySelectorAll('path')) {
      const b = path.getBBox(), matrix = path.getScreenCTM(); if (!matrix) continue;
      const m = inverse.multiply(matrix);
      for (const [px, py] of [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]) {
        const p = point(px, py, m); x = Math.min(x, p.x); y = Math.min(y, p.y); right = Math.max(right, p.x); bottom = Math.max(bottom, p.y);
      }
    }
    if (!Number.isFinite(x) || right - x < 1) return Promise.resolve({ started: false });
    const bounds = { x: x - .5, y: y - .5, width: right - x + 1, height: bottom - y + 1 };
    const a = point(bounds.x, bounds.y, world), b = point(bounds.x + bounds.width, bounds.y + bounds.height, world);
    const target = { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y }, header = siteHeaderBottom();
    if (target.y < header || target.y + target.height > innerHeight || target.x < 0 || target.x + target.width > innerWidth) return Promise.resolve({ started: false });
    const copy = document.createElementNS(ns, 'svg');
    copy.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`); copy.setAttribute('preserveAspectRatio', 'none'); copy.setAttribute('aria-hidden', 'true');
    const defs = svg.querySelector('defs'); if (defs) copy.append(defs.cloneNode(true));
    for (const group of groups) {
      const matrix = (group.parentNode as SVGGraphicsElement).getScreenCTM(); if (!matrix) continue;
      const m = inverse.multiply(matrix), wrapper = document.createElementNS(ns, 'g');
      wrapper.setAttribute('transform', `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`); wrapper.append(group.cloneNode(true)); copy.append(wrapper);
    }
    const ids = new Map<string, string>(), prefix = 'sample-flight-' + (++serial) + '-';
    copy.querySelectorAll('[id]').forEach(el => { const id = el.id; ids.set(id, prefix + id); el.id = prefix + id; });
    for (const el of copy.querySelectorAll('*')) for (const attr of Array.from(el.attributes)) {
      let value = attr.value;
      if (value.startsWith('#') && ids.has(value.slice(1))) value = '#' + ids.get(value.slice(1));
      value = value.replace(/url\(#([^)]*)\)/g, (whole, id) => ids.has(id) ? 'url(#' + ids.get(id) + ')' : whole);
      if (value !== attr.value) el.setAttributeNS(attr.namespaceURI, attr.name, value);
    }
    const crop = product.name === 'NERO MARGIUA' ? [36, 49, 365, 356] : [35, 49, 365, 357];
    const from = { x: now.left + now.width * crop[0] / 400, y: now.top + now.height * crop[1] / 400, width: now.width * (crop[2] - crop[0]) / 400, height: now.height * (crop[3] - crop[1]) / 400 };
    const screen = document.createElement('div'); screen.className = 'sample-carton-flight-screen'; screen.setAttribute('aria-hidden', 'true'); screen.style.clipPath = `inset(${header}px 0 0)`;
    const overlay = document.createElement('div'); overlay.className = 'sample-carton-flight'; overlay.style.width = target.width + 'px'; overlay.style.height = target.height + 'px';
    const photo = img.cloneNode(false) as HTMLImageElement; photo.removeAttribute('id'); photo.removeAttribute('class'); photo.alt = '';
    photo.style.cssText = `left:${-crop[0] / (crop[2] - crop[0]) * 100}%;top:${-crop[1] / (crop[3] - crop[1]) * 100}%;width:${400 / (crop[2] - crop[0]) * 100}%;height:${400 / (crop[3] - crop[1]) * 100}%`;
    overlay.append(photo, copy); screen.append(overlay); document.body.append(screen);
    const visibility = groups.map(g => g.style.visibility); groups.forEach(g => g.style.visibility = 'hidden');
    const imageOpacity = img.style.opacity; img.style.opacity = '0';
    const start = { x: from.x + from.width / 2, y: from.y + from.height / 2 }, end = { x: target.x + target.width / 2, y: target.y + target.height / 2 };
    const distance = Math.hypot(end.x - start.x, end.y - start.y), duration = clamp(560 + distance * .35, 620, 900), lift = Math.min(28, distance * .08), approach = clamp(Math.abs(end.y - start.y) * .35, 35, 110);
    const c1 = { x: start.x + (end.x - start.x) * .42, y: start.y - lift }, c2 = { x: end.x, y: end.y - approach };
    let raf = 0, startTime: number | undefined, settled = false;
    return new Promise(resolve => {
      const stop = () => finish('viewport-change'), hidden = () => { if (document.hidden) finish('hidden'); };
      const finish = (_reason: string) => {
        if (settled) return; settled = true; cancelAnimationFrame(raf);
        groups.forEach((g, i) => g.style.visibility = visibility[i]); img.style.opacity = imageOpacity; screen.remove();
        removeEventListener('resize', stop); removeEventListener('scroll', stop); document.removeEventListener('visibilitychange', hidden); window.visualViewport?.removeEventListener('resize', stop);
        if (finishActive === finish) finishActive = undefined; resolve({ started: true });
      };
      finishActive = finish;
      addEventListener('resize', stop); addEventListener('scroll', stop, { passive: true }); document.addEventListener('visibilitychange', hidden); window.visualViewport?.addEventListener('resize', stop);
      const render = (progress: number) => {
        const t = smooth(progress), u = 1 - t;
        const px = u * u * u * start.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * end.x;
        const py = u * u * u * start.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * end.y;
        overlay.style.transform = `translate3d(${px - target.width / 2}px,${py - target.height / 2}px,0) rotate(${-3 * Math.sin(Math.PI * t)}deg) scale(${(from.width + (target.width - from.width) * t) / target.width},${(from.height + (target.height - from.height) * t) / target.height})`;
        const blend = smooth(clamp((progress - .08) / .36)); photo.style.opacity = String(1 - blend); copy.style.opacity = String(blend);
        overlay.style.filter = `drop-shadow(0 ${6 * (1 - t)}px ${8 * (1 - t)}px #161b161c)`;
      };
      const tick = (time: number) => { if (settled) return; startTime ??= time; const progress = clamp((time - startTime) / duration); render(progress); if (progress === 1) finish('landed'); else raf = requestAnimationFrame(tick); };
      render(0); raf = requestAnimationFrame(tick);
    });
  };
  return { capture, run, cancel, destroy: () => cancel('unmount') };
}
